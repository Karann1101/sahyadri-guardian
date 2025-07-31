'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  RotateCcw, 
  Maximize2, 
  Layers, 
  Ruler, 
  Info,
  Camera,
  MapPin,
  Mountain,
  Castle,
  Shield,
  Users,
  Clock
} from 'lucide-react';

interface FortModelProps {
  fortName: string;
  fortData: FortData;
  className?: string;
  height?: string;
  showControls?: boolean;
}

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
    elevation: number; // meters above sea level
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Pre-defined fort data
const FORT_MODELS: Record<string, FortData> = {
  'Sinhagad Fort': {
    name: 'Sinhagad Fort',
    dimensions: {
      length: 1200, // meters
      width: 800, // meters
      height: 45, // meters (wall height)
      wallThickness: 3, // meters
    },
    features: {
      gates: 4,
      watchtowers: 12,
      waterCisterns: 8,
      temples: 3,
      residentialAreas: 6,
    },
    historicalInfo: {
      builtBy: 'Shivaji Maharaj',
      builtIn: '17th Century',
      significance: 'Site of the legendary battle where Tanaji Malusare sacrificed his life',
      materials: ['Basalt Stone', 'Lime Mortar', 'Iron Reinforcements'],
    },
    coordinates: {
      lat: 18.365664,
      lng: 73.755269,
      elevation: 1312, // meters above sea level
    },
    colors: {
      primary: '#8B4513', // Saddle Brown
      secondary: '#A0522D', // Sienna
      accent: '#CD853F', // Peru
    },
  },
  'Rajgad Fort': {
    name: 'Rajgad Fort',
    dimensions: {
      length: 1500, // meters
      width: 1000, // meters
      height: 50, // meters
      wallThickness: 4, // meters
    },
    features: {
      gates: 6,
      watchtowers: 16,
      waterCisterns: 12,
      temples: 5,
      residentialAreas: 8,
    },
    historicalInfo: {
      builtBy: 'Shivaji Maharaj',
      builtIn: '17th Century',
      significance: 'Capital of Maratha Empire for 26 years, known as the King of Forts',
      materials: ['Granite Stone', 'Lime Mortar', 'Iron Gates'],
    },
    coordinates: {
      lat: 18.246111,
      lng: 73.682222,
      elevation: 1376, // meters above sea level
    },
    colors: {
      primary: '#696969', // Dim Gray
      secondary: '#808080', // Gray
      accent: '#A9A9A9', // Dark Gray
    },
  },
  'Torna Fort': {
    name: 'Torna Fort',
    dimensions: {
      length: 900, // meters
      width: 600, // meters
      height: 40, // meters
      wallThickness: 2.5, // meters
    },
    features: {
      gates: 3,
      watchtowers: 8,
      waterCisterns: 6,
      temples: 2,
      residentialAreas: 4,
    },
    historicalInfo: {
      builtBy: 'Shivaji Maharaj',
      builtIn: '17th Century',
      significance: 'First fort captured by Shivaji Maharaj at age 16',
      materials: ['Basalt Stone', 'Lime Mortar', 'Wooden Beams'],
    },
    coordinates: {
      lat: 18.276072,
      lng: 73.622716,
      elevation: 1403, // meters above sea level
    },
    colors: {
      primary: '#8B7355', // Dark Khaki
      secondary: '#B8860B', // Dark Goldenrod
      accent: '#DAA520', // Goldenrod
    },
  },
};

