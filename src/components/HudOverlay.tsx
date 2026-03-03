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
import {
  useState,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  type CSSProperties,
  type ComponentType,
} from "react";
import "./HudOverlay.css";
import { CameraContext } from "../Contexts/CameraContext";
import HexapodOverview from "../Project Panel/Workshop/Hexapod/Overview";
import HexapodArchitecture from "../Project Panel/Workshop/Hexapod/Architecture";
import HexapodNotes from "../Project Panel/Workshop/Hexapod/Notes";
import QuadrupedOverview from "../Project Panel/Workshop/Quadruped/Overview";
import QuadrupedNotes from "../Project Panel/Workshop/Quadruped/Notes";
import ElectricMotorcycleOverview from "../Project Panel/Workshop/ElectricMotorcycle/Overview";
import ElectricMotorcycleNotes from "../Project Panel/Workshop/ElectricMotorcycle/Notes";
import ServingMachineOverview from "../Project Panel/Workshop/ServingMachine/Overview";
import ServingMachineArchitecture from "../Project Panel/Workshop/ServingMachine/Architecture";
import ServingMachineNotes from "../Project Panel/Workshop/ServingMachine/Notes";
import AboutMeOverview from "../Project Panel/Bedroom/AboutMe/Overview";
import AboutMeSkills from "../Project Panel/Bedroom/AboutMe/Skills";
import AboutMeFunFacts from "../Project Panel/Bedroom/AboutMe/FunFacts";
import SoftwareProjectsOverview from "../Project Panel/Bedroom/SoftwareProjects/Overview";
import SoftwareProjectsPyOpticL from "../Project Panel/Bedroom/SoftwareProjects/PyOpticL";
import SoftwareProjectsTurnBasedToolkit from "../Project Panel/Bedroom/SoftwareProjects/TurnBasedToolkit";
import SoftwareProjectsEightBall from "../Project Panel/Bedroom/SoftwareProjects/EightBall";
import SoftwareProjectsAimlabs from "../Project Panel/Bedroom/SoftwareProjects/Aimlabs";
import BooksOverview from "../Project Panel/Bedroom/Books/Overview";
import BooksFavorites from "../Project Panel/Bedroom/Books/Favorites";
import BooksNotes from "../Project Panel/Bedroom/Books/Notes";

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
  isTransitionLoading?: boolean;
}

