# 3D Fort Models System

## Overview

The 3D Fort Models system provides to-scale 3D representations of historic forts in the Western Ghats. This system allows users to explore forts in three dimensions, understand their architectural features, and compare different forts side-by-side.

## Features

### 🏰 **To-Scale 3D Models**
- Accurate dimensional representations of forts
- Realistic architectural features
- Interactive 3D viewing with orbit controls
- Adjustable scale for detailed examination

### 📊 **Fort Comparison**
- Side-by-side comparison of up to 3 forts
- Detailed feature comparison tables
- Visual and numerical data presentation

### 🎮 **Interactive Controls**
- Rotate, zoom, and pan 3D models
- Scale adjustment (0.1x to 3x)
- Reset view functionality
- Information panels with historical data

### 📚 **Historical Information**
- Built dates and builders
- Historical significance
- Construction materials
- Elevation and coordinates

## Available Forts

### 1. **Sinhagad Fort**
- **Dimensions**: 1,200m × 800m × 45m
- **Elevation**: 1,312m above sea level
- **Features**: 4 gates, 12 watchtowers, 8 water cisterns, 3 temples
- **Historical Significance**: Site of the legendary battle where Tanaji Malusare sacrificed his life
- **Difficulty**: Moderate

### 2. **Rajgad Fort**
- **Dimensions**: 1,500m × 1,000m × 50m
- **Elevation**: 1,376m above sea level
- **Features**: 6 gates, 16 watchtowers, 12 water cisterns, 5 temples
- **Historical Significance**: Capital of Maratha Empire for 26 years, known as the King of Forts
- **Difficulty**: Challenging

### 3. **Torna Fort**
- **Dimensions**: 900m × 600m × 40m
- **Elevation**: 1,403m above sea level
- **Features**: 3 gates, 8 watchtowers, 6 water cisterns, 2 temples
- **Historical Significance**: First fort captured by Shivaji Maharaj at age 16
- **Difficulty**: Easy

## Technical Implementation

### **3D Rendering Engine**
- **Three.js**: WebGL-based 3D graphics library
- **OrbitControls**: Interactive camera controls
- **Real-time rendering**: 60fps smooth performance
- **Responsive design**: Adapts to different screen sizes

### **Model Architecture**
Each fort model includes:
- **Perimeter Walls**: Accurate thickness and height
- **Watchtowers**: Cylindrical towers at strategic positions
- **Gates**: Main entrances at cardinal directions
- **Water Cisterns**: Blue cylindrical structures for water storage
- **Temples**: Golden conical structures
- **Residential Areas**: Brown rectangular buildings

### **Data Structure**
```typescript
interface FortData {
  name: string;
  dimensions: {
    length: number; // meters
    width: number; // meters
    height: number; // meters
    wallThickness: number; // meters
  };
  features: {
    gates: number;
    watchtowers: number;
    waterCisterns: number;
    temples: number;
    residentialAreas: number;
  };
  historicalInfo: {
    builtBy: string;
    builtIn: string;
    significance: string;
    materials: string[];
  };
  coordinates: {
    lat: number;
    lng: number;
    elevation: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
```

## Usage

### **Accessing the 3D Forts**
1. Navigate to `/3d-forts` in your application
2. Use the tabbed interface to explore different features:
   - **Fort Gallery**: Browse available forts
   - **Compare Forts**: Select up to 3 forts for comparison
   - **3D View**: Interactive 3D model viewer

### **3D Model Controls**
- **Mouse/Touch**: Rotate the model
- **Scroll**: Zoom in/out
- **Right-click + drag**: Pan the view
- **Reset button**: Return to default view
- **Scale slider**: Adjust model size (0.1x to 3x)
- **Info button**: Toggle information panel

### **Comparison Features**
1. Select up to 3 forts for comparison
2. View detailed comparison table
3. Compare dimensions, features, and historical data
4. Export comparison data (future feature)

## Adding New Forts

### **Step 1: Create Fort Data**
Add a new fort to the `FORTS_DATA` array in `components/fort-gallery.tsx`:

