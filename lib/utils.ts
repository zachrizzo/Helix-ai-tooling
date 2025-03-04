import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock data for the application
export const mockDatasets = [
  {
    id: "dataset-001",
    name: "Humanoid Movement Patterns",
    description: "Collection of basic movement patterns for humanoid robots",
    samples: 1245,
    created: "2023-11-15",
    lastUpdated: "2024-02-28",
    tags: ["movement", "locomotion", "balance"],
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "dataset-002",
    name: "Object Manipulation Training",
    description: "Data for training robots to grasp and manipulate various objects",
    samples: 3782,
    created: "2023-09-22",
    lastUpdated: "2024-03-01",
    tags: ["manipulation", "grasping", "precision"],
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "dataset-003",
    name: "Human-Robot Interaction",
    description: "Scenarios of robots interacting with humans in various contexts",
    samples: 2156,
    created: "2023-12-05",
    lastUpdated: "2024-02-15",
    tags: ["interaction", "safety", "communication"],
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "dataset-004",
    name: "Environmental Navigation",
    description: "Robot navigation through different environments and obstacles",
    samples: 1893,
    created: "2024-01-10",
    lastUpdated: "2024-02-28",
    tags: ["navigation", "mapping", "obstacles"],
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "dataset-005",
    name: "Factory Floor Interactions",
    description: "Data capturing human-robot interactions in a factory setting",
    samples: 5000,
    created: "2024-01-20",
    lastUpdated: "2024-03-10",
    tags: ["factory", "collaboration", "safety"],
    thumbnail: "/placeholder.svg?height=200&width=300",
  },
]

export const mockExperiments = [
  {
    id: "exp-001",
    name: "Improved Gait Stability",
    description: "Testing enhanced algorithms for stable walking on uneven surfaces",
    dataset: "Humanoid Movement Patterns",
    status: "Running",
    progress: 68,
    startDate: "2024-02-15",
    metrics: {
      accuracy: 0.87,
      stability: 0.92,
      energyEfficiency: 0.76,
    },
  },
  {
    id: "exp-002",
    name: "Fine Motor Control",
    description: "Refining precision for small object manipulation",
    dataset: "Object Manipulation Training",
    status: "Completed",
    progress: 100,
    startDate: "2024-01-20",
    endDate: "2024-02-25",
    metrics: {
      accuracy: 0.94,
      precision: 0.89,
      speed: 0.82,
    },
  },
  {
    id: "exp-003",
    name: "Human Intent Recognition",
    description: "Improving robot's ability to understand human gestures and commands",
    dataset: "Human-Robot Interaction",
    status: "Paused",
    progress: 45,
    startDate: "2024-02-01",
    metrics: {
      accuracy: 0.78,
      responseTime: 0.85,
      naturalness: 0.72,
    },
  },
  {
    id: "exp-004",
    name: "Obstacle Avoidance Optimization",
    description: "Enhancing real-time obstacle detection and avoidance",
    dataset: "Environmental Navigation",
    status: "Scheduled",
    progress: 0,
    startDate: "2024-03-10",
  },
]

export const mockAnnotationTasks = [
  {
    id: "task-001",
    name: "Human-Robot Interaction Scenario Labeling",
    description: "Label humans, objects, and interaction zones for safe robot collaboration training",
    dataset: "Factory Floor Interactions",
    progress: 65,
    priority: "High",
    deadline: "2024-03-15",
    assignedTo: "user123",
    type: "Bounding Box",
    totalFrames: 450,
    completedFrames: 293,
  },
  {
    id: "task-002",
    name: "Object Grasp Point Identification",
    description: "Mark optimal grasp points on various objects for robotic manipulation",
    dataset: "Object Manipulation Training",
    progress: 42,
    priority: "Medium",
    deadline: "2024-03-20",
    assignedTo: "user456",
    type: "Point Annotation",
    totalSamples: 500,
    completedSamples: 210,
  },
  {
    id: "task-003",
    name: "Human Gesture Classification",
    description: "Classify human gestures for robot response training",
    dataset: "Human-Robot Interaction",
    progress: 78,
    priority: "High",
    deadline: "2024-03-10",
    assignedTo: "user789",
    type: "Classification",
    totalSequences: 300,
    completedSequences: 234,
  },
  {
    id: "task-004",
    name: "Environment Segmentation",
    description: "Segment different elements in the robot's operating environment",
    dataset: "Environmental Navigation",
    progress: 22,
    priority: "Low",
    deadline: "2024-03-30",
    assignedTo: "user123",
    type: "Segmentation",
    totalFrames: 600,
    completedFrames: 132,
  },
]

export const mockPerformanceMetrics = {
  modelAccuracy: [
    { date: "2024-01-01", value: 0.72 },
    { date: "2024-01-15", value: 0.75 },
    { date: "2024-02-01", value: 0.79 },
    { date: "2024-02-15", value: 0.83 },
    { date: "2024-03-01", value: 0.87 },
  ],
  trainingTime: [
    { date: "2024-01-01", value: 24.5 },
    { date: "2024-01-15", value: 22.3 },
    { date: "2024-02-01", value: 20.1 },
    { date: "2024-02-15", value: 18.7 },
    { date: "2024-03-01", value: 16.2 },
  ],
  inferenceSpeed: [
    { date: "2024-01-01", value: 120 },
    { date: "2024-01-15", value: 105 },
    { date: "2024-02-01", value: 95 },
    { date: "2024-02-15", value: 82 },
    { date: "2024-03-01", value: 75 },
  ],
}

export const mockAnnotationSample = {
  id: "sample-001",
  dataset: "Humanoid Movement Patterns",
  videoUrl: "/placeholder.svg?height=480&width=640",
  frames: 120,
  duration: "00:04:00",
  annotations: [
    {
      id: "ann-001",
      frame: 15,
      type: "bounding_box",
      label: "left_arm",
      coordinates: { x: 120, y: 150, width: 80, height: 120 },
    },
    {
      id: "ann-002",
      frame: 15,
      type: "bounding_box",
      label: "right_arm",
      coordinates: { x: 320, y: 150, width: 80, height: 120 },
    },
    {
      id: "ann-003",
      frame: 15,
      type: "bounding_box",
      label: "torso",
      coordinates: { x: 220, y: 200, width: 100, height: 150 },
    },
    {
      id: "ann-004",
      frame: 30,
      type: "bounding_box",
      label: "left_arm",
      coordinates: { x: 130, y: 160, width: 80, height: 120 },
    },
  ],
}

