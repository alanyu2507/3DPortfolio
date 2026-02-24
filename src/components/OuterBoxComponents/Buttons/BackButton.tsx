import React, { useContext, useEffect, useRef } from 'react'
import { FileContext } from '../../../Contexts/FileContext'

function BackButton() {
  const { folderName, setFolderName, getLastParentFolder, removeLastParentFolder } = useContext(FileContext)
  
  
  const handleClick = (event?: any) => {
    setFolderName(getLastParentFolder() || folderName)
    removeLastParentFolder()
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
      &lt;
    </button>
  )
}

export default BackButton
