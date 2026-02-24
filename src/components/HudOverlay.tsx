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

export interface HudUnit {
  id: string;
  name: string;
  status?: string;
}

export interface HudOverlayProps {
  onSelectUnit?: (id: string) => void;
}

const DEFAULT_UNITS: HudUnit[] = [
  { id: "01", name: "SGT. BARLOW", status: "ACTIVE" },
  { id: "02", name: "LIZ HEDMAN", status: "STANDBY" },
  { id: "03", name: "CPL. VANCE", status: "ACTIVE" },
  { id: "04", name: "PVT. REYES", status: "STANDBY" },
  { id: "05", name: "SGT. MOSS", status: "ACTIVE" },
  { id: "06", name: "PVT. KIM", status: "STANDBY" },
  { id: "07", name: "CPL. DEWITT", status: "ACTIVE" },
  { id: "08", name: "PVT. NASH", status: "STANDBY" },
  { id: "09", name: "SGT. HOLLOWAY", status: "ACTIVE" },
  { id: "10", name: "PVT. COLE", status: "STANDBY" },
];

export default function HudOverlay({ onSelectUnit }: HudOverlayProps) {
  const { hoveredObject } = useContext(CameraContext);
  const [activeMode, setActiveMode] = useState<HudMode>("SAT");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>("01");

  const isHovered = hoveredObject.includes("hover");

  const handleUnitSelect = (id: string) => {
    setSelectedUnitId(id);
    onSelectUnit?.(id);
  };

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
              <div className="hudLeftPanel__title">COMMAND UNIT: SILVERBACK</div>
              <div className="hudLeftPanel__subtitle">PLATOON SQUAD TRACKER</div>
            </div>
            <div className="hudLeftPanel__roster" role="listbox" aria-label="Unit roster">
              {DEFAULT_UNITS.map((unit) => (
                <button
                  key={unit.id}
                  type="button"
                  role="option"
                  aria-selected={selectedUnitId === unit.id}
                  className="hudLeftPanel__row"
                  onClick={() => handleUnitSelect(unit.id)}
                >
                  <span className="hudLeftPanel__rowId">{unit.id}</span>
                  <span className="hudLeftPanel__rowName">{unit.name}</span>
                  <span className="hudLeftPanel__rowStatus">{unit.status}</span>
                  {selectedUnitId === unit.id && (
                    <span className="hudLeftPanel__rowTag">ACTIVE</span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* --- RIGHT MODULES (non-interactive) --- */}
          <div className="hudRightModules">
            <div className="hudRightModules__missionBox">
              <div className="hudRightModules__missionTitle">MISSION UPDATE</div>
              <div className="hudRightModules__missionLine">AA 371.478 · AB 754.912</div>
              <div className="hudRightModules__missionLine">SAT IN · LOCATION LOCK</div>
              <div className="hudRightModules__missionLine">EAGLE EYE CAM · ONLINE</div>
              <div className="hudRightModules__missionLine">DARYL SERVER: STATUS OK</div>
            </div>
            <div className="hudRightModules__warning">WARNING</div>
            <div className="hudRightModules__tags">
              <span className="hudRightModules__tag">01</span>
              <span className="hudRightModules__tag">08</span>
              <span className="hudRightModules__tag">33</span>
            </div>
          </div>

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
