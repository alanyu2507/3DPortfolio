import React, { useContext } from 'react'
import '../RoomSpecficBottomPanel.css'

function ServerFolder({ children }: { children?: React.ReactNode }) {
  
  return (
    <div className='RoomSpecficBottomPanel'>
        This is the Server Folder
      {children}
    </div>
  )
}

export default ServerFolder
