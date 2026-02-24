import React, { useContext } from 'react'
import '../RoomSpecficBottomPanel.css'
import FolderPanel from '../../OuterBoxComponents/LeftPanel/FolderPanel'
import Folder from '../../OuterBoxComponents/LeftPanel/Folder'

function ComputerFolder({ children }: { children?: React.ReactNode }) {
  
  return (
    <div className='RoomSpecificBottomPanel'>
      <FolderPanel>
        <Folder name="User" />
        <Folder name="Misc" />
        <Folder name="Operations" />
      </FolderPanel>
    </div>
  )
}

export default ComputerFolder
