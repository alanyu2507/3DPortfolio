# Images Folder

This folder contains static images and textures for your application.

## Supported Formats
- `.jpg` / `.jpeg` - Standard image format
- `.png` - With transparency support
- `.webp` - Modern format with better compression
- `.svg` - Vector graphics
- `.gif` - Animated images

## Usage Examples

### Loading textures in Three.js:
```tsx
import { useTexture } from '@react-three/drei'

function TexturedBox() {
  const texture = useTexture('/images/texture.jpg')
  return (
    <Box>
      <meshStandardMaterial map={texture} />
    </Box>
  )
}
```

### Using images in React components:
```tsx
function ImageComponent() {
  return <img src="/images/logo.png" alt="Logo" />
}
```

## Tips
- Optimize images for web (compress, resize)
- Use WebP format when possible for better performance
- Consider using image sprites for small icons