```typescript
{
  id: 'new-fort',
  name: 'New Fort Name',
  displayName: 'New Fort Display Name',
  description: 'Description of the fort',
  difficulty: 'Easy' | 'Moderate' | 'Challenging',
  elevation: '1,500m',
  duration: '4-5 hours',
  bestTime: 'Monsoon & Winter',
  coordinates: { lat: 18.123456, lng: 73.123456 },
  dimensions: {
    length: 1000, // meters
    width: 800,   // meters
    height: 45,   // meters
    wallThickness: 3, // meters
  },
  features: {
    gates: 4,
    watchtowers: 10,
    waterCisterns: 6,
    temples: 2,
    residentialAreas: 5,
  },
  historicalInfo: {
    builtBy: 'Builder Name',
    builtIn: '17th Century',
    significance: 'Historical significance',
    materials: ['Material 1', 'Material 2'],
  },
  colors: {
    primary: '#8B4513',
    secondary: '#A0522D',
    accent: '#CD853F',
  },
  imageUrl: '/fort-image.jpg',
}
```

### **Step 2: Add to 3D Model Data**
Add the fort data to the `FORT_MODELS` object in `components/3d-fort-model.tsx`:

```typescript
'New Fort Name': {
  name: 'New Fort Name',
  dimensions: {
    length: 1000,
    width: 800,
    height: 45,
    wallThickness: 3,
  },
  features: {
    gates: 4,
    watchtowers: 10,
    waterCisterns: 6,
    temples: 2,
    residentialAreas: 5,
  },
  historicalInfo: {
    builtBy: 'Builder Name',
    builtIn: '17th Century',
    significance: 'Historical significance',
    materials: ['Material 1', 'Material 2'],
  },
  coordinates: {
    lat: 18.123456,
    lng: 73.123456,
    elevation: 1500,
  },
  colors: {
    primary: '#8B4513',
    secondary: '#A0522D',
    accent: '#CD853F',
  },
}
```

### **Step 3: Add Images (Optional)**
1. Place fort images in the `public/` directory
2. Update the `imageUrl` in the fort data
3. Images should be in JPG/PNG format, recommended size: 800x600px

## Performance Optimization

### **Rendering Optimizations**
- **Level of Detail (LOD)**: Adjust model complexity based on zoom level
- **Frustum Culling**: Only render visible objects
- **Texture Compression**: Optimize texture sizes
- **Geometry Instancing**: Reuse geometry for repeated elements

### **Memory Management**
- **Dispose Resources**: Clean up Three.js objects when components unmount
- **Texture Pooling**: Reuse textures across models
- **Geometry Caching**: Cache common geometries

### **Mobile Optimization**
- **Touch Controls**: Optimized for mobile devices
- **Reduced Complexity**: Simplified models for mobile
- **Battery Optimization**: Efficient rendering loops

## Future Enhancements

### **Planned Features**
1. **AR Integration**: View forts in augmented reality
2. **VR Support**: Virtual reality fort exploration
3. **Historical Timelines**: See forts through different time periods
4. **Interactive Tours**: Guided 3D tours with narration
5. **User-Generated Content**: Allow users to add custom forts
6. **Export Options**: Export 3D models in various formats
7. **Multiplayer**: Collaborative fort exploration

### **Technical Improvements**
1. **Advanced Materials**: PBR materials for realistic rendering
2. **Weather Effects**: Dynamic weather in 3D scenes
3. **Day/Night Cycles**: Realistic lighting changes
4. **Sound Integration**: Ambient sounds and historical audio
5. **AI Integration**: Smart fort recommendations

## Troubleshooting

### **Common Issues**

1. **3D Model Not Loading**
   - Check browser WebGL support
   - Ensure Three.js is properly installed
   - Verify fort data is correctly formatted

2. **Performance Issues**
   - Reduce model complexity
   - Lower texture resolution
   - Close other browser tabs

3. **Controls Not Working**
   - Check for JavaScript errors
   - Ensure proper event handling
   - Verify touch/mouse input

4. **Display Issues**
   - Update graphics drivers
   - Check browser compatibility
   - Clear browser cache

### **Browser Compatibility**
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Limited support (basic features)

## Contributing

### **Guidelines for Adding Forts**
1. **Research Accuracy**: Ensure historical and dimensional accuracy
2. **Data Validation**: Verify all measurements and coordinates
3. **Image Quality**: Use high-quality, properly licensed images
4. **Documentation**: Update documentation with new forts

### **Code Standards**
1. **TypeScript**: Use strict typing
2. **Performance**: Optimize for smooth 60fps rendering
3. **Accessibility**: Ensure keyboard navigation support
4. **Responsive Design**: Work on all screen sizes

## Support

For technical support or questions about the 3D Fort Models system:

1. Check the browser console for error messages
2. Verify all dependencies are installed
3. Ensure proper Three.js setup
4. Test with different browsers
5. Check network connectivity for texture loading

## License

This 3D Fort Models system is part of the Sahyadri Guardian project and follows the same licensing terms. 