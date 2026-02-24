import React, { useContext } from 'react'
import '../../RoomSpecficBottomPanel.css'
import FilePanel from '../../../OuterBoxComponents/LeftPanel/FilePanel'
import File from '../../../OuterBoxComponents/LeftPanel/File'


function AboutMe({ children }: { children?: React.ReactNode }) {
  
  return (
    <div className='RoomSpecificBottomPanel'>
        <FilePanel>
          <File name="AboutMe" />
        </FilePanel>
    </div>
  )
}

export default AboutMe
