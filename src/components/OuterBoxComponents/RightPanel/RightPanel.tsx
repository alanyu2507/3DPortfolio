import React, { useContext } from 'react'
import './RightPanel.css'
import { FileContext } from '../../../Contexts/FileContext'
import CloseButton from '../Buttons/CloseButton'


function RightPanel({ children }: { children: React.ReactNode }) {
  const { fileName } = useContext(FileContext)
  
  const isVisible = fileName !== ""
  
  return (
    <div className={`RightPanel ${isVisible ? 'visible' : 'invisible'}`}>
      <div className="RightPanelTop">
        <div className="RightPanelTopLeft"></div>
        <div className="RightPanelTopCenter">{fileName}</div>
        <div className="RightPanelTopRight">
          <CloseButton window="right" />
        </div>
      </div>
      <div className="RightPanelBottom">
        {(() => {
          switch (fileName) {
            default:
              return <div>sdsdsd</div>
          }
        })()}
      </div>
    </div>
  )
}

export default RightPanel
