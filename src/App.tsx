import TestRoomCanvas from './components/TestRoom'
import HudOverlay from './components/HudOverlay'
import { useEffect, useState } from 'react'

type HudMode = 'WORKSHOP' | 'LAB' | 'BEDROOM'

type ProjectFocusTarget = {
  projectId: string
  lookAt: [number, number, number]
  zoomFov: number
}


function App() {
  const [hudMode, setHudMode] = useState<HudMode>('WORKSHOP')
  const [projectFocusTarget, setProjectFocusTarget] = useState<ProjectFocusTarget | null>(null)
  const [isProjectCameraLocked, setIsProjectCameraLocked] = useState(false)
  const [isRoomTransitionLoading, setIsRoomTransitionLoading] = useState(false)
  const [initialLoadProgress, setInitialLoadProgress] = useState(0)
  const [isInitialSceneReady, setIsInitialSceneReady] = useState(false)
  const [isInitialOverlayFading, setIsInitialOverlayFading] = useState(false)
  const [isInitialOverlayVisible, setIsInitialOverlayVisible] = useState(true)

  const isBedroomMode = (mode: HudMode) => mode === 'LAB' || mode === 'BEDROOM'

  const handleProjectFocus = (
    target: { lookAt: [number, number, number]; zoomFov: number },
    projectId: string
  ) => {
    setProjectFocusTarget({ projectId, ...target })
    setIsProjectCameraLocked(true)
  }

  const handleProjectPanelClose = () => {
    setProjectFocusTarget(null)
    setIsProjectCameraLocked(false)
  }

  const handleModeChange = (nextMode: HudMode) => {
    if (nextMode === hudMode) return

    // Only show loading screen when transitioning between Workshop and Bedroom scenes.
    const isSceneSwitch = isBedroomMode(nextMode) !== isBedroomMode(hudMode)
    if (isSceneSwitch) {
      setIsRoomTransitionLoading(true)
    }

    setHudMode(nextMode)
  }

  const handleRoomReady = () => {
    setIsRoomTransitionLoading(false)
    setInitialLoadProgress(100)
    setIsInitialSceneReady(true)
  }

  const handleRoomLoadProgress = (progress: number) => {
    if (isInitialSceneReady) return
    const clampedProgress = Math.min(100, Math.max(0, progress))
    setInitialLoadProgress((prev) => Math.max(prev, clampedProgress))
  }

  useEffect(() => {
    if (!isInitialSceneReady) return

    const fadeStartTimer = window.setTimeout(() => {
      setIsInitialOverlayFading(true)
    }, 300)

    const hideOverlayTimer = window.setTimeout(() => {
      setIsInitialOverlayVisible(false)
    }, 1500)

    return () => {
      window.clearTimeout(fadeStartTimer)
      window.clearTimeout(hideOverlayTimer)
    }
  }, [isInitialSceneReady])

  return (
    <div>
      <TestRoomCanvas
        hudMode={hudMode}
        projectFocusTarget={projectFocusTarget}
        isProjectCameraLocked={isProjectCameraLocked}
        onRoomReady={handleRoomReady}
        onRoomLoadProgress={handleRoomLoadProgress}
      />
      {isInitialSceneReady && (
        <HudOverlay
          activeMode={hudMode}
          onModeChange={handleModeChange}
          onSelectUnit={(id) => console.log("Selected unit", id)}
          onProjectFocus={handleProjectFocus}
          onProjectPanelClose={handleProjectPanelClose}
          isTransitionLoading={isRoomTransitionLoading}
        />
      )}
      {isInitialOverlayVisible && (
        <div
          role="status"
          aria-live="polite"
          aria-busy={!isInitialSceneReady}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            display: 'grid',
            placeItems: 'center',
            background: '#000000',
            color: 'rgba(255, 255, 255, 0.85)',
            fontFamily: '"Rajdhani", "Orbitron", "Inter", system-ui, sans-serif',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontSize: '14px',
            opacity: isInitialOverlayFading ? 0 : 1,
            transition: 'opacity 1200ms ease',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 'min(420px, calc(100vw - 60px))',
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              {isInitialSceneReady ? 'Connected' : 'Connecting...'}
            </div>
            <div
              aria-hidden="true"
              style={{
                width: '100%',
                height: '8px',
                border: '1px solid rgba(255, 255, 255, 0.45)',
                background: 'rgba(255, 255, 255, 0.08)',
              }}
            >
              <div
                style={{
                  width: `${isInitialSceneReady ? 100 : Math.round(initialLoadProgress)}%`,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'width 140ms linear',
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/*<Navbar />
      <OuterBox>
        <OuterBoxInnerThirds width="30%">
          <LeftPanel>
            <div></div>
          </LeftPanel>
        </OuterBoxInnerThirds>
        <OuterBoxInnerThirds flex={1}>
          <div></div>
        </OuterBoxInnerThirds>
        <OuterBoxInnerThirds width="30%">
          <RightPanel>
            <div></div>
          </RightPanel>
        </OuterBoxInnerThirds>
      </OuterBox>
      <Crosshair>
        <div></div>
      </Crosshair>
      <XYCoordinates>
        <div></div>
      </XYCoordinates>*/}
    </div>
  )
}

export default App
