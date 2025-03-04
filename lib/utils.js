import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Mock data for the dashboard
export const mockDatasets = [
    {
        id: 1,
        name: "Autonomous Navigation Dataset",
        samples: 12500,
        lastUpdated: "2023-02-15T10:30:00Z",
    },
    {
        id: 2,
        name: "Object Recognition Dataset",
        samples: 8750,
        lastUpdated: "2023-02-10T14:45:00Z",
    },
    {
        id: 3,
        name: "Robotic Arm Movements",
        samples: 5200,
        lastUpdated: "2023-02-05T09:15:00Z",
    },
    {
        id: 4,
        name: "Environmental Mapping",
        samples: 3800,
        lastUpdated: "2023-01-28T16:20:00Z",
    },
    {
        id: 5,
        name: "Human-Robot Interaction",
        samples: 2100,
        lastUpdated: "2023-01-20T11:10:00Z",
    },
];

export const mockExperiments = [
    {
        id: 1,
        name: "YOLO v5 Object Detection",
        status: "Running",
        progress: 68,
        startDate: "2023-02-12T08:00:00Z",
    },
    {
        id: 2,
        name: "Reinforcement Learning Navigation",
        status: "Completed",
        progress: 100,
        startDate: "2023-02-01T09:30:00Z",
    },
    {
        id: 3,
        name: "Pose Estimation Model",
        status: "Paused",
        progress: 45,
        startDate: "2023-02-08T14:15:00Z",
    },
    {
        id: 4,
        name: "Semantic Segmentation",
        status: "Scheduled",
        progress: 0,
        startDate: "2023-02-20T10:00:00Z",
    },
    {
        id: 5,
        name: "Depth Estimation",
        status: "Running",
        progress: 32,
        startDate: "2023-02-14T11:45:00Z",
    },
];

export const mockAnnotationTasks = [
    {
        id: 1,
        name: "Label Urban Environment Objects",
        progress: 75,
        deadline: "2023-02-25T23:59:59Z",
    },
    {
        id: 2,
        name: "Annotate Human Poses",
        progress: 40,
        deadline: "2023-02-28T23:59:59Z",
    },
    {
        id: 3,
        name: "Segment Indoor Scenes",
        progress: 90,
        deadline: "2023-02-20T23:59:59Z",
    },
    {
        id: 4,
        name: "Label Robot Arm Positions",
        progress: 15,
        deadline: "2023-03-05T23:59:59Z",
    },
    {
        id: 5,
        name: "Annotate Drone Footage",
        progress: 60,
        deadline: "2023-03-01T23:59:59Z",
    },
];

export const mockPerformanceMetrics = {
    modelAccuracy: [
        { date: "2023-01-01", value: 0.82 },
        { date: "2023-01-15", value: 0.83 },
        { date: "2023-02-01", value: 0.85 },
        { date: "2023-02-15", value: 0.87 },
        { date: "2023-03-01", value: 0.89 },
    ],
    trainingTime: [
        { date: "2023-01-01", value: 120 },
        { date: "2023-01-15", value: 115 },
        { date: "2023-02-01", value: 105 },
        { date: "2023-02-15", value: 95 },
        { date: "2023-03-01", value: 90 },
    ],
};
