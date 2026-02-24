import React from 'react'
import './OuterBox.css'

function OuterBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="outer-box">
      {children}
    </div>
  )
}

export default OuterBox
