/**
 * Tactical surveillance HUD overlay. Renders above a Three.js canvas.
 * Only the left panel and top 3-button strip capture pointer events; rest passes through for mouse-look.
 *
 * Usage (layer above canvas):
 *
 *   import HudOverlay from "./components/HudOverlay";
 *
 *   function App() {
 *     return (
 *       <>
 *         <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, display: "block" }} />
 *         <HudOverlay onSelectUnit={(id) => console.log("Selected unit", id)} />
 *       </>
 *     );
 *   }
 */
import { useState, useContext } from "react";
import "./HudOverlay.css";
import { CameraContext } from "../Contexts/CameraContext";

export type HudMode = "SAT" | "POS" | "LAT";

export interface HudOverlayProps {
  onSelectUnit?: (id: string) => void;
}

interface ProjectTab {
  id: string;
  label: string;
  content: string;
  embedUrl?: string;
  bulletPoints?: string[];
}

interface ProjectItem {
  id: string;
  name: string;
  placeholderCode: string;
  description: string;
  tabs: ProjectTab[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: "hexapod",
    name: "Modular Hexapod",
    placeholderCode: "PX-01",
    description: "Inverse Kinematics, Embedded Systems, Controls",
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Modular Hexapod project overview:",
        embedUrl: "https://www.youtube.com/embed/_bQvNhBsuP8",
        bulletPoints: [
          "INVERSE KINEMATICS IMPLEMENTATION FOR 3-DOF LEGS",
          "CLOSED-LOOP FEEDBACK CONTROL FOR UNEVEN TERRAIN NAVIGATION AND SELF-BALANCING",
          "50MS RESPONSE LATENCY FOR REAL-TIME CONTROL",
          "MODULAR ATTACHMENT SYSTEM FOR DYNAMIC UTILITY INTEGRATION",
          "OPTIMIZED MULTI-THREADING AND MEMORY ALLOCATION TO AVOID CPU INTERRUPTS",
        ],
      },
      {
        id: "architecture",
        label: "Architecture",
        content:
          "Milestone placeholders: architecture review complete, prototype validation pending, deployment planning queued.",
      },
      {
        id: "notes",
        label: "Notes",
        content:
          "Notes placeholder: replace this with custom details, docs links, and engineering commentary for Aegis.",
      },
    ],
  },
  {
    id: "quadruped",
    name: "Quadruped",
    placeholderCode: "PX-02",
    description: "CAN, FreeRTOS, PicoSDK",
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Project Orion is a data and telemetry workspace for surfacing mission-critical trends in real time.",
      },
      {
        id: "stack",
        label: "Stack",
        content:
          "Stack placeholder: define service boundaries, integration points, and ownership for each subsystem.",
      },
      {
        id: "risks",
        label: "Risks",
        content:
          "Risk placeholder: identify unknowns, mitigation steps, and target response windows per issue.",
      },
    ],
  },
  {
    id: "project-voyager",
    name: "Project Voyager",
    placeholderCode: "PX-03",
    description: "Exploratory platform for long-range development initiatives.",
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Project Voyager tracks long-horizon research and translates exploratory work into build-ready initiatives.",
      },
      {
        id: "roadmap",
        label: "Roadmap",
        content:
          "Roadmap placeholder: phase planning, target release windows, and dependencies across teams.",
      },
      {
        id: "assets",
        label: "Assets",
        content:
          "Assets placeholder: link design references, technical specs, and implementation resources.",
      },
    ],
  },
];

