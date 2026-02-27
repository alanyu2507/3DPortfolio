import TestRoomCanvas from './components/TestRoom'
import HudOverlay from './components/HudOverlay'


function App() {
  return (
    <div>
      <TestRoomCanvas />
      <HudOverlay onSelectUnit={(id) => console.log("Selected unit", id)} />
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
