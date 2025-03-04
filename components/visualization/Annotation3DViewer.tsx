import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

interface Point {
    position: [number, number, number];
    color?: [number, number, number];
    intensity?: number;
    classification?: number;
}

interface Annotation {
    id: number;
    type: string;
    label: string;
    points: number[][];
    color: string;
}

interface Annotation3DViewerProps {
    points: Point[];
    annotations: Annotation[];
    selectedAnnotation: number | null;
    onSelectAnnotation: (id: number | null) => void;
    onAddAnnotation: (points: number[][]) => void;
    isAnnotating: boolean;
    annotationType: string;
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

function AnnotationScene({
    points,
    annotations,
    selectedAnnotation,
    onSelectAnnotation,
    onAddAnnotation,
    isAnnotating,
    annotationType
}: Annotation3DViewerProps) {
    const { camera, scene } = useThree();
    const pointCloudRef = useRef<THREE.Points>(null!);
    const [selectedPoints, setSelectedPoints] = useState<number[][]>([]);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    useEffect(() => {
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);

        // Set raycaster parameters for point picking
        raycaster.params.Points = { threshold: 0.1 };

        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.addEventListener('click', handleCanvasClick);
        }

        return () => {
            if (canvas) {
                canvas.removeEventListener('click', handleCanvasClick);
            }
        };
    }, [camera, isAnnotating]);

    const handleCanvasClick = (event: MouseEvent) => {
        if (!isAnnotating || !pointCloudRef.current) return;

        const canvas = event.target as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(pointCloudRef.current);

        if (intersects.length > 0) {
            const point = intersects[0].point;
            const newPoint = [point.x, point.y, point.z];

            setSelectedPoints([...selectedPoints, newPoint]);

            // If we're creating a bounding box and have 2 points, or creating a polygon and have 3+ points and clicked near first point
            if ((annotationType === 'box' && selectedPoints.length === 1) ||
                (annotationType === 'polygon' && selectedPoints.length >= 2 &&
                    isNearFirstPoint(newPoint, selectedPoints[0]))) {
                onAddAnnotation([...selectedPoints, newPoint]);
                setSelectedPoints([]);
            }
        }
    };

    const isNearFirstPoint = (point1: number[], point2: number[]) => {
        const distance = Math.sqrt(
            Math.pow(point1[0] - point2[0], 2) +
            Math.pow(point1[1] - point2[1], 2) +
            Math.pow(point1[2] - point2[2], 2)
        );
        return distance < 0.5; // Threshold for "near"
    };

    // Create point cloud geometry
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);

    // Fill position and color arrays
    points.forEach((point, i) => {
        const [x, y, z] = point.position;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Default color (light gray)
        let color: [number, number, number] = [0.7, 0.7, 0.7];

        // Use classification color if available
        if (point.classification !== undefined) {
            const classColors: [number, number, number][] = [
                [0.2, 0.8, 0.2], // green - vegetation
                [0.8, 0.2, 0.2], // red - buildings
                [0.8, 0.8, 0.2], // yellow - roads
                [0.2, 0.2, 0.8], // blue - vehicles
                [0.8, 0.2, 0.8], // purple - other
            ];
            color = classColors[point.classification % classColors.length];
        }

        colors[i * 3] = color[0];
        colors[i * 3 + 1] = color[1];
        colors[i * 3 + 2] = color[2];
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return (
        <>
            <PerspectiveCamera makeDefault position={[5, 5, 5]} />
            <OrbitControls enableDamping dampingFactor={0.25} />

            {/* Grid and axes for reference */}
            <gridHelper args={[20, 20, 0x888888, 0x444444]} />
            <axesHelper args={[5]} />

            {/* Point cloud */}
            <points ref={pointCloudRef}>
                <bufferGeometry attach="geometry" {...geometry} />
                <pointsMaterial
                    attach="material"
                    vertexColors
                    size={0.1}
                    sizeAttenuation
                />
            </points>

            {/* Render annotations */}
            {annotations.map((annotation) => (
                <group key={annotation.id} onClick={() => onSelectAnnotation(annotation.id)}>
                    {annotation.type === 'box' && annotation.points.length >= 2 && (
                        <mesh
                            position={[
                                (annotation.points[0][0] + annotation.points[1][0]) / 2,
                                (annotation.points[0][1] + annotation.points[1][1]) / 2,
                                (annotation.points[0][2] + annotation.points[1][2]) / 2
                            ]}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectAnnotation(annotation.id);
                            }}
                        >
                            <boxGeometry
                                args={[
                                    Math.abs(annotation.points[1][0] - annotation.points[0][0]),
                                    Math.abs(annotation.points[1][1] - annotation.points[0][1]),
                                    Math.abs(annotation.points[1][2] - annotation.points[0][2])
                                ]}
                            />
                            <meshBasicMaterial
                                color={annotation.id === selectedAnnotation ? '#00ff00' : annotation.color}
                                opacity={0.3}
                                transparent
                                wireframe={annotation.id === selectedAnnotation}
                            />
                        </mesh>
                    )}

                    {annotation.type === 'polygon' && annotation.points.length >= 3 && (
                        <line
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectAnnotation(annotation.id);
                            }}
                        >
                            <bufferGeometry attach="geometry">
                                <bufferAttribute
                                    attach="attributes-position"
                                    count={annotation.points.length}
                                    array={Float32Array.from(annotation.points.flat())}
                                    itemSize={3}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial
                                attach="material"
                                color={annotation.id === selectedAnnotation ? '#00ff00' : annotation.color}
                                linewidth={2}
                            />
                        </line>
                    )}

                    {/* Label */}
                    <Html
                        position={[annotation.points[0][0], annotation.points[0][1] + 0.5, annotation.points[0][2]]}
                        distanceFactor={10}
                        occlude
                    >
                        <div className={`px-2 py-1 text-xs rounded ${annotation.id === selectedAnnotation ? 'bg-green-500' : 'bg-blue-500'
                            } text-white`}>
                            {annotation.label}
                        </div>
                    </Html>
                </group>
            ))}

            {/* Render currently selected points */}
            {selectedPoints.map((point, index) => (
                <mesh key={index} position={[point[0], point[1], point[2]]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshBasicMaterial color="#ff0000" />
                </mesh>
            ))}
        </>
    );
}

export default function Annotation3DViewer({
    points: propPoints,
    annotations = [],
    selectedAnnotation = null,
    onSelectAnnotation = () => { },
    onAddAnnotation = () => { },
    isAnnotating = false,
    annotationType = 'box'
}: Partial<Annotation3DViewerProps>) {
    // Use provided points or generate random ones for demo
    const points = propPoints || generateRandomPointCloud(1000);

    return (
        <div className="w-full h-full relative">
            <Canvas>
                <AnnotationScene
                    points={points}
                    annotations={annotations}
                    selectedAnnotation={selectedAnnotation}
                    onSelectAnnotation={onSelectAnnotation}
                    onAddAnnotation={onAddAnnotation}
                    isAnnotating={isAnnotating}
                    annotationType={annotationType}
                />
            </Canvas>

            {isAnnotating && (
                <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-sm">
                    {annotationType === 'box' ? (
                        <p>Click to set opposite corners of the bounding box</p>
                    ) : (
                        <p>Click to add polygon points. Click near first point to complete</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        Selected {selectedAnnotation ? annotations.find(a => a.id === selectedAnnotation)?.label : 'none'}
                    </p>
                </div>
            )}
        </div>
    );
}
