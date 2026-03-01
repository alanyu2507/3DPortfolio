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
import { useState, useContext, useMemo, useEffect } from "react";
import "./HudOverlay.css";
import { CameraContext } from "../Contexts/CameraContext";

export type HudMode = "WORKSHOP" | "LAB" | "BEDROOM";

export interface HudOverlayProps {
  activeMode: HudMode;
  onModeChange: (mode: HudMode) => void;
  onSelectUnit?: (id: string) => void;
  onProjectFocus?: (
    target: { lookAt: [number, number, number]; zoomFov: number },
    projectId: string
  ) => void;
  onProjectPanelClose?: () => void;
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
  focusTarget: {
    lookAt: [number, number, number];
    zoomFov: number;
  };
  tabs: ProjectTab[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: "hexapod",
    name: "Modular Hexapod",
    placeholderCode: "PX-01",
    description: "Inverse Kinematics, Embedded Systems, Controls",
    focusTarget: {
      lookAt: [0.83, 0.95, 4.1],
      zoomFov: 20,
    },
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
    focusTarget: {
      lookAt: [-0.8, 0.9, 1.7],
      zoomFov: 38,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Project Orion is a data and telemetry workspace for surfacing mission-critical trends in real time.",
      },
      {
        id: "architecture",
        label: "Architecture",
        content:
          "Stack placeholder: define service boundaries, integration points, and ownership for each subsystem.",
      },
      {
        id: "notes",
        label: "Notes",
        content:
          "Risk placeholder: identify unknowns, mitigation steps, and target response windows per issue.",
      },
    ],
  },
  {
    id: "electric-motorcycle",
    name: "Electric Motorcycle",
    placeholderCode: "PX-03",
    description: "PCB Design, FreeRTOS",
    focusTarget: {
      lookAt: [0.5, 1.4, 2.4],
      zoomFov: 35,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Project Voyager tracks long-horizon research and translates exploratory work into build-ready initiatives.",
      },
      {
        id: "notes",
        label: "Notes",
        content:
          "Assets placeholder: link design references, technical specs, and implementation resources.",
      },
    ],
  },
];

const LAB_PROJECTS: ProjectItem[] = [
  {
    id: "lab-automation",
    name: "Lab Automation Cell",
    placeholderCode: "LB-01",
    description: "Sensor Fusion, Test Automation, QA Rigs",
    focusTarget: {
      lookAt: [-0.4, 1.1, 1.6],
      zoomFov: 40,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Automated validation station for repeatable hardware and software integration tests.",
      },
      {
        id: "hardware",
        label: "Hardware",
        content:
          "Placeholder hardware notes: fixture layout, instrumentation list, and power routing.",
      },
      {
        id: "results",
        label: "Results",
        content:
          "Placeholder metrics: pass/fail trendline, mean cycle time, and anomaly counts.",
      },
    ],
  },
  {
    id: "sterile-vision",
    name: "Sterile Vision Suite",
    placeholderCode: "LB-02",
    description: "Computer Vision, Data Pipelines, Monitoring",
    focusTarget: {
      lookAt: [1.2, 1.0, 0.6],
      zoomFov: 36,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Real-time visual inspection pipeline for identifying setup drift and procedural variance.",
      },
      {
        id: "pipeline",
        label: "Pipeline",
        content:
          "Placeholder pipeline notes: capture stage, preprocessing stage, and inference stage.",
      },
      {
        id: "notes",
        label: "Notes",
        content:
          "Placeholder notes: model versioning plan, retraining cadence, and quality controls.",
      },
    ],
  },
  {
    id: "ops-dashboard",
    name: "Ops Dashboard",
    placeholderCode: "LB-03",
    description: "Telemetry, Alerting, SOP Integration",
    focusTarget: {
      lookAt: [0.3, 1.3, -0.3],
      zoomFov: 34,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        content:
          "Unified operations board for tracking lab throughput, alerts, and readiness in one view.",
      },
      {
        id: "alerts",
        label: "Alerts",
        content:
          "Placeholder alerts section: escalation matrix, thresholds, and notification channels.",
      },
      {
        id: "runbook",
        label: "Runbook",
        content:
          "Placeholder runbook: startup checklist, fault response procedure, and shutdown sequence.",
      },
    ],
  },
];

export default function HudOverlay({
  activeMode,
  onModeChange,
  onSelectUnit,
  onProjectFocus,
  onProjectPanelClose,
}: HudOverlayProps) {
  const { hoveredObject } = useContext(CameraContext);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activeTabByProject, setActiveTabByProject] = useState<Record<string, string>>(
    {}
  );
  const activeProjects = useMemo(
    () => (activeMode === "LAB" ? LAB_PROJECTS : PROJECTS),
    [activeMode]
  );

  const isHovered = hoveredObject.includes("hover");

  useEffect(() => {
    setSelectedProjectId(null);
    onProjectPanelClose?.();
  }, [activeMode]);

  const handleProjectSelect = (projectId: string) => {
    const project = activeProjects.find((item) => item.id === projectId);
    if (!project) return;

    setSelectedProjectId(projectId);
    setActiveTabByProject((prev) => ({
      ...prev,
      [projectId]: prev[projectId] ?? project.tabs[0].id,
    }));
    onProjectFocus?.(project.focusTarget, projectId);
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
    onProjectPanelClose?.();
  };

  const activeProject = activeProjects.find((project) => project.id === selectedProjectId) ?? null;
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
                  aria-pressed={activeMode === "WORKSHOP"}
                  onClick={() => onModeChange("WORKSHOP")}
                >
                  WORKSHOP
                </button>
                <button
                  type="button"
                  className="hudTopButtons__btn"
                  aria-pressed={activeMode === "LAB"}
                  onClick={() => onModeChange("LAB")}
                >
                  LAB
                </button>
                <button
                  type="button"
                  className="hudTopButtons__btn"
                  aria-pressed={activeMode === "BEDROOM"}
                  onClick={() => onModeChange("BEDROOM")}
                >
                  BEDROOM
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
              {activeProjects.map((project) => (
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
