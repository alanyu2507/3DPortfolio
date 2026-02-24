import React, { useContext } from 'react'
import './CSS/LeftPanel.css'
import { FileContext } from '../../../Contexts/FileContext'
import ComputerFolder from '../../RoomSpecific/Bedroom/ComputerFolder'
import ServerFolder from '../../RoomSpecific/Bedroom/ServerFolder'
import ConsoleFolder from '../../RoomSpecific/Bedroom/ConsoleFolder'
import InitialMessage from '../../RoomSpecific/Bedroom/InitialMessage'
import CloseButton from '../Buttons/CloseButton'
import User from '../../RoomSpecific/Bedroom/ComputerFolder/User'
import BackButton from '../Buttons/BackButton'

function LeftPanel({ children }: { children: React.ReactNode }) {
  const { folderName, fileName } = useContext(FileContext)
  
  const isVisible = folderName !== ""
  
  return (
    <div className={`LeftPanel ${isVisible ? 'visible' : 'invisible'}`}>
      <div className="LeftPanelTop">
        <div className="LeftPanelTopLeft">
          <BackButton />
        </div>
        <div className="LeftPanelTopCenter">{folderName}</div>
        <div className="LeftPanelTopRight">
          <CloseButton window="left" />
        </div>
      </div>
      <div className="LeftPanelBottom">
        {(() => {
          switch (folderName) {
            case "InitialMessage":
              return <InitialMessage />
            case "Personal Computer":
              return <ComputerFolder />
            case "Bedroom Server":
                return <ServerFolder />
            case "Bedroom Console":
                return <ConsoleFolder />
            case "User":
                return <User />
            default:
              return null
          }
        })()}
      </div>
    </div>
  )
}

export default LeftPanel
