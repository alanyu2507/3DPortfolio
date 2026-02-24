import React from 'react'
import './OuterBoxInnerThirds.css'

interface OuterBoxInnerThirdsProps {
  children: React.ReactNode
  width?: string | number
  flex?: string | number
}

function OuterBoxInnerThirds({ children, width, flex }: OuterBoxInnerThirdsProps) {
  const style: React.CSSProperties = {}
  
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width
  }
  
  if (flex) {
    style.flex = typeof flex === 'number' ? flex.toString() : flex
  }
  
  return (
    <div className="outerBoxInnerThirds" style={style}>
      {children}
    </div>
  )
}

export default OuterBoxInnerThirds
