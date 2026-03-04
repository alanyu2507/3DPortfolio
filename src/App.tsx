import TestRoomCanvas from './components/TestRoom'
import { lazy, Suspense, useEffect, useState } from 'react'

type HudMode = 'WORKSHOP' | 'LAB' | 'BEDROOM'

type ProjectFocusTarget = {
  projectId: string
  lookAt: [number, number, number]
  zoomFov: number
}

const HudOverlay = lazy(() => import('./components/HudOverlay'))

const INITIAL_LOADING_STREAM_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const INITIAL_LOADING_STREAM_LINE_LENGTH = 140

const createInitialLoadingStreamLine = () =>
  Array.from(
    { length: INITIAL_LOADING_STREAM_LINE_LENGTH },
    () =>
      INITIAL_LOADING_STREAM_CHARSET[
        Math.floor(Math.random() * INITIAL_LOADING_STREAM_CHARSET.length)
      ]
  ).join('')

function App() {
  const [hudMode, setHudMode] = useState<HudMode>('WORKSHOP')
  const [projectFocusTarget, setProjectFocusTarget] = useState<ProjectFocusTarget | null>(null)
  const [isProjectCameraLocked, setIsProjectCameraLocked] = useState(false)
  const [isRoomTransitionLoading, setIsRoomTransitionLoading] = useState(false)
  const [initialLoadProgress, setInitialLoadProgress] = useState(0)
  const [isInitialSceneReady, setIsInitialSceneReady] = useState(false)
  const [isInitialOverlayFading, setIsInitialOverlayFading] = useState(false)
  const [isInitialOverlayVisible, setIsInitialOverlayVisible] = useState(true)
  const [initialLoadingStreamLines, setInitialLoadingStreamLines] = useState(() => [
    createInitialLoadingStreamLine(),
    createInitialLoadingStreamLine(),
  ])

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
    setInitialLoadProgress(clampedProgress)
  }

  useEffect(() => {
    if (!isInitialOverlayVisible || isInitialSceneReady) return

    const intervalId = window.setInterval(() => {
      setInitialLoadingStreamLines([
        createInitialLoadingStreamLine(),
        createInitialLoadingStreamLine(),
      ])
    }, 140)

    return () => window.clearInterval(intervalId)
  }, [isInitialOverlayVisible, isInitialSceneReady])

  useEffect(() => {
    if (
      !isInitialSceneReady ||
      !isInitialOverlayVisible
    ) {
      return
    }

    const fadeStartTimer = window.setTimeout(() => {
      setIsInitialOverlayFading(true)
    }, 120)

    const hideOverlayTimer = window.setTimeout(() => {
      setIsInitialOverlayVisible(false)
    }, 700)

    return () => {
      window.clearTimeout(fadeStartTimer)
      window.clearTimeout(hideOverlayTimer)
    }
  }, [isInitialSceneReady, isInitialOverlayVisible])

  return (
    <div>
      <TestRoomCanvas
        hudMode={hudMode}
        projectFocusTarget={projectFocusTarget}
        isProjectCameraLocked={isProjectCameraLocked}
        onRoomReady={handleRoomReady}
        onRoomLoadProgress={handleRoomLoadProgress}
        shouldPreloadWorkshop={
          isBedroomMode(hudMode) &&
          !isRoomTransitionLoading &&
          !isInitialOverlayVisible
        }
        shouldPreloadBedroom={
          !isBedroomMode(hudMode) &&
          !isRoomTransitionLoading &&
          !isInitialOverlayVisible
        }
      />
      {isInitialSceneReady && (
        <Suspense fallback={null}>
          <HudOverlay
            activeMode={hudMode}
            onModeChange={handleModeChange}
            onSelectUnit={(id) => console.log("Selected unit", id)}
            onProjectFocus={handleProjectFocus}
            onProjectPanelClose={handleProjectPanelClose}
            isTransitionLoading={isRoomTransitionLoading}
          />
        </Suspense>
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
              {isInitialSceneReady ? (
                'Connected'
              ) : (
                <>
                  Connecting
                  <span
                    aria-hidden="true"
                    style={{
                      display: 'inline-flex',
                      width: '18px',
                      justifyContent: 'space-between',
                      marginLeft: '2px',
                    }}
                  >
                    <span style={{ animation: 'initialLoadDotBlink 1s infinite' }}>.</span>
                    <span style={{ animation: 'initialLoadDotBlink 1s infinite 0.2s' }}>.</span>
                    <span style={{ animation: 'initialLoadDotBlink 1s infinite 0.4s' }}>.</span>
                  </span>
                </>
              )}
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
                  width: `${initialLoadProgress}%`,
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  transition: 'width 140ms linear',
                }}
              />
            </div>
            <div
              aria-hidden="true"
              style={{
                width: '100%',
                display: 'grid',
                gap: '2px',
                marginTop: '-4px',
              }}
            >
              {initialLoadingStreamLines.map((line, index) => (
                <div
                  key={`${index}-${line}`}
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '8px',
                    lineHeight: 1.2,
                    letterSpacing: '0',
                    textTransform: 'none',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      animation: isInitialSceneReady
                        ? 'none'
                        : 'initialLoadDataStream 2.2s linear infinite',
                    }}
                  >
                    {line}
                    {line}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <style>
            {`
              @keyframes initialLoadDataStream {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
              }

              @keyframes initialLoadDotBlink {
                0%, 20%, 100% { opacity: 0.2; }
                40%, 60% { opacity: 1; }
              }
            `}
          </style>
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
