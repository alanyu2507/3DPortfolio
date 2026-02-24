import React, { useContext } from 'react'
import '../RoomSpecficBottomPanel.css'

function ConsoleFolder({ children }: { children?: React.ReactNode }) {
  
  return (
    <div className='RoomSpecficBottomPanel'>
        This is the Console Folder
      {children}
    </div>
  )
}

export default ConsoleFolder
