import TestRoomCanvas from './components/TestRoom'
import HudOverlay from './components/HudOverlay'
import { useState } from 'react'

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

  return (
    <div>
      <TestRoomCanvas
        hudMode={hudMode}
        projectFocusTarget={projectFocusTarget}
        isProjectCameraLocked={isProjectCameraLocked}
        onRoomReady={() => setIsRoomTransitionLoading(false)}
      />
      <HudOverlay
        activeMode={hudMode}
        onModeChange={handleModeChange}
        onSelectUnit={(id) => console.log("Selected unit", id)}
        onProjectFocus={handleProjectFocus}
        onProjectPanelClose={handleProjectPanelClose}
        isTransitionLoading={isRoomTransitionLoading}
      />
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
