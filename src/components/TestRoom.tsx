import { useEffect, Suspense, useState, useRef, useContext, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useTexture, Html, useAnimations, useProgress } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { DRACOLoader, SkeletonUtils } from 'three-stdlib'
import { CameraContext } from '../Contexts/CameraContext'
import { FileContext } from '../Contexts/FileContext'

type ModelVariant = 'WORKSHOP' | 'BEDROOM'

function Model({ modelPath, variant }: { modelPath: string; variant: ModelVariant }) {
  const dracoLoader = useMemo(() => {
    const loader = new DRACOLoader()
    loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    return loader
  }, [])
  const { scene } = useGLTF(modelPath, true, true, (loader) => {
    loader.setDRACOLoader(dracoLoader)
  })
  const bikeTexture = useTexture(`${import.meta.env.BASE_URL}Textures/Bike.webp`)
  const miscTexture = useTexture(`${import.meta.env.BASE_URL}Textures/Misc.webp`)
  const projectsTexture = useTexture(`${import.meta.env.BASE_URL}Textures/Projects.webp`)
  const roomTexture = useTexture(`${import.meta.env.BASE_URL}Textures/Room.webp`)
  const bedroomImportantTexture = useTexture(`${import.meta.env.BASE_URL}Textures/BedroomImportant.webp`)
  const bedroomMainTexture = useTexture(`${import.meta.env.BASE_URL}Textures/BedroomMain.webp`)
  const bedroomMiscTexture = useTexture(`${import.meta.env.BASE_URL}Textures/BedroomMisc.webp`)

  const texturesByTag = useMemo(() => {
    const prepareTexture = (texture: THREE.Texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.flipY = false
      texture.needsUpdate = true
    }

    prepareTexture(bikeTexture)
    prepareTexture(miscTexture)
    prepareTexture(projectsTexture)
    prepareTexture(roomTexture)
    prepareTexture(bedroomImportantTexture)
    prepareTexture(bedroomMainTexture)
    prepareTexture(bedroomMiscTexture)

    if (variant === 'BEDROOM') {
      return {
        _BedroomImportant: bedroomImportantTexture,
        _BedroomMain: bedroomMainTexture,
        _BedroomMisc: bedroomMiscTexture,
      }
    }

    return {
      _Bike: bikeTexture,
      _Misc: miscTexture,
      _Projects: projectsTexture,
      _Room: roomTexture,
    }
  }, [
    variant,
    bikeTexture,
    miscTexture,
    projectsTexture,
    roomTexture,
    bedroomImportantTexture,
    bedroomMainTexture,
    bedroomMiscTexture,
  ])

  useMemo(() => {
    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const matchingTagEntry = Object.entries(texturesByTag).find(([tag]) => child.name.includes(tag))
      if (!matchingTagEntry) return

      const [, texture] = matchingTagEntry
      child.material = new THREE.MeshStandardMaterial({ map: texture })
      child.castShadow = true
      child.receiveShadow = true
    })
  }, [scene, texturesByTag])

  return <primitive object={scene} />;
}

function AnimatedModel({
  modelPath,
  playNonce,
}: {
  modelPath: string
  playNonce: number
}) {
  const dracoLoader = useMemo(() => {
    const loader = new DRACOLoader()
    loader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
    return loader
  }, [])
  const { scene, animations } = useGLTF(modelPath, true, true, (loader) => {
    loader.setDRACOLoader(dracoLoader)
  })
  // Clone cached GLTF scenes so workshop-only animated models remount cleanly
  // after switching room variants.
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, clonedScene)

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (!action) return
      action.stop()
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
    })
  }, [actions])

  useEffect(() => {
    if (playNonce === 0) return

    Object.values(actions).forEach((action) => {
      if (!action) return
      action.reset()
      action.setLoop(THREE.LoopOnce, 1)
      action.clampWhenFinished = true
      action.play()
    })
  }, [playNonce, actions])

  return <primitive object={clonedScene} dispose={null} />
}

interface ProjectFocusTarget {
  projectId: string
  lookAt: [number, number, number]
  zoomFov: number
}

interface CameraControllerProps {
  projectFocusTarget: ProjectFocusTarget | null
  isProjectCameraLocked: boolean
  initialCameraPosition: [number, number, number]
}

