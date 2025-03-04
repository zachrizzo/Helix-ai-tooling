'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface Point {
  position: [number, number, number];
  color?: [number, number, number];
  intensity?: number;
  classification?: number;
}

interface PointCloudViewerProps {
  points: Point[];
  colorByHeight?: boolean;
  colorByIntensity?: boolean;
  colorByClassification?: boolean;
  pointSize?: number;
}

function generateRandomPointCloud(numPoints: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < numPoints; i++) {
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;

    const intensity = Math.random();
    const classification = Math.floor(Math.random() * 5);

    points.push({
      position: [x, y, z],
      intensity,
      classification,
    });
  }
  return points;
}

function PointCloud({
  points,
  colorByHeight = false,
  colorByIntensity = false,
  colorByClassification = true,
  pointSize = 0.05,
}: PointCloudViewerProps) {
  const { camera } = useThree();
  const mesh = useRef<THREE.Points>(null!);

  useEffect(() => {
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.rotation.y += 0.001;
  });

  // Create point cloud geometry
  const positions = new Float32Array(points.length * 3);
  const colors = new Float32Array(points.length * 3);

  // Classification colors
  const classColors: [number, number, number][] = [
    [0.2, 0.8, 0.2], // green - vegetation
    [0.8, 0.2, 0.2], // red - buildings
    [0.8, 0.8, 0.2], // yellow - roads
    [0.2, 0.2, 0.8], // blue - vehicles
    [0.8, 0.2, 0.8], // purple - other
  ];

  // Height color gradient (blue to red)
  const heightColors = (height: number): [number, number, number] => {
    const normalizedHeight = (height + 10) / 20; // Assuming height range of -10 to 10
    return [
      Math.min(1, normalizedHeight * 2), // Red
      Math.min(1, 2 - Math.abs(normalizedHeight - 0.5) * 4), // Green
      Math.min(1, (1 - normalizedHeight) * 2), // Blue
    ];
  };

  // Intensity gradient (black to white)
  const intensityColors = (intensity: number): [number, number, number] => {
    const i = Math.min(1, Math.max(0, intensity));
    return [i, i, i];
  };

  // Fill position and color arrays
  points.forEach((point, i) => {
    const [x, y, z] = point.position;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    let color: [number, number, number];

    if (colorByClassification && point.classification !== undefined) {
      color = classColors[point.classification % classColors.length];
    } else if (colorByHeight) {
      color = heightColors(y);
    } else if (colorByIntensity && point.intensity !== undefined) {
      color = intensityColors(point.intensity);
    } else if (point.color) {
      color = point.color;
    } else {
      color = [1, 1, 1]; // Default white
    }

    colors[i * 3] = color[0];
    colors[i * 3 + 1] = color[1];
    colors[i * 3 + 2] = color[2];
  });

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return (
    <points ref={mesh}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial
        attach="material"
        vertexColors
        size={pointSize}
        sizeAttenuation
      />
    </points>
  );
}

function Grid() {
  return (
    <gridHelper
      args={[20, 20, 0x888888, 0x444444]}
      position={[0, -0.01, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function Axes() {
  return (
    <group>
      {/* X axis - red */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 5, 0, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="red" linewidth={2} />
      </line>

      {/* Y axis - green */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 5, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="green" linewidth={2} />
      </line>

      {/* Z axis - blue */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, 0, 0, 0, 0, 5])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="blue" linewidth={2} />
      </line>
    </group>
  );
}

export default function PointCloudViewer({
  points: propPoints,
  colorByHeight = false,
  colorByIntensity = false,
  colorByClassification = true,
  pointSize = 0.05,
}: PointCloudViewerProps) {
  // Use provided points or generate random ones if not provided
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    if (propPoints && propPoints.length > 0) {
      setPoints(propPoints);
    } else {
      // Generate random points for demo
      setPoints(generateRandomPointCloud(5000));
    }
  }, [propPoints]);

  return (
    <div className="w-full h-full">
      <Canvas>
        <color attach="background" args={['#111']} />
        <PerspectiveCamera makeDefault fov={75} position={[5, 5, 5]} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <PointCloud
          points={points}
          colorByHeight={colorByHeight}
          colorByIntensity={colorByIntensity}
          colorByClassification={colorByClassification}
          pointSize={pointSize}
        />

        <Grid />
        <Axes />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