export default function HudOverlay({ onSelectUnit }: HudOverlayProps) {
  const { hoveredObject } = useContext(CameraContext);
  const [activeMode, setActiveMode] = useState<HudMode>("SAT");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTabByProject, setActiveTabByProject] = useState<Record<string, string>>(
    {}
  );

  const isHovered = hoveredObject.includes("hover");

  const handleProjectSelect = (projectId: string) => {
    const project = PROJECTS.find((item) => item.id === projectId);
    if (!project) return;

    setSelectedProjectId(projectId);
    setActiveTabByProject((prev) => ({
      ...prev,
      [projectId]: prev[projectId] ?? project.tabs[0].id,
    }));
    onSelectUnit?.(projectId);
  };

  const handleTabSelect = (projectId: string, tabId: string) => {
    setActiveTabByProject((prev) => ({
      ...prev,
      [projectId]: tabId,
    }));
  };

  const closeProjectPanel = () => {
    setSelectedProjectId(null);
  };

  const activeProject = PROJECTS.find((project) => project.id === selectedProjectId) ?? null;
  const activeTabId = activeProject
    ? activeTabByProject[activeProject.id] ?? activeProject.tabs[0].id
    : null;
  const activeTab = activeProject?.tabs.find((tab) => tab.id === activeTabId) ?? null;

  return (
    <div className="hudRoot" aria-label="Tactical surveillance HUD overlay">
      {/* Fullscreen visual layers - never capture input */}
      <div className="hudContent">
        <div className="hudGrid" aria-hidden="true" />
        <div className="hudScanlines" aria-hidden="true" />
        <div className="hudVignette" aria-hidden="true" />
        <div className="hudDecor" aria-hidden="true">
          <span className="hudDecor__tick hudDecor__tick--01" />
          <span className="hudDecor__tick hudDecor__tick--02" />
          <span className="hudDecor__tick hudDecor__tick--03" />
        </div>

        {/* Interactive overlay - only children with pointer-events: auto receive input */}
        <div className="hudInteractive">
          {/* --- TOP BAR --- */}
          <header className="hudTopBar">
            <div className="hudTopBar__left">
              <span className="hudTopBar__label">SITE MAP</span>
              <span className="hudTopBar__value">LOCATION: MIDDLE EAST</span>
              <span className="hudTopBar__value">ASSIGNMENT: BRAVO GERONIMO</span>
              <span className="hudTopBar__value">MISSION TIME: 54:08 HOURS</span>
            </div>

            <div className="hudTopBar__center">
              <div className="hudTopButtons">
                <button
                  type="button"
                  className="hudTopButtons__btn"
                  aria-pressed={activeMode === "SAT"}
                  onClick={() => setActiveMode("SAT")}
                >
                  SAT
                </button>
                <button
                  type="button"
                  className="hudTopButtons__btn"
                  aria-pressed={activeMode === "POS"}
                  onClick={() => setActiveMode("POS")}
                >
                  POS
                </button>
                <button
                  type="button"
                  className="hudTopButtons__btn"
                  aria-pressed={activeMode === "LAT"}
                  onClick={() => setActiveMode("LAT")}
                >
                  LAT
                </button>
              </div>
            </div>

            <div className="hudTopBar__right">
              <span className="hudTopBar__datalink">DATALINK: STABLE</span>
              <span className="hudTopBar__value">MODE SELECT · REC MISSION</span>
              <span className="hudTopBar__coords">LAT W 142.8951 · N 36.4223</span>
            </div>
          </header>

          {/* --- LEFT PANEL (interactive) --- */}
          <aside className="hudLeftPanel">
            <div className="hudLeftPanel__header">
              <div className="hudLeftPanel__title">PROJECTS</div>
              <div className="hudLeftPanel__subtitle">SELECT A PROJECT TO OPEN PANEL</div>
            </div>
            <div className="hudLeftPanel__roster" role="listbox" aria-label="Projects list">
              {PROJECTS.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  role="option"
                  aria-selected={selectedProjectId === project.id}
                  className="hudLeftPanel__row"
                  onClick={() => handleProjectSelect(project.id)}
                >
                  <span className="hudLeftPanel__rowId">{project.placeholderCode}</span>
                  <span className="hudLeftPanel__rowName">{project.name}</span>
                  <span className="hudLeftPanel__rowStatus">OPEN</span>
                  {selectedProjectId === project.id && (
                    <span className="hudLeftPanel__rowTag">ACTIVE PANEL</span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {activeProject && activeTab && (
            <section className="hudProjectPanel" aria-label={`${activeProject.name} panel`}>
              <div className="hudProjectPanel__header">
                <button
                  type="button"
                  className="hudProjectPanel__closeBtn"
                  onClick={closeProjectPanel}
                  aria-label="Close project panel"
                >
                  x
                </button>
                <div className="hudProjectPanel__titleWrap">
                  <div className="hudProjectPanel__title">{activeProject.name}</div>
                  <div className="hudProjectPanel__subtitle">{activeProject.description}</div>
                </div>
              </div>

              <div className="hudProjectPanel__tabs" role="tablist" aria-label="Project tabs">
                {activeProject.tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={activeTabId === tab.id}
                    className="hudProjectPanel__tab"
                    onClick={() => handleTabSelect(activeProject.id, tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="hudProjectPanel__content" role="tabpanel">
                <div className="hudProjectPanel__contentBody">
                  <p className="hudProjectPanel__contentText">{activeTab.content}</p>
                  {activeTab.embedUrl && (
                    <div className="hudProjectPanel__videoWrap">
                      <iframe
                        className="hudProjectPanel__videoFrame"
                        src={activeTab.embedUrl}
                        title={`${activeProject.name} overview video`}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      />
                    </div>
                  )}
                  {activeTab.bulletPoints && activeTab.bulletPoints.length > 0 && (
                    <ul className="hudProjectPanel__bulletList">
                      {activeTab.bulletPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* --- BOTTOM LEFT (zoom / navigation) --- */}
          <div className="hudBottomLeft">
            <div className="hudBottomLeft__title">ZOOM / NAVIGATION</div>
            <div className="hudBottomLeft__zoomRow">
              <span className="hudBottomLeft__zoomPct">20%</span>
              <div className="hudBottomLeft__zoomBtns">
                <span className="hudBottomLeft__zoomBtn">+</span>
                <span className="hudBottomLeft__zoomBtn">−</span>
              </div>
            </div>
            <div className="hudBottomLeft__dpad">
              <span className="hudBottomLeft__dpadArrow" />
              <span className="hudBottomLeft__dpadArrow hudBottomLeft__dpadArrow--down" />
              <span className="hudBottomLeft__dpadArrow hudBottomLeft__dpadArrow--left" />
              <span className="hudBottomLeft__dpadArrow hudBottomLeft__dpadArrow--right" />
            </div>
            <div className="hudBottomLeft__ruler">
              <span className="hudBottomLeft__rulerLine" />
              <span className="hudBottomLeft__rulerLine" />
              <span className="hudBottomLeft__rulerLine" />
              <span className="hudBottomLeft__rulerLine" />
              <div className="hudBottomLeft__rulerLabel">MILES</div>
            </div>
          </div>

          {/* --- BOTTOM RIGHT (camfeed placeholder) --- */}
          <div className="hudBottomRight">
            <span className="hudBottomRight__corner hudBottomRight__corner--tl" aria-hidden="true" />
            <span className="hudBottomRight__corner hudBottomRight__corner--tr" aria-hidden="true" />
            <span className="hudBottomRight__corner hudBottomRight__corner--bl" aria-hidden="true" />
            <span className="hudBottomRight__corner hudBottomRight__corner--br" aria-hidden="true" />
            <div className="hudBottomRight__title">02 CAMFEED: LEAVE CHANNELS</div>
            <div className="hudBottomRight__feed">
              <span className="hudBottomRight__caption">VITAL 5</span>
              <span className="hudBottomRight__captionRight">AUDIO WITH LOCATION</span>
            </div>
          </div>

          {/* --- CENTER RETICLE (square corners only, same CSS/logic as Crosshair.tsx) --- */}
          <div className="hudCenterReticle">
            <div
              className={`hudCenterReticle__crosshair${isHovered ? " hudCenterReticle__crosshair--hovered" : ""}`}
              aria-hidden="true"
            />
          </div>

          {/* --- BOTTOM CENTER STATUS --- */}
          <div className="hudBottomCenter">CONNECTION: GOOD COMMS OPEN</div>
        </div>
      </div>
    </div>
  );
}
