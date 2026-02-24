# Models Folder

This folder contains 3D models and assets for your Three.js scenes.

## Supported Formats
- `.gltf` / `.glb` - Recommended format for Three.js
- `.obj` - Wavefront OBJ files
- `.fbx` - Autodesk FBX files
- `.dae` - Collada files

## Usage Examples

### Loading GLTF/GLB models:
```tsx
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/your-model.glb')
  return <primitive object={scene} />
}
```

### Loading OBJ models:
```tsx
import { useOBJ } from '@react-three/drei'

function Model() {
  const obj = useOBJ('/models/your-model.obj')
  return <primitive object={obj} />
}
```

## Tips
- Use GLTF/GLB format for best performance and features
- Keep file sizes reasonable for web performance
- Consider using Draco compression for large models
