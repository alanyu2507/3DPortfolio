import React from 'react'
import './CSS/FilePanel.css'

function FilePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="FilePanel">
      {children}
    </div>
  )
}

export default FilePanel