const FortModel: React.FC<FortModelProps> = ({
  fortName,
  fortData,
  className = '',
  height = '500px',
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!mountRef.current || !fortData) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(50, 50, 50);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x90EE90,
      transparent: true,
      opacity: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create fort structure
    createFortStructure(scene, fortData, scale);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Mount renderer
    mountRef.current.appendChild(renderer.domElement);
    setIsLoading(false);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [fortData, scale]);

  const createFortStructure = (scene: THREE.Scene, data: FortData, scaleFactor: number) => {
    const { dimensions, features, colors } = data;
    
    // Main fort walls
    const wallGeometry = new THREE.BoxGeometry(
      dimensions.length * scaleFactor,
      dimensions.height * scaleFactor,
      dimensions.wallThickness * scaleFactor
    );
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: colors.primary,
      roughness: 0.8,
      metalness: 0.1
    });

    // Create perimeter walls
    const wallPositions = [
      // North wall
      { x: 0, y: dimensions.height * scaleFactor / 2, z: -dimensions.width * scaleFactor / 2 },
      // South wall
      { x: 0, y: dimensions.height * scaleFactor / 2, z: dimensions.width * scaleFactor / 2 },
      // East wall
      { x: dimensions.length * scaleFactor / 2, y: dimensions.height * scaleFactor / 2, z: 0 },
      // West wall
      { x: -dimensions.length * scaleFactor / 2, y: dimensions.height * scaleFactor / 2, z: 0 },
    ];

    wallPositions.forEach((pos, index) => {
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(pos.x, pos.y, pos.z);
      
      // Rotate east and west walls
      if (index >= 2) {
        wall.rotation.y = Math.PI / 2;
      }
      
      wall.castShadow = true;
      wall.receiveShadow = true;
      scene.add(wall);
    });

    // Create watchtowers
    for (let i = 0; i < features.watchtowers; i++) {
      const towerGeometry = new THREE.CylinderGeometry(
        5 * scaleFactor,
        8 * scaleFactor,
        (dimensions.height + 10) * scaleFactor,
        8
      );
      const towerMaterial = new THREE.MeshLambertMaterial({ color: colors.secondary });
      const tower = new THREE.Mesh(towerGeometry, towerMaterial);
      
      // Position towers around the perimeter
      const angle = (i / features.watchtowers) * Math.PI * 2;
      const radius = Math.min(dimensions.length, dimensions.width) * scaleFactor / 2;
      tower.position.set(
        Math.cos(angle) * radius,
        (dimensions.height + 10) * scaleFactor / 2,
        Math.sin(angle) * radius
      );
      
      tower.castShadow = true;
      tower.receiveShadow = true;
      scene.add(tower);
    }

    // Create gates
    for (let i = 0; i < features.gates; i++) {
      const gateGeometry = new THREE.BoxGeometry(
        8 * scaleFactor,
        dimensions.height * scaleFactor,
        4 * scaleFactor
      );
      const gateMaterial = new THREE.MeshLambertMaterial({ color: colors.accent });
      const gate = new THREE.Mesh(gateGeometry, gateMaterial);
      
      // Position gates at cardinal directions
      const positions = [
        { x: 0, z: -dimensions.width * scaleFactor / 2 }, // North
        { x: 0, z: dimensions.width * scaleFactor / 2 },  // South
        { x: dimensions.length * scaleFactor / 2, z: 0 }, // East
        { x: -dimensions.length * scaleFactor / 2, z: 0 }, // West
      ];
      
      if (i < positions.length) {
        gate.position.set(
          positions[i].x,
          dimensions.height * scaleFactor / 2,
          positions[i].z
        );
        gate.castShadow = true;
        gate.receiveShadow = true;
        scene.add(gate);
      }
    }

    // Create water cisterns
    for (let i = 0; i < features.waterCisterns; i++) {
      const cisternGeometry = new THREE.CylinderGeometry(
        3 * scaleFactor,
        3 * scaleFactor,
        2 * scaleFactor,
        16
      );
      const cisternMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x4169E1,
        transparent: true,
        opacity: 0.7
      });
      const cistern = new THREE.Mesh(cisternGeometry, cisternMaterial);
      
      // Random positions within the fort
      cistern.position.set(
        (Math.random() - 0.5) * dimensions.length * scaleFactor * 0.6,
        1 * scaleFactor,
        (Math.random() - 0.5) * dimensions.width * scaleFactor * 0.6
      );
      
      cistern.castShadow = true;
      cistern.receiveShadow = true;
      scene.add(cistern);
    }

    // Create temples
    for (let i = 0; i < features.temples; i++) {
      const templeGeometry = new THREE.ConeGeometry(
        4 * scaleFactor,
        8 * scaleFactor,
        8
      );
      const templeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
      const temple = new THREE.Mesh(templeGeometry, templeMaterial);
      
      temple.position.set(
        (Math.random() - 0.5) * dimensions.length * scaleFactor * 0.4,
        4 * scaleFactor,
        (Math.random() - 0.5) * dimensions.width * scaleFactor * 0.4
      );
      
      temple.castShadow = true;
      temple.receiveShadow = true;
      scene.add(temple);
    }

    // Create residential areas
    for (let i = 0; i < features.residentialAreas; i++) {
      const houseGeometry = new THREE.BoxGeometry(
        6 * scaleFactor,
        3 * scaleFactor,
        4 * scaleFactor
      );
      const houseMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
      const house = new THREE.Mesh(houseGeometry, houseMaterial);
      
      house.position.set(
        (Math.random() - 0.5) * dimensions.length * scaleFactor * 0.5,
        1.5 * scaleFactor,
        (Math.random() - 0.5) * dimensions.width * scaleFactor * 0.5
      );
      
      house.castShadow = true;
      house.receiveShadow = true;
      scene.add(house);
    }
  };

  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(50, 50, 50);
      cameraRef.current.lookAt(0, 0, 0);
      controlsRef.current.reset();
    }
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
  };

  if (!fortData) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">Fort data not available</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading 3D Fort Model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center p-4">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      )}

      {/* 3D Model Container */}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-4 right-4 space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetView}
            className="bg-white/80 backdrop-blur-sm"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowInfo(!showInfo)}
            className="bg-white/80 backdrop-blur-sm"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Scale Control */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Ruler className="h-4 w-4" />
          <span className="text-sm font-medium">Scale: {scale.toFixed(1)}x</span>
        </div>
        <Slider
          value={[scale]}
          onValueChange={handleScaleChange}
          max={3}
          min={0.1}
          step={0.1}
          className="w-32"
        />
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-4 left-4 max-w-sm">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Castle className="h-5 w-5" />
                {fortData.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dimensions */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Dimensions</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>Length: {fortData.dimensions.length}m</div>
                  <div>Width: {fortData.dimensions.width}m</div>
                  <div>Height: {fortData.dimensions.height}m</div>
                  <div>Walls: {fortData.dimensions.wallThickness}m</div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-semibold text-sm mb-2">Features</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Gates: {fortData.features.gates}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mountain className="h-3 w-3" />
                    Towers: {fortData.features.watchtowers}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Cisterns: {fortData.features.waterCisterns}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Areas: {fortData.features.residentialAreas}
                  </div>
                </div>
              </div>

              {/* Historical Info */}
              <div>
                <h4 className="font-semibold text-sm mb-2">History</h4>
                <div className="text-xs space-y-1">
                  <div><strong>Built by:</strong> {fortData.historicalInfo.builtBy}</div>
                  <div><strong>Built in:</strong> {fortData.historicalInfo.builtIn}</div>
                  <div><strong>Elevation:</strong> {fortData.coordinates.elevation}m</div>
                </div>
              </div>

              <div className="text-xs text-gray-600">
                {fortData.historicalInfo.significance}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FortModel; 