function CameraController({ projectFocusTarget, isProjectCameraLocked, initialCameraPosition }: CameraControllerProps) {
  const { camera, scene } = useThree()
  const perspectiveCamera = camera as THREE.PerspectiveCamera
  const { setHoveredObject, setIsZoomedIn } = useContext(CameraContext)
  const { setXCoordinate, setYCoordinate } = useContext(CameraContext)
  const { folderName, setZoomIn, setZoomOut } = useContext(FileContext)
  const [, setZoomLevel] = useState<number>(5) // Initial zoom level
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
  const originalPosition = useRef(new THREE.Vector3(...initialCameraPosition))
  // Smooth zoom state
  const zoomState = useRef({ isZooming: false, targetPosition: new THREE.Vector3(), startPosition: new THREE.Vector3(), progress: 0 })
  // Track if camera has zoomed in (can only zoom in once until zoomed out)
  const hasZoomedIn = useRef(false)
  const baseFov = useRef(perspectiveCamera.fov)
  const neutralLookTarget = useRef(new THREE.Vector3(-4.4, 0.5, 4))
  const hasProjectZoomFocus = useRef(false)
  const lockedLookAtTarget = useRef(new THREE.Vector3())
  const focusAnimationState = useRef({
    isActive: false,
    progress: 0,
    startQuaternion: new THREE.Quaternion(),
    targetQuaternion: new THREE.Quaternion(),
    startFov: perspectiveCamera.fov,
    targetFov: perspectiveCamera.fov,
  })

  useEffect(() => {
    originalPosition.current.set(...initialCameraPosition)
    camera.position.set(...initialCameraPosition)
    zoomState.current.isZooming = false
    hasZoomedIn.current = false
    setIsZoomedIn(false)
  }, [initialCameraPosition])

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
      if (isProjectCameraLocked) return

      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1

      // Only update coordinates while no folder is selected
      if (folderName === "") {
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
      setZoomLevel((prev) => {
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
  }, [zoomSpeed, minZoom, maxZoom, folderName, setXCoordinate, setYCoordinate, isProjectCameraLocked])

  useEffect(() => {
    if (!projectFocusTarget) return

    const targetLookAt = new THREE.Vector3(...projectFocusTarget.lookAt)
    const lookAtMatrix = new THREE.Matrix4().lookAt(camera.position.clone(), targetLookAt, camera.up)
    const targetQuaternion = new THREE.Quaternion().setFromRotationMatrix(lookAtMatrix)

    lockedLookAtTarget.current.copy(targetLookAt)
    focusAnimationState.current = {
      isActive: true,
      progress: 0,
      startQuaternion: camera.quaternion.clone(),
      targetQuaternion,
      startFov: perspectiveCamera.fov,
      targetFov: projectFocusTarget.zoomFov,
    }
    hasProjectZoomFocus.current = true
  }, [projectFocusTarget, camera])

  useEffect(() => {
    if (isProjectCameraLocked || !hasProjectZoomFocus.current) return

    focusAnimationState.current = {
      isActive: true,
      progress: 0,
      startQuaternion: camera.quaternion.clone(),
      targetQuaternion: camera.quaternion.clone(),
      startFov: perspectiveCamera.fov,
      targetFov: baseFov.current,
    }
    hasProjectZoomFocus.current = false
  }, [isProjectCameraLocked, camera])

  useFrame(() => {
    if (focusAnimationState.current.isActive) {
      focusAnimationState.current.progress += 0.03
      if (focusAnimationState.current.progress >= 1) {
        focusAnimationState.current.progress = 1
        focusAnimationState.current.isActive = false
      }

      camera.quaternion.slerpQuaternions(
        focusAnimationState.current.startQuaternion,
        focusAnimationState.current.targetQuaternion,
        focusAnimationState.current.progress
      )
      perspectiveCamera.fov = THREE.MathUtils.lerp(
        focusAnimationState.current.startFov,
        focusAnimationState.current.targetFov,
        focusAnimationState.current.progress
      )
      perspectiveCamera.updateProjectionMatrix()
    }

    if (isProjectCameraLocked && !focusAnimationState.current.isActive) {
      camera.lookAt(lockedLookAtTarget.current)
    }

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

    if (!isProjectCameraLocked && !focusAnimationState.current.isActive) {
      // Smooth interpolation towards target cursor offsets
      const lerpFactor = 0.05 // Adjust for smoother/faster movement
      smoothOffsets.current.x += (cursorOffsets.current.x - smoothOffsets.current.x) * lerpFactor
      smoothOffsets.current.y += (cursorOffsets.current.y - smoothOffsets.current.y) * lerpFactor
      
      // Calculate azimuth (horizontal) and elevation (vertical) angles from smooth offsets
      const azimuth = -smoothOffsets.current.x * Math.PI // Negate for correct direction
      const elevation = smoothOffsets.current.y * Math.PI * 0.5 // -π/2 to +π/2 for vertical rotation
      
      // Calculate look-at point using spherical coordinates
      // Start from the neutral world-space look direction.
      const lookDirection = neutralLookTarget.current
        .clone()
        .sub(camera.position)
        .normalize()
      
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
    }
    
    // Perform raycasting from camera in look direction
    const cameraDirection = new THREE.Vector3()
    camera.getWorldDirection(cameraDirection)
    
    raycaster.current.set(camera.position, cameraDirection)
    const intersects = raycaster.current.intersectObjects(scene.children, true)
    
    // Check if raycast hit anything
    if (intersects.length > 0) {
      const hitObject = intersects[0].object
      const objectName = hitObject.name || hitObject.parent?.name || 'Unnamed Object'
      console.log('Line trace hit point:', intersects[0].point)
      
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

interface TestRoomCanvasProps {
  hudMode: 'WORKSHOP' | 'LAB' | 'BEDROOM'
  projectFocusTarget: ProjectFocusTarget | null
  isProjectCameraLocked: boolean
  onRoomReady?: () => void
}

function TestRoomCanvas({ hudMode, projectFocusTarget, isProjectCameraLocked, onRoomReady }: TestRoomCanvasProps) {
  const isBedroomView = hudMode === 'LAB' || hudMode === 'BEDROOM'
  const modelPath = `${import.meta.env.BASE_URL}models/${isBedroomView ? 'Bedroom-v1.glb' : 'Workshop-v1.glb'}`
  const modelVariant: ModelVariant = isBedroomView ? 'BEDROOM' : 'WORKSHOP'
  const cameraPosition: [number, number, number] = isBedroomView ? [1.5, 3, -2] : [1.5, 4.5, -1]
  const hexapodPath = `${import.meta.env.BASE_URL}models/hexapod.glb`
  const quadrupedPath = `${import.meta.env.BASE_URL}models/leg.glb`
  const [hexapodPlayNonce, setHexapodPlayNonce] = useState(0)
  const [quadrupedPlayNonce, setQuadrupedPlayNonce] = useState(0)
  const [isAwaitingSceneReady, setIsAwaitingSceneReady] = useState(true)
  const { active, progress } = useProgress()

  useEffect(() => {
    if (!projectFocusTarget) return

    if (projectFocusTarget.projectId === 'hexapod') {
      setHexapodPlayNonce((prev) => prev + 1)
    }

    if (projectFocusTarget.projectId === 'quadruped') {
      setQuadrupedPlayNonce((prev) => prev + 1)
    }
  }, [projectFocusTarget])

  useEffect(() => {
    setIsAwaitingSceneReady(true)
  }, [modelPath])

  useEffect(() => {
    if (!isAwaitingSceneReady) return
    if (active || progress < 100) return

    const readyTimer = window.setTimeout(() => {
      setIsAwaitingSceneReady(false)
      onRoomReady?.()
    }, 250)

    return () => window.clearTimeout(readyTimer)
  }, [active, progress, isAwaitingSceneReady, onRoomReady])

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
        camera={{ position: cameraPosition }}
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
          <Model modelPath={modelPath} variant={modelVariant} />
          {!isBedroomView && <AnimatedModel modelPath={hexapodPath} playNonce={hexapodPlayNonce} />}
          {!isBedroomView && <AnimatedModel modelPath={quadrupedPath} playNonce={quadrupedPlayNonce} />}
        </Suspense>
        
        <CameraController
          projectFocusTarget={projectFocusTarget}
          isProjectCameraLocked={isProjectCameraLocked}
          initialCameraPosition={cameraPosition}
        />

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
