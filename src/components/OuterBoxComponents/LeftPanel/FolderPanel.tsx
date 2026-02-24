import React from 'react'
import './CSS/FolderPanel.css'

function FolderPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="FolderPanel">
      {children}
    </div>
  )
}

export default FolderPanel
