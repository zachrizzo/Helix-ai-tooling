# Robotics AI Platform

A comprehensive web-based platform for building, training, and managing AI systems for robotics applications. This project showcases frontend development skills for AI and robotics data tools.

## Features

### Data Annotation Tools

- **2D Image Annotation**: Bounding box and polygon annotation for robot vision data
- **3D Point Cloud Annotation**: Interactive 3D annotation for LiDAR and depth sensor data
- **AI-Assisted Labeling**: Automated suggestions for faster annotation with confidence thresholds
- **Multi-modal Support**: Handle different data types from various robot sensors

### Data Visualization

- **3D Point Cloud Visualization**: Interactive visualization of 3D sensor data
- **Time-series Data Plotting**: Visualize robot telemetry and sensor readings over time
- **Sensor Fusion Views**: Combined visualization of multiple sensor inputs

### Model Training Interface

- **Training Configuration**: Set up and configure AI model training parameters
- **Experiment Tracking**: Monitor training progress and compare model performance
- **Dataset Management**: Create, split, and manage training datasets

### Deployment Tools

- **Model Optimization**: Tools for optimizing models for edge deployment on robots
- **Deployment Management**: Track model versions deployed to different robots
- **Performance Monitoring**: Monitor deployed model performance metrics

## Technology Stack

- **Frontend**: React, TypeScript, Next.js
- **UI Components**: Tailwind CSS
- **3D Visualization**: Three.js, React Three Fiber
- **Data Visualization**: Chart.js
- **State Management**: React Hooks

## AI-Assisted Annotation

The platform features advanced AI-assisted annotation tools that help speed up the labeling process:

1. **Automatic Object Detection**: Pre-trained models suggest bounding boxes for common objects
2. **Confidence Thresholds**: Adjust confidence levels to filter AI suggestions
3. **One-Click Application**: Apply AI suggestions with a single click
4. **Interactive Editing**: Easily modify AI-generated annotations
5. **Multi-model Support**: Choose different AI models for different annotation tasks

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

## Project Structure

- `/app`: Next.js app router pages
- `/components`: Reusable React components
- `/components/ui`: UI components like buttons, forms, etc.
- `/components/visualization`: Data visualization components
- `/backend`: Backend API routes (simulated for demo)

## Use Cases

This platform is designed for robotics AI teams who need to:

1. **Annotate Robot Sensor Data**: Label images, point clouds, and time-series data
2. **Train Custom AI Models**: Configure and train models for specific robotics tasks
3. **Visualize Complex Data**: Understand multi-modal sensor data through interactive visualizations
4. **Deploy Models to Robots**: Optimize and deploy models to edge devices

## Future Enhancements

- Real-time collaborative annotation
- Active learning for more efficient labeling
- Integration with popular robotics frameworks (ROS, etc.)
- Support for more sensor types and data formats
# Helix-ai-tooling