interface ProjectTab {
  id: string;
  label: string;
  Content: ComponentType;
  focusTarget?: {
    lookAt: [number, number, number];
    zoomFov: number;
  };
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

const CODE_STREAM_MAX_LINES = 7;
const CODE_PULSE_BOX_COUNT = 7;

const CODE_IDENTIFIERS = [
  "nodeMap",
  "signalCache",
  "hudState",
  "renderQueue",
  "packetStore",
  "frameDelta",
  "cursorAxis",
  "telemetryBus",
];

const CODE_TYPES = ["number", "string", "boolean", "Record<string, number>", "unknown[]"];

const CODE_ACTIONS = [
  "queueFrame",
  "hydratePanel",
  "syncTelemetry",
  "parsePayload",
  "flushBuffer",
  "stabilizeClock",
  "rebuildRoute",
];

const randomIndex = (max: number) => Math.floor(Math.random() * max);

const randomFrom = <T,>(items: T[]) => items[randomIndex(items.length)];

const randomCodeLine = () => {
  const indent = "\t".repeat(Math.floor(Math.random() * 3) + 1);
  const lineTypes = [
    () =>
      `const ${randomFrom(CODE_IDENTIFIERS)}: ${randomFrom(CODE_TYPES)} = ${Math.floor(
        Math.random() * 900 + 100
      )};`,
    () =>
      `if (${randomFrom(CODE_IDENTIFIERS)} && ${Math.random() < 0.5 ? "isReady" : "hasSignal"}) { ${randomFrom(
        CODE_ACTIONS
      )}(); }`,
    () =>
      `for (let i = 0; i < ${Math.floor(Math.random() * 6 + 3)}; i += 1) { ${randomFrom(
        CODE_IDENTIFIERS
      )}.push(i); }`,
    () =>
      `type ${Math.random() < 0.5 ? "TelemetryPacket" : "HudFrame"} = { id: string; ts: number; ok: boolean };`,
    () =>
      `await ${randomFrom(CODE_ACTIONS)}(${Math.random() < 0.5 ? "payload" : "context"});`,
    () =>
      `${randomFrom(CODE_IDENTIFIERS)} = ${randomFrom(CODE_IDENTIFIERS)}.filter((item) => item !== null);`,
  ];

  return `${indent}${lineTypes[randomIndex(lineTypes.length)]()}`;
};

const PROJECTS: ProjectItem[] = [
  {
    id: "hexapod",
    name: "Modular Hexapod",
    placeholderCode: "PX-01",
    description: "Inverse Kinematics, Embedded Systems, Controls",
    focusTarget: {
      lookAt: [0.84, 1.04, 4.1],
      zoomFov: 20,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        Content: HexapodOverview,
      },
      {
        id: "architecture",
        label: "Architecture",
        Content: HexapodArchitecture,
      },
      {
        id: "build-process",
        label: "Build Process",
        Content: HexapodNotes,
      },
    ],
  },
  {
    id: "quadruped",
    name: "Quadruped",
    placeholderCode: "PX-02",
    description: "CAN, FreeRTOS, PicoSDK",
    focusTarget: {
      lookAt: [-2.2, 1.14, 4.8],
      zoomFov: 15,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        Content: QuadrupedOverview,
      },

      {
        id: "notes",
        label: "Notes",
        Content: QuadrupedNotes,
      },
    ],
  },
  {
    id: "serving-machine",
    name: "Serving Machine",
    placeholderCode: "PX-03",
    description: "Mechatronics, CAD, 3D Printing",
    focusTarget: {
      lookAt: [-4.5, 0.06, 3.95],
      zoomFov: 14,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        Content: ServingMachineOverview,
      },
      {
        id: "architecture",
        label: "Architecture",
        Content: ServingMachineArchitecture,
      },
      {
        id: "build-process",
        label: "Build Process",
        Content: ServingMachineNotes,
      },
    ],
  },
  {
    id: "electric-motorbike",
    name: "Electric Motorbike",
    placeholderCode: "PX-04",
    description: "PCB Design, FreeRTOS",
    focusTarget: {
      lookAt: [-1.5, 1.1, 1.03],
      zoomFov: 25,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        Content: ElectricMotorcycleOverview,
      },
      {
        id: "notes",
        label: "Notes",
        Content: ElectricMotorcycleNotes,
      },
    ],
  },
];

