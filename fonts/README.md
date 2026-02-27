# Fonts Folder

This folder contains custom fonts for your application.

## Supported Formats
- `.woff2` - Modern web font format (recommended)
- `.woff` - Web font format
- `.ttf` - TrueType font
- `.otf` - OpenType font
- `.eot` - Internet Explorer font format

## Usage Examples

### Loading fonts in CSS:
```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2'),
       url('/fonts/custom-font.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

body {
  font-family: 'CustomFont', sans-serif;
}
```

### Using fonts in Three.js text:
```tsx
import { Text } from '@react-three/drei'

function Text3D() {
  return (
    <Text
      font="/fonts/custom-font.woff2"
      fontSize={1}
      color="white"
    >
      Hello World
    </Text>
  )
}
```

## Tips
- Use WOFF2 format for best compression and browser support
- Include fallback fonts in your font stack
- Consider font loading strategies for better performance
- Use font-display: swap for better user experience
