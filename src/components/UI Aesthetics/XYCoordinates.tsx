import React, { useContext } from 'react'
import './CSS/Crosshair.css'
import { CameraContext } from '../../Contexts/CameraContext'
import './CSS/XYCoordinates.css'

function XYCoordinates({ children }: { children: React.ReactNode }) {
  const { hoveredObject } = useContext(CameraContext)
  
  const isHovered = hoveredObject == 'OP_Mitte_Mitte_OP_Tex1_0'
  const { xCoordinate, yCoordinate } = useContext(CameraContext)
  
  return (
    <div className="XYCoordinate">
      <p>X: {xCoordinate}</p>
      <p>Y: {yCoordinate}</p>
    </div>
  )
}

export default XYCoordinates
