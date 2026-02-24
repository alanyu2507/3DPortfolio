import React, { useContext, useEffect, useRef } from 'react'
import { FileContext } from '../../../Contexts/FileContext'

interface CloseButtonProps {
  window: 'left' | 'right';
}

function CloseButton({ window }: CloseButtonProps) {
  const { setFolderName, setFileName, zoomOut } = useContext(FileContext)
  
  
  const handleClick = (event?: any) => {
    if (window === 'left') {
      setFolderName("")
      setFileName("")
      zoomOut()
    } else if (window === 'right') {
      setFileName("")
    } // Zoom out to original position when closing
  }
  
  
  return (
    <button 
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        position: 'relative',
        pointerEvents: 'auto'
      }}
    >
      ×
    </button>
  )
}

export default CloseButton
