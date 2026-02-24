import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CameraProvider } from './Contexts/CameraContext'
import { FileProvider } from './Contexts/FileContext'
import {RoomProvider} from './Contexts/RoomContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RoomProvider>
      <CameraProvider>
        <FileProvider>
          <App />
        </FileProvider>
      </CameraProvider>
    </RoomProvider>
  </React.StrictMode>,
)
