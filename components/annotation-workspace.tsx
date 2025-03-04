"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  ArrowRight,
  BarChart2,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Clock,
  Copy,
  Download,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Layers,
  Pause,
  Play,
  Save,
  Search,
  Share2,
  Square,
  Trash2,
  Undo,
  Video,
  X,
  Plus,
  Minus,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Circle, GitBranch } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Update the labels to be more relevant for robot perception
const labels = ["person", "object", "obstacle", "door", "furniture", "robot", "graspable_item", "floor_marking"]

// Update to a robot-perspective video URL - using a first-person robot view video
const sampleVideoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"

// Update the mock annotation sample to reflect robot perception data
const mockAnnotationSample = {
  id: "sample-001",
  dataset: "Indoor Robot Navigation",
  videoUrl: sampleVideoUrl,
  frames: 120,
  duration: "00:04:00",
  annotations: [
    {
      id: "ann-001",
      frame: 15,
      type: "bounding_box",
      label: "person",
      coordinates: { x: 120, y: 150, width: 80, height: 160 },
    },
    {
      id: "ann-002",
      frame: 15,
      type: "bounding_box",
      label: "door",
      coordinates: { x: 320, y: 100, width: 100, height: 200 },
    },
    {
      id: "ann-003",
      frame: 15,
      type: "bounding_box",
      label: "obstacle",
      coordinates: { x: 220, y: 200, width: 60, height: 40 },
    },
    {
      id: "ann-004",
      frame: 30,
      type: "bounding_box",
      label: "graspable_item",
      coordinates: { x: 130, y: 160, width: 50, height: 30 },
    },
  ],
}

// Update the mock task to be more relevant for robot perception
const currentTask = {
  id: "task-001",
  name: "Indoor Environment Perception",
  description: "Label people, objects, and navigational elements from robot's perspective",
  dataset: "Indoor Navigation Dataset",
  progress: 65,
  priority: "High",
  deadline: "2024-03-15",
  assignedTo: "user123",
  type: "Bounding Box",
  totalFrames: 450,
  completedFrames: 293,
}

