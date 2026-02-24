import { useEffect, Suspense, useState, useRef, useContext } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Html } from '@react-three/drei'
import { EffectComposer, Bloom, wrapEffect } from '@react-three/postprocessing'
import { Effect } from 'postprocessing'
import * as THREE from 'three'
import { CameraContext } from '../Contexts/CameraContext'
import { FileContext } from '../Contexts/FileContext'

function Model({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath);
  return <primitive object={scene} />;
}

function CameraController() {
  const { camera, scene } = useThree()
  const { setHoveredObject, setIsZoomedIn } = useContext(CameraContext)
  const { setXCoordinate, setYCoordinate } = useContext(CameraContext)
  const { folderName, setZoomIn, setZoomOut } = useContext(FileContext)
  const [, setZoomLevel] = useState(5) // Initial zoom level
  const minZoom = 1 // Minimum zoom (closer)
  const maxZoom = 20 // Maximum zoom (further)
  const zoomSpeed = 0.2 // How fast zoom changes
  
  // Cursor-based offsets for X and Y
  const cursorOffsets = useRef({ x: 0, y: 0 })
  // Smooth interpolated values for camera movement
  const smoothOffsets = useRef({ x: 0, y: 0 })
  // Final look-at point after normalization
  const finalLookAtPoint = useRef(new THREE.Vector3())
  // Raycaster for object detection
  const raycaster = useRef(new THREE.Raycaster())
  // Store original camera position
  const originalPosition = useRef(new THREE.Vector3(0, 2.5, -3.6))
  // Smooth zoom state
  const zoomState = useRef({ isZooming: false, targetPosition: new THREE.Vector3(), startPosition: new THREE.Vector3(), progress: 0 })
  // Track if camera has zoomed in (can only zoom in once until zoomed out)
  const hasZoomedIn = useRef(false)

  // Smooth zoom function that moves camera 2.5 meters forward in look direction
  const handleZoomIn = () => {
    if (zoomState.current.isZooming || hasZoomedIn.current) return; // Prevent multiple zoom operations and only allow one zoom in
    
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    const targetPosition = camera.position.clone().add(cameraDirection.multiplyScalar(3))
    
    zoomState.current = {
      isZooming: true,
      targetPosition,
      startPosition: camera.position.clone(),
      progress: 0
    }
    
    hasZoomedIn.current = true // Mark that we've zoomed in
    setIsZoomedIn(true) // Update context state
  }

  // Smooth zoom out function that returns camera to original position
  const handleZoomOut = () => {
    if (zoomState.current.isZooming) return; // Prevent multiple zoom operations
    
    zoomState.current = {
      isZooming: true,
      targetPosition: originalPosition.current.clone(),
      startPosition: camera.position.clone(),
      progress: 0
    }
    
    hasZoomedIn.current = false // Reset zoom state when zooming out
    setIsZoomedIn(false) // Update context state
  }

  // Register zoom functions with context
  useEffect(() => {
    setZoomIn(handleZoomIn)
    setZoomOut(handleZoomOut)
  }, [setZoomIn, setZoomOut])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1

      // Only update coordinates if folderName is not empty
      if (folderName == "") {
        setXCoordinate(x)
        setYCoordinate(y)
        // Calculate cursor-based offsets
        const offsetX = x * 0.5 // -0.5 to +0.5 meters range
        const offsetY = Math.max(-0.5, Math.min(0.1, y * 0.5)) // -0.5 to +0.2 meters range
        
        // Update cursor offsets
        cursorOffsets.current.x = offsetX
        cursorOffsets.current.y = -offsetY
      }
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault()
      const delta = event.deltaY > 0 ? zoomSpeed : -zoomSpeed
      setZoomLevel(prev => {
        const newZoom = prev + delta
        return Math.max(minZoom, Math.min(maxZoom, newZoom))
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [zoomSpeed, minZoom, maxZoom, folderName])

  useFrame(() => {
    // Handle smooth zoom animation
    if (zoomState.current.isZooming) {
      zoomState.current.progress += 0.02 // Slower zoom animation
      if (zoomState.current.progress >= 1) {
        zoomState.current.progress = 1
        zoomState.current.isZooming = false
      }
      
      // Smooth interpolation between start and target position
      camera.position.lerpVectors(
        zoomState.current.startPosition,
        zoomState.current.targetPosition,
        zoomState.current.progress
      )
    }

    // Smooth interpolation towards target cursor offsets
    const lerpFactor = 0.05 // Adjust for smoother/faster movement
    smoothOffsets.current.x += (cursorOffsets.current.x - smoothOffsets.current.x) * lerpFactor
    smoothOffsets.current.y += (cursorOffsets.current.y - smoothOffsets.current.y) * lerpFactor
    
    // Calculate azimuth (horizontal) and elevation (vertical) angles from smooth offsets
    const azimuth = -smoothOffsets.current.x * Math.PI // Negate for correct direction
    const elevation = smoothOffsets.current.y * Math.PI * 0.5 // -π/2 to +π/2 for vertical rotation
    
    // Calculate look-at point using spherical coordinates
    // Start with forward direction (0, 0, -1) in camera space
    const lookDirection = new THREE.Vector3(0, 0, 1)
    
    // Apply elevation rotation (around X axis)
    lookDirection.applyAxisAngle(new THREE.Vector3(1, 0, 0), elevation)
    
    // Apply azimuth rotation (around Y axis)
    lookDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), azimuth)
    
    // Scale to 1 meter distance
    lookDirection.multiplyScalar(1)
    
    // Transform to world space and add to camera position
    finalLookAtPoint.current.copy(camera.position).add(lookDirection)
    
    // Make camera look at the calculated point
    camera.lookAt(finalLookAtPoint.current)
    
    // Perform raycasting from camera in look direction
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    
    raycaster.current.set(camera.position, cameraDirection)
    const intersects = raycaster.current.intersectObjects(scene.children, true)
    
    // Check if raycast hit anything
    if (intersects.length > 0) {
      const hitObject = intersects[0].object
      const objectName = hitObject.name || hitObject.parent?.name || 'Unnamed Object'
      
      setHoveredObject(objectName)
    } else {
      // No object hit, reset hovered object
      setHoveredObject("None")
    }
    
    // Apply zoom by adjusting camera position
    /*const basePosition = [0, 2, zoomLevel] as [number, number, number]
    camera.position.x += (basePosition[0] - camera.position.x) * 0.05
    camera.position.y += (basePosition[1] - camera.position.y) * 0.05
    camera.position.z += (basePosition[2] - camera.position.z) * 0.05*/
  })

  return null
}

function TestRoomCanvas() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh", 
        position: "fixed",
        margin: "0", 
        top: "0", 
        left: "0"
      }}
    >
      <Canvas
        camera={{ position: [0, 2.5, -3.6] }}
        gl={{ antialias: true }}
        style={{
          width: '100%',
          height: '100%',
        }}
        shadows
      >
        {/* Log camera transforms */}
        
        <ambientLight intensity={1.5} />
        <directionalLight
          color="rgba(255, 255, 255, 1)"
          position={[0, 1000, 0]}
          intensity={0.5}
          castShadow
        />

        <Suspense fallback={<Html center>Loading model...</Html>}>
          <Model modelPath="/PersonalPortfolioV2/models/Bedroom.glb" />
          
        </Suspense>
        
        <CameraController />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.5}
            intensity={1.2}
            radius={0.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default TestRoomCanvas
