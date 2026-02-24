import React, { useContext } from 'react'
import '../RoomSpecficBottomPanel.css'

function InitialMessage({ children }: { children?: React.ReactNode }) {
  
  return (
    <div className='RoomSpecificBottomPanel'>
      <p>
        Objective: Learn more about occupant of Odysseus 1.
        <br></br><br></br>
        Instructions: Use surveillance camera to look around the room. Hack electronic objects to access their information. Crosshair will turn red when hovered over hackable objects. Click anywhere on the screen while crosshair is red to hack object. Each room contains a server. Accessing a server will provide a list of all possible hackable objects in the room. The server in this room is located on the far left corner.

      </p>
    </div>
  )
}

export default InitialMessage
