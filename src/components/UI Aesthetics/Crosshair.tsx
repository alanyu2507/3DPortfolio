import React, { useContext, useEffect, useRef } from 'react'
import './CSS/Crosshair.css'
import { CameraContext } from '../../Contexts/CameraContext'
import { FileContext } from '../../Contexts/FileContext'

function Crosshair({ children }: { children: React.ReactNode }) {
  const { hoveredObject, isZoomedIn } = useContext(CameraContext)
  const { setFolderName, folderName, zoomIn } = useContext(FileContext)
  
  const isHovered = hoveredObject.includes('hover')
  
  const objectMap: { [key: string]: string } = {
    'KB3D_LAB_Computer_A_Mainhover': 'Personal Computer',
    'KB3D_LAB_Server_C_Mainhover': 'Bedroom Server',
    'KB3D_LAB_Console_B_Mainhover': 'Bedroom Console'
  }
  
  const handleClick = () => {
    if (isHovered && folderName === '') {
      const mappedValue = objectMap[hoveredObject]
      if (mappedValue) {
        console.log("clicked")
        setFolderName(mappedValue)
        zoomIn() // Zoom in when setting folder name
      }
    }
  }
  
  const folderNameRef = useRef(folderName);
  useEffect(() => { folderNameRef.current = folderName; }, [folderName]);
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) return;
      if (isHovered && folderNameRef.current === '') {
        const mappedValue = objectMap[hoveredObject];
        if (mappedValue) {
          setFolderName(mappedValue);
          zoomIn();
        }
      }
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [isHovered, hoveredObject, setFolderName, zoomIn]);
  
  return (
    <div 
      className={isHovered ? 'Hovered' : 'Crosshair'}
    >
      {children}
    </div>
  )
}

export default Crosshair