export default function AnnotationWorkspace() {
  const { toast } = useToast()
  const [currentFrame, setCurrentFrame] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTool, setSelectedTool] = useState<"box" | "polygon" | "point" | "skeleton">("box")
  const [annotations, setAnnotations] = useState(mockAnnotationSample.annotations)
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [filterLabel, setFilterLabel] = useState<string | null>(null)
  const [searchAnnotation, setSearchAnnotation] = useState("")
  const [showStatistics, setShowStatistics] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
  const [endPoint, setEndPoint] = useState({ x: 0, y: 0 })
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showGrid, setShowGrid] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalFrames, setTotalFrames] = useState(mockAnnotationSample.frames)

  const [selectedLabel, setSelectedLabel] = useState(labels[0])

  // Statistics
  const annotationStats = {
    totalFrames: totalFrames,
    annotatedFrames: 42,
    totalAnnotations: annotations.length,
    annotationsPerFrame: (annotations.length / 42).toFixed(1),
    completionRate: ((42 / totalFrames) * 100).toFixed(1),
    timeSpent: "3h 24m",
    averageTimePerFrame: "4.8m",
  }

  // Initialize video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setVideoDuration(video.duration)
      // Estimate total frames based on 30fps
      const estimatedFrames = Math.floor(video.duration * 30)
      setTotalFrames(estimatedFrames)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      // Calculate current frame based on 30fps
      const frame = Math.floor(video.currentTime * 30) + 1
      setCurrentFrame(frame)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("timeupdate", handleTimeUpdate)

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("timeupdate", handleTimeUpdate)
    }
  }, [])

  // Handle frame navigation
  const goToNextFrame = () => {
    const video = videoRef.current
    if (!video) return

    if (currentFrame < totalFrames) {
      // Move forward 1/30th of a second (assuming 30fps)
      video.currentTime += 1 / 30
    }
  }

  const goToPrevFrame = () => {
    const video = videoRef.current
    if (!video) return

    if (currentFrame > 1) {
      // Move backward 1/30th of a second (assuming 30fps)
      video.currentTime -= 1 / 30
    }
  }

  // Handle play/pause
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.playbackRate = playbackSpeed
      video.play().catch((error) => {
        console.error("Error playing video:", error)
        setIsPlaying(false)
      })
    } else {
      video.pause()
    }
  }, [isPlaying, playbackSpeed])

  // Draw annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Make sure canvas dimensions match video
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480

    // Apply zoom
    ctx.save()
    ctx.scale(zoomLevel, zoomLevel)

    // Draw grid if enabled
    if (showGrid) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"
      ctx.lineWidth = 0.5

      // Draw vertical lines
      for (let x = 0; x < canvas.width / zoomLevel; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height / zoomLevel)
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y < canvas.height / zoomLevel; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width / zoomLevel, y)
        ctx.stroke()
      }
    }

    // Draw existing annotations for current frame
    annotations
      .filter(
        (ann) =>
          ann.frame === currentFrame &&
          (!filterLabel || ann.label === filterLabel) &&
          (!searchAnnotation || ann.id.includes(searchAnnotation) || ann.label.includes(searchAnnotation)),
      )
      .forEach((ann) => {
        const { x, y, width, height } = ann.coordinates

        ctx.strokeStyle = selectedAnnotation === ann.id ? "#ff3e00" : getColorForLabel(ann.label)
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, width, height)

        // Draw label
        ctx.fillStyle = selectedAnnotation === ann.id ? "#ff3e00" : getColorForLabel(ann.label)
        ctx.fillRect(x, y - 20, 80, 20)
        ctx.fillStyle = "white"
        ctx.font = "12px sans-serif"
        ctx.fillText(ann.label, x + 5, y - 5)
      })

    // Draw current annotation being created
    if (isDrawing) {
      const width = endPoint.x - startPoint.x
      const height = endPoint.y - startPoint.y

      ctx.strokeStyle = getColorForLabel(selectedLabel)
      ctx.lineWidth = 2
      ctx.strokeRect(startPoint.x, startPoint.y, width, height)
    }

    ctx.restore()
  }, [
    currentFrame,
    annotations,
    selectedAnnotation,
    isDrawing,
    startPoint,
    endPoint,
    filterLabel,
    searchAnnotation,
    zoomLevel,
    showGrid,
    selectedLabel,
  ])

  // Update the getColorForLabel function to use appropriate colors for the new labels
  const getColorForLabel = (label: string) => {
    switch (label) {
      case "person":
        return "#ef4444" // red
      case "object":
        return "#3b82f6" // blue
      case "obstacle":
        return "#f59e0b" // amber
      case "door":
        return "#8b5cf6" // purple
      case "furniture":
        return "#6366f1" // indigo
      case "robot":
        return "#10b981" // green
      case "graspable_item":
        return "#ec4899" // pink
      case "floor_marking":
        return "#6b7280" // gray
      default:
        return "#6b7280" // gray
    }
  }

  // Handle canvas mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "box") return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel
    const y = (e.clientY - rect.top) / zoomLevel

    setIsDrawing(true)
    setStartPoint({ x, y })
    setEndPoint({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel
    const y = (e.clientY - rect.top) / zoomLevel

    setEndPoint({ x, y })
  }

  const handleMouseUp = () => {
    if (!isDrawing) return

    setIsDrawing(false)

    // Create new annotation
    const width = endPoint.x - startPoint.x
    const height = endPoint.y - startPoint.y

    // Only add if the box has some size
    if (Math.abs(width) > 10 && Math.abs(height) > 10) {
      const newAnnotation = {
        id: `ann-${Date.now()}`,
        frame: currentFrame,
        type: "bounding_box",
        label: selectedLabel,
        coordinates: {
          x: Math.min(startPoint.x, endPoint.x),
          y: Math.min(startPoint.y, endPoint.y),
          width: Math.abs(width),
          height: Math.abs(height),
        },
      }

      setAnnotations([...annotations, newAnnotation])
      toast({
        title: "Annotation added",
        description: `Added ${selectedLabel} bounding box to frame ${currentFrame}`,
      })
    }
  }

  const handleDeleteAnnotation = () => {
    if (!selectedAnnotation) return

    setAnnotations(annotations.filter((ann) => ann.id !== selectedAnnotation))
    setSelectedAnnotation(null)
    toast({
      title: "Annotation deleted",
      description: "The selected annotation has been removed",
    })
  }

  const handleSaveAnnotations = () => {
    // In a real app, this would save to a database
    toast({
      title: "Annotations saved",
      description: `Saved ${annotations.length} annotations for this sample`,
    })
  }

  const handleCompleteTask = () => {
    toast({
      title: "Task completed",
      description: "This annotation task has been marked as complete",
    })
  }

  const handleExportAnnotations = () => {
    toast({
      title: "Annotations exported",
      description: "Annotations have been exported in COCO format",
    })
  }

  const handleShareAnnotations = () => {
    toast({
      title: "Share link created",
      description: "A shareable link has been copied to your clipboard",
    })
  }

  const handleSeekVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const seekTime = Number.parseFloat(e.target.value)
    video.currentTime = seekTime
  }

  const handleJumpToFrame = (frameNumber: number) => {
    const video = videoRef.current
    if (!video) return

    // Convert frame to time (assuming 30fps)
    const seekTime = (frameNumber - 1) / 30
    video.currentTime = seekTime
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const filteredAnnotations = annotations.filter(
    (ann) =>
      ann.frame === currentFrame &&
      (!filterLabel || ann.label === filterLabel) &&
      (!searchAnnotation || ann.id.includes(searchAnnotation) || ann.label.includes(searchAnnotation)),
  )

  return (
    <div className="space-y-4">
      {/* Header with task info and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{currentTask.name}</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowInfo(!showInfo)}>
              <Info className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">{currentTask.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowStatistics(!showStatistics)}>
            <BarChart2 className="mr-2 h-4 w-4" />
            Statistics
          </Button>
          <Button variant="outline" onClick={handleSaveAnnotations}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={handleExportAnnotations}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleShareAnnotations}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button onClick={handleCompleteTask}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Task
          </Button>
        </div>
      </div>

      {/* Task info panel (collapsible) */}
      {showInfo && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Task Information</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowInfo(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Task Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Task ID:</span>
                    <span>{currentTask.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dataset:</span>
                    <span>{currentTask.dataset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{currentTask.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority:</span>
                    <span>{currentTask.priority}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span>{new Date(currentTask.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Annotation Guidelines</h3>
                <div className="text-sm space-y-2">
                  <p>• Label all people with tight bounding boxes</p>
                  <p>• Mark obstacles that could impede robot movement</p>
                  <p>• Identify doors and their state (open/closed)</p>
                  <p>• Label furniture and fixed objects</p>
                  <p>• Annotate graspable items the robot could interact with</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics panel (collapsible) */}
      {showStatistics && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Annotation Statistics</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowStatistics(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Completion Rate</div>
                <div className="text-2xl font-bold">{annotationStats.completionRate}%</div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${annotationStats.completionRate}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Annotated Frames</div>
                <div className="text-2xl font-bold">
                  {annotationStats.annotatedFrames} / {annotationStats.totalFrames}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Total Annotations</div>
                <div className="text-2xl font-bold">{annotationStats.totalAnnotations}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Avg. Annotations/Frame</div>
                <div className="text-2xl font-bold">{annotationStats.annotationsPerFrame}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Annotation Distribution</h3>
                <div className="h-32 flex items-end gap-1">
                  {labels.map((label) => {
                    const count = annotations.filter((ann) => ann.label === label).length
                    const percentage = annotations.length > 0 ? (count / annotations.length) * 100 : 0
                    return (
                      <div key={label} className="flex flex-col items-center flex-1">
                        <div
                          className="w-full rounded-t"
                          style={{
                            height: `${Math.max(percentage, 5)}%`,
                            backgroundColor: getColorForLabel(label),
                          }}
                        ></div>
                        <span className="text-xs mt-1 truncate w-full text-center">{label.replace("_", " ")}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Time Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Time Spent:</span>
                    <span>{annotationStats.timeSpent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Time per Frame:</span>
                    <span>{annotationStats.averageTimePerFrame}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Completion:</span>
                    <span>2h 15m remaining</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annotation Speed:</span>
                    <span>15 annotations/hour</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          {/* Main annotation canvas */}
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Annotation Workspace</CardTitle>
                <CardDescription>
                  Frame {currentFrame} of {totalFrames} • {filteredAnnotations.length} annotations
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
                  {showGrid ? "Hide Grid" : "Show Grid"}
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
                    disabled={zoomLevel <= 0.5}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
                    disabled={zoomLevel >= 2}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="relative">
                {/* Video element */}
                <video
                  ref={videoRef}
                  src={sampleVideoUrl}
                  className="w-full h-auto"
                  crossOrigin="anonymous"
                  muted
                  playsInline
                  style={{ display: "block" }}
                />

                {/* Canvas overlay for annotations */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-0 left-0 w-full h-full annotation-canvas"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleJumpToFrame(1)}
                    disabled={currentFrame === 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToPrevFrame} disabled={currentFrame === 1}>
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextFrame} disabled={currentFrame === totalFrames}>
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleJumpToFrame(totalFrames)}
                    disabled={currentFrame === totalFrames}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <select
                    className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(videoDuration)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={videoDuration || 100}
                    step={0.01}
                    value={currentTime}
                    onChange={handleSeekVideo}
                    className="timeline-scrubber w-40 h-2 bg-muted rounded-full appearance-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Annotations list */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Annotations</CardTitle>
                  <CardDescription>{filteredAnnotations.length} annotations in current frame</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search annotations..."
                      className="pl-8 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                      value={searchAnnotation}
                      onChange={(e) => setSearchAnnotation(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setFilterLabel(filterLabel ? null : labels[0])}
                    >
                      <Filter className="h-4 w-4" />
                      {filterLabel || "All Labels"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                    {filterLabel && (
                      <div className="absolute z-10 mt-1 w-40 rounded-md border bg-background shadow-lg">
                        <div className="p-1">
                          <button
                            className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-muted"
                            onClick={() => setFilterLabel(null)}
                          >
                            All Labels
                          </button>
                          {labels.map((label) => (
                            <button
                              key={label}
                              className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-muted"
                              onClick={() => setFilterLabel(label)}
                            >
                              {label.replace("_", " ")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {filteredAnnotations.length > 0 ? (
                  filteredAnnotations.map((ann) => (
                    <div
                      key={ann.id}
                      className={`flex items-center justify-between p-2 rounded-md ${
                        selectedAnnotation === ann.id ? "bg-primary/10" : "hover:bg-muted"
                      }`}
                      onClick={() => setSelectedAnnotation(ann.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: getColorForLabel(ann.label) }}
                        />
                        <span>{ann.label.replace("_", " ")}</span>
                        <span className="text-xs text-muted-foreground">#{ann.id.split("-")[1]}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {ann.coordinates.width.toFixed(0)}×{ann.coordinates.height.toFixed(0)}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              toast({
                                title: "Annotation copied",
                                description: "The annotation has been copied to clipboard",
                              })
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteAnnotation()
                            }}
                            disabled={selectedAnnotation !== ann.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Layers className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>No annotations in this frame</p>
                    <p className="text-sm">Use the annotation tools to add bounding boxes</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm" onClick={handleDeleteAnnotation} disabled={!selectedAnnotation}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Annotations copied",
                      description: "All annotations in this frame have been copied",
                    })
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy All
                </Button>
              </div>
            </CardFooter>
          </Card>
          {/* Annotation tools */}
          <Card>
            <CardHeader>
              <CardTitle>Annotation Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="font-medium">Tool</div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedTool === "box" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("box")}
                      className="flex-1"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Box
                    </Button>
                    <Button
                      variant={selectedTool === "polygon" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("polygon")}
                      className="flex-1"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polygon points="3,21 9,3 15,21 21,9" />
                      </svg>
                      Polygon
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedTool === "point" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("point")}
                      className="flex-1"
                    >
                      <Circle className="mr-2 h-4 w-4" />
                      Point
                    </Button>
                    <Button
                      variant={selectedTool === "skeleton" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTool("skeleton")}
                      className="flex-1"
                    >
                      <GitBranch className="mr-2 h-4 w-4" />
                      Skeleton
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Label</div>
                  <div className="relative">
                    <Select value={selectedLabel} onValueChange={setSelectedLabel}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                      <SelectContent>
                        {labels.map((label) => (
                          <SelectItem key={label} value={label}>
                            <div className="flex items-center">
                              <div
                                className="h-3 w-3 rounded-full mr-2"
                                style={{
                                  backgroundColor: getColorForLabel(label),
                                }}
                              ></div>
                              {label.replace("_", " ")}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {labels.map((label) => (
                      <Badge
                        key={label}
                        variant={selectedLabel === label ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedLabel(label)}
                        style={{
                          backgroundColor: selectedLabel === label ? getColorForLabel(label) : undefined,
                          borderColor: getColorForLabel(label),
                        }}
                      >
                        {label.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Actions</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled={!selectedAnnotation}>
                      <Undo className="mr-2 h-4 w-4" />
                      Undo
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDeleteAnnotation} disabled={!selectedAnnotation}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Frame cleared",
                          description: "All annotations in this frame have been removed",
                        })
                        setAnnotations(annotations.filter((ann) => ann.frame !== currentFrame))
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear Frame
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Interpolation started",
                          description: "Annotations will be interpolated between keyframes",
                        })
                      }}
                    >
                      <Layers className="mr-2 h-4 w-4" />
                      Interpolate
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{currentTask.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${currentTask.progress}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Details</div>
                  <div className="text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{currentTask.type}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Priority:</span>
                      <span>{currentTask.priority}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{new Date(currentTask.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Frames:</span>
                      <span>
                        {currentTask.completedFrames} / {currentTask.totalFrames}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Time Tracking</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <span className="font-medium">3h 24m</span>
                      <span className="text-muted-foreground ml-2">spent on this task</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help & Documentation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Help & Resources</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowHelp(!showHelp)}>
                  {showHelp ? <ChevronDown className="h-4 w-4 rotate-180" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            {showHelp && (
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Annotation Guidelines</h4>
                      <p className="text-muted-foreground">Detailed instructions for consistent annotations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Tutorial Videos</h4>
                      <p className="text-muted-foreground">Step-by-step video guides for annotation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Label Definitions</h4>
                      <p className="text-muted-foreground">Detailed descriptions of each label</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">FAQ</h4>
                      <p className="text-muted-foreground">Common questions and answers</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      toast({
                        title: "Help center opened",
                        description: "Opening the comprehensive help documentation",
                      })
                    }}
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Open Help Center
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