const LAB_PROJECTS: ProjectItem[] = [
  {
    id: "about-me",
    name: "About Me",
    placeholderCode: "LB-01",
    description: "Background, Experience, and Focus",
    focusTarget: {
      lookAt: [-4.05, 1.26, -0.025],
      zoomFov: 10,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        Content: AboutMeOverview,
      },
      {
        id: "skills",
        label: "Skills",
        Content: AboutMeSkills,
      },
      {
        id: "notes",
        label: "Fun Facts",
        Content: AboutMeFunFacts,
      },
    ],
  },
  {
    id: "software-projects",
    name: "Software Projects",
    placeholderCode: "LB-03",
    description: "Selected builds and demos",
    focusTarget: {
      lookAt: [-2.7, 0.91, 2.09],
      zoomFov: 20,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        Content: SoftwareProjectsOverview,
        focusTarget: {
          lookAt: [-2.7, 0.91, 2.09],
          zoomFov: 20,
        },
      },
      {
        id: "pyopticl",
        label: "PyOpticL",
        Content: SoftwareProjectsPyOpticL,
        focusTarget: {
          lookAt: [-2.3, 0.95, 2.17],
          zoomFov: 12,
        },
      },
      {
        id: "turn-based-toolkit",
        label: "Turn-Based Toolkit",
        Content: SoftwareProjectsTurnBasedToolkit,
        focusTarget: {
          lookAt: [-3, 1, 1.8],
          zoomFov: 12,
        },
      },
      {
        id: "8-ball",
        label: "8-Ball",
        Content: SoftwareProjectsEightBall,
        focusTarget: {
          lookAt: [-2.9, 1.6, 1.89],
          zoomFov: 12,
        },
      },
      {
        id: "aimlabs",
        label: "Aimlabs",
        Content: SoftwareProjectsAimlabs,
        focusTarget: {
          lookAt: [-2.86, 0.485, 1.76],
          zoomFov: 12,
        },
      },
    ],
  },
  {
    id: "books",
    name: "Books",
    placeholderCode: "LB-02",
    description: "Reading List and Takeaways",
    focusTarget: {
      lookAt: [0.7, 0.63, 2.9],
      zoomFov: 15,
    },
    tabs: [
      {
        id: "overview",
        label: "Overview",
        Content: BooksOverview,
      },
      {
        id: "favorites",
        label: "Favorites",
        Content: BooksFavorites,
      },
      {
        id: "notes",
        label: "Notes",
        Content: BooksNotes,
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
  isTransitionLoading = false,
}: HudOverlayProps) {
  const CURSOR_RING_RADIUS = 34;
  const CURSOR_RING_CIRCUMFERENCE = 2 * Math.PI * CURSOR_RING_RADIUS;
  const CURSOR_BLINK_BOX_COUNT = 60;
  const CURSOR_BLINK_MAX_ACTIVE = 15;
  const CODE_TYPE_SPEED_MIN_MS = 1;
  const CODE_TYPE_SPEED_MAX_MS = 3;
  const CODE_LINE_ADVANCE_DELAY_MS = 20;
  const { hoveredObject, clickedObject, setClickedObject } = useContext(CameraContext);
  const suppressRaycastOpenUntilRef = useRef(0);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isHelpPanelOpen, setIsHelpPanelOpen] = useState(false);
  const [activeTabByProject, setActiveTabByProject] = useState<Record<string, string>>(
    {}
  );
  const [cursorPercent, setCursorPercent] = useState({ x: 50, y: 50 });
  const [blinkCells, setBlinkCells] = useState<
    { isOn: boolean; color: string; opacity: number; fadeMs: number; nextToggleAt: number }[]
  >(() =>
    Array.from({ length: CURSOR_BLINK_BOX_COUNT }, () => ({
      isOn: false,
      color: "rgba(70, 200, 255, 1)",
      opacity: 0,
      fadeMs: 1400,
      nextToggleAt: 0,
    }))
  );
  const [codeLogLines, setCodeLogLines] = useState<string[]>([]);
  const [codeTypingLine, setCodeTypingLine] = useState("");
  const [codeTargetLine, setCodeTargetLine] = useState(() => randomCodeLine());
  const [codePulseBoxes, setCodePulseBoxes] = useState<
    { isOn: boolean; opacity: number; fadeMs: number; nextToggleAt: number }[]
  >(() =>
    Array.from({ length: CODE_PULSE_BOX_COUNT }, () => ({
      isOn: false,
      opacity: 0,
      fadeMs: 900,
      nextToggleAt: 0,
    }))
  );
  const activeProjects = useMemo(
    () => (activeMode === "LAB" ? LAB_PROJECTS : PROJECTS),
    [activeMode]
  );

  const isHovered = hoveredObject.endsWith("-hover");

  useEffect(() => {
    setSelectedProjectId(null);
    setIsHelpPanelOpen(false);
    onProjectPanelClose?.();
  }, [activeMode]);

  useEffect(() => {
    const clampPercent = (value: number) => Math.max(0, Math.min(100, value));
    const handlePointerMove = (event: MouseEvent) => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const x = clampPercent((event.clientX / width) * 100);
      const y = clampPercent((event.clientY / height) * 100);
      setCursorPercent({ x: Math.round(x), y: Math.round(y) });
    };

    window.addEventListener("mousemove", handlePointerMove);
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

    if (codeTypingLine.length < codeTargetLine.length) {
      const timeoutId = window.setTimeout(() => {
        setCodeTypingLine(codeTargetLine.slice(0, codeTypingLine.length + 1));
      }, Math.round(randomBetween(CODE_TYPE_SPEED_MIN_MS, CODE_TYPE_SPEED_MAX_MS)));

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    const timeoutId = window.setTimeout(() => {
      setCodeLogLines((prev) => [...prev, codeTargetLine].slice(-CODE_STREAM_MAX_LINES));
      setCodeTypingLine("");
      setCodeTargetLine(randomCodeLine());
    }, CODE_LINE_ADVANCE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [codeTargetLine, codeTypingLine]);

  useEffect(() => {
    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
    const now = Date.now();

    setCodePulseBoxes((prev) =>
      prev.map((box) => ({
        ...box,
        nextToggleAt: now + randomBetween(120, 1600),
        fadeMs: Math.round(randomBetween(420, 1600)),
      }))
    );

    const intervalId = window.setInterval(() => {
      const tickNow = Date.now();

      setCodePulseBoxes((prev) =>
        prev.map((box) => {
          if (tickNow < box.nextToggleAt) return box;

          const turnOn = !box.isOn && Math.random() > 0.35;
          return {
            ...box,
            isOn: turnOn,
            opacity: turnOn ? Number(randomBetween(0.25, 0.95).toFixed(2)) : 0,
            fadeMs: Math.round(randomBetween(380, 1500)),
            nextToggleAt: tickNow + randomBetween(180, 1300),
          };
        })
      );
    }, 140);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
    const now = Date.now();
    setBlinkCells((prev) =>
      prev.map((cell) => ({
        ...cell,
        nextToggleAt: now + randomBetween(100, 2600),
        fadeMs: Math.round(randomBetween(900, 2200)),
      }))
    );

    const intervalId = window.setInterval(() => {
      const tickNow = Date.now();
      setBlinkCells((prev) => {
        let activeCount = prev.reduce((count, cell) => count + (cell.isOn ? 1 : 0), 0);
        return prev.map((cell) => {
          if (tickNow < cell.nextToggleAt) return cell;

          if (cell.isOn) {
            activeCount = Math.max(0, activeCount - 1);
            return {
              ...cell,
              isOn: false,
              opacity: 0,
              fadeMs: Math.round(randomBetween(1100, 2600)),
              nextToggleAt: tickNow + randomBetween(500, 2500),
            };
          }

          if (activeCount >= CURSOR_BLINK_MAX_ACTIVE) {
            return {
              ...cell,
              nextToggleAt: tickNow + randomBetween(250, 1200),
            };
          }

          if (Math.random() < 0.5) {
            activeCount += 1;
            return {
              ...cell,
              isOn: true,
              color: Math.random() < 0.5 ? "rgba(70, 200, 255, 1)" : "rgba(255, 255, 255, 1)",
              opacity: Number(randomBetween(0.3, 0.95).toFixed(2)),
              fadeMs: Math.round(randomBetween(1200, 2800)),
              nextToggleAt: tickNow + randomBetween(1200, 3400),
            };
          }

          return {
            ...cell,
            nextToggleAt: tickNow + randomBetween(350, 1600),
          };
        });
      });
    }, 180);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleProjectSelect = useCallback((projectId: string) => {
    const project = activeProjects.find((item) => item.id === projectId);
    if (!project) return;

    setIsHelpPanelOpen(false);
    setSelectedProjectId(projectId);
    setActiveTabByProject((prev) => ({
      ...prev,
      [projectId]: prev[projectId] ?? project.tabs[0].id,
    }));
    onProjectFocus?.(project.focusTarget, projectId);
    onSelectUnit?.(projectId);
  }, [activeProjects, onProjectFocus, onSelectUnit]);

  useEffect(() => {
    if (clickedObject === "None") return;
    if (Date.now() < suppressRaycastOpenUntilRef.current) {
      setClickedObject("None");
      return;
    }
    if (selectedProjectId || isHelpPanelOpen) {
      setClickedObject("None");
      return;
    }
    handleProjectSelect(clickedObject);
    setClickedObject("None");
  }, [clickedObject, handleProjectSelect, isHelpPanelOpen, selectedProjectId, setClickedObject]);

  const handleTabSelect = (projectId: string, tabId: string) => {
    setActiveTabByProject((prev) => ({
      ...prev,
      [projectId]: tabId,
    }));

    const project = activeProjects.find((item) => item.id === projectId);
    const tab = project?.tabs.find((item) => item.id === tabId);
    if (tab?.focusTarget) {
      onProjectFocus?.(tab.focusTarget, projectId);
    }
  };

  const closeProjectPanel = () => {
    suppressRaycastOpenUntilRef.current = Date.now() + 250;
    setClickedObject("None");
    setSelectedProjectId(null);
    setIsHelpPanelOpen(false);
    onProjectPanelClose?.();
  };

  const openHelpPanel = () => {
    setSelectedProjectId(null);
    setIsHelpPanelOpen(true);
    onProjectPanelClose?.();
  };

  const activeProject = activeProjects.find((project) => project.id === selectedProjectId) ?? null;
  const activeTabId = activeProject
    ? activeTabByProject[activeProject.id] ?? activeProject.tabs[0].id
    : null;
  const activeTab = activeProject?.tabs.find((tab) => tab.id === activeTabId) ?? null;
  const isAnyPanelOpen = Boolean(activeProject) || isHelpPanelOpen;

  return (
    <div
      className={`hudRoot${isAnyPanelOpen ? " hudRoot--projectPanelOpen" : ""}`}
      aria-label="Tactical surveillance HUD overlay"
    >
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
              <span className="hudTopBar__value">LOCATION: NIGHT CITY</span>
              <span className="hudTopBar__value">LOCAL TIME: 03:17</span>
              <span className="hudTopBar__value">ICE: ONLINE</span>
            </div>

            <div className="hudTopBar__center">
              <div className="hudTopButtons">
                <button
                  type="button"
                  className="hudTopButtons__btn"
                  aria-pressed={activeMode === "WORKSHOP"}
                  onClick={() => onModeChange("WORKSHOP")}
                  disabled={isTransitionLoading}
                >
                  WORKSHOP
                </button>
                <button
                  type="button"
                  className="hudTopButtons__btn"
                  aria-pressed={activeMode === "LAB"}
                  onClick={() => onModeChange("LAB")}
                  disabled={isTransitionLoading}
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
                <activeTab.Content />
              </div>
            </section>
          )}

          {isHelpPanelOpen && !activeProject && (
            <section className="hudProjectPanel" aria-label="Help panel">
              <div className="hudProjectPanel__header">
                <button
                  type="button"
                  className="hudProjectPanel__closeBtn"
                  onClick={closeProjectPanel}
                  aria-label="Close help panel"
                >
                  x
                </button>
                <div className="hudProjectPanel__titleWrap">
                  <div className="hudProjectPanel__title">Help</div>
                  <div className="hudProjectPanel__subtitle">How to use this site</div>
                </div>
              </div>

              <div className="hudProjectPanel__content" role="region" aria-label="Help content">
                <div className="hudProjectPanel__contentBody">
                  <p className="hudProjectPanel__contentText">
                    Click interface elements or 3D objects to explore projects.
                  </p>
                  <ul className="hudProjectPanel__bulletList">
                    <li>Use the top buttons to switch between Workshop and Bedroom scenes.</li>
                    <li>Workshop focuses on hardware projects. Bedroom focuses on software projects and a little bit about me.</li>
                    <li>Select any item in the left Projects panel to open details on the right.</li>
                    <li>Use the tabs inside a project panel to browse different information.</li>
                    <li>Drag your mouse to look around the room and click interactive objects when highlighted.</li>
                    <li>Press the panel close button to return to free room browsing.</li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* --- BOTTOM LEFT (cursor axis indicators) --- */}
          <div className="hudBottomLeft">
            <div className="hudBottomLeft__title">SYSTEM STATUS</div>
            <div className="hudBottomLeft__circles">
              {[
                { id: "x", label: "X", value: cursorPercent.x },
                { id: "y", label: "Y", value: cursorPercent.y },
              ].map((axis) => (
                <div
                  key={axis.id}
                  className="hudBottomLeft__circleCard"
                  aria-label={`${axis.label} axis ${axis.value}`}
                >
                  <div className="hudBottomLeft__circleWrap">
                    <svg className="hudBottomLeft__circleSvg" viewBox="0 0 88 88" aria-hidden="true">
                      <circle className="hudBottomLeft__circleTrack" cx="44" cy="44" r={CURSOR_RING_RADIUS} />
                      <circle
                        className="hudBottomLeft__circleProgress"
                        cx="44"
                        cy="44"
                        r={CURSOR_RING_RADIUS}
                        strokeDasharray={CURSOR_RING_CIRCUMFERENCE}
                        strokeDashoffset={CURSOR_RING_CIRCUMFERENCE * (1 - axis.value / 100)}
                      />
                    </svg>
                    <span className="hudBottomLeft__circleValue">{axis.value}</span>
                  </div>
                  <span className="hudBottomLeft__circleAxis">{axis.label}</span>
                </div>
              ))}
            </div>
            <div className="hudBottomLeft__blinkGrid" aria-hidden="true">
              {blinkCells.map((cell, index) => (
                <span
                  key={`blink-${index}`}
                  className={`hudBottomLeft__blinkCell${cell.isOn ? " hudBottomLeft__blinkCell--on" : ""}`}
                  style={
                    {
                      "--blink-opacity": cell.opacity,
                      "--blink-color": cell.color,
                      "--blink-fade-ms": `${cell.fadeMs}ms`,
                    } as CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          {/*
          --- BOTTOM RIGHT (code stream) ---
          <div className="hudBottomRight">
            <span className="hudBottomRight__corner hudBottomRight__corner--tl" aria-hidden="true" />
            <span className="hudBottomRight__corner hudBottomRight__corner--tr" aria-hidden="true" />
            <span className="hudBottomRight__corner hudBottomRight__corner--bl" aria-hidden="true" />
            <span className="hudBottomRight__corner hudBottomRight__corner--br" aria-hidden="true" />
            <div className="hudBottomRight__title">DATA UPLOAD</div>
            <div className="hudBottomRight__content">
              <div className="hudBottomRight__codeBox" aria-hidden="true">
                {codeLogLines.map((line, index) => (
                  <div key={`code-line-${index}-${line}`} className="hudBottomRight__codeLine">
                    {line}
                  </div>
                ))}
                <div className="hudBottomRight__codeLine hudBottomRight__codeLine--typing">
                  {codeTypingLine}
                  <span className="hudBottomRight__caret" />
                </div>
              </div>
              <div className="hudBottomRight__pulseColumn" aria-hidden="true">
                {codePulseBoxes.map((box, index) => (
                  <span
                    key={`pulse-box-${index}`}
                    className={`hudBottomRight__pulseBox${box.isOn ? " hudBottomRight__pulseBox--on" : ""}`}
                    style={
                      {
                        "--pulse-opacity": box.opacity,
                        "--pulse-fade-ms": `${box.fadeMs}ms`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          </div>
          */}

          <button
            type="button"
            className="hudHelpButton"
            onClick={openHelpPanel}
            aria-label="Open help panel"
          >
            Help
          </button>

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
      {isTransitionLoading && (
        <div className="hudLoadingScreen" role="status" aria-live="polite" aria-busy="true">
          <div className="hudLoadingScreen__panel">
            <div className="hudLoadingScreen__label">ROOM TRANSITION</div>
            <div className="hudLoadingScreen__title">
              LOADING {activeMode === "WORKSHOP" ? "WORKSHOP" : "BEDROOM"}
            </div>
            <div className="hudLoadingScreen__bar" aria-hidden="true">
              <span className="hudLoadingScreen__barFill" />
            </div>
            <div className="hudLoadingScreen__hint">SYNCING SCENE DATA</div>
          </div>
        </div>
      )}
    </div>
  );
}
