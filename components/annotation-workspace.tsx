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
  Circle,
  GitBranch,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Update the labels to be more relevant for self-driving car perception
const labels = ["vehicle", "pedestrian", "cyclist", "traffic_sign", "traffic_light", "road_marking", "lane", "obstacle", "construction"]

// Update to a Tesla-like driving perspective video URL
const sampleVideoUrl = "https://joy1.videvo.net/videvo_files/video/free/2019-09/large_watermarked/190828_06_Cabo_Driving_4k_013_preview.mp4"

// Update the mock annotation sample to reflect self-driving car perception data
const mockAnnotationSample = {
  id: "sample-001",
  dataset: "Urban Driving Scenarios",
  videoUrl: sampleVideoUrl,
  frames: 120,
  duration: "00:04:00",
  annotations: [
    {
      id: "ann-001",
      frame: 15,
      type: "bounding_box",
      label: "vehicle",
      coordinates: { x: 120, y: 150, width: 80, height: 160 },
    },
    {
      id: "ann-002",
      frame: 15,
      type: "bounding_box",
      label: "pedestrian",
      coordinates: { x: 320, y: 150, width: 60, height: 120 },
    },
    {
      id: "ann-003",
      frame: 15,
      type: "bounding_box",
      label: "traffic_sign",
      coordinates: { x: 220, y: 100, width: 40, height: 40 },
    },
    {
      id: "ann-004",
      frame: 30,
      type: "bounding_box",
      label: "vehicle",
      coordinates: { x: 130, y: 160, width: 80, height: 160 },
    },
  ],
}

// Update the mock task to be more relevant for self-driving car perception
const currentTask = {
  id: "task-001",
  name: "Urban Traffic Scene Annotation",
  description: "Label vehicles, pedestrians, and road elements from self-driving car perspective",
  dataset: "Urban Driving Scenarios",
  progress: 65,
  priority: "High",
  deadline: "2024-03-15",
  assignedTo: "user123",
  type: "Bounding Box",
  totalFrames: 450,
  completedFrames: 293,
}

// Use YouTube video ID for Tesla autopilot driving
const teslaYoutubeVideoId = "tlThdr3O5Qo" // Tesla FSD Beta 10 driving video

// Define YouTube Player type
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            disablekb?: number;
            enablejsapi?: number;
            fs?: number;
            modestbranding?: number;
            playsinline?: number;
            rel?: number;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
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
  const [newAnnotation, setNewAnnotation] = useState<{
    x: number
    y: number
    width: number
    height: number
    label: string
  } | null>(null)
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

  // Add state to track video loading status
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // YouTube player instance
  const [ytPlayer, setYtPlayer] = useState<any>(null)
  const [ytPlayerReady, setYtPlayerReady] = useState(false)

  // Initialize YouTube API
  useEffect(() => {
    // Add CSS for YouTube player
    const style = document.createElement('style')
    style.setAttribute('data-youtube-player-style', 'true')
    style.textContent = `
      #youtube-player {
        width: 100%;
        height: 100%;
        min-height: 360px;
      }
      #youtube-player iframe {
        width: 100%;
        height: 100%;
      }
    `
    document.head.appendChild(style)

    // Function to initialize YouTube player
    const initYouTubePlayer = () => {
      if (typeof window.YT === 'undefined' || !document.getElementById('youtube-player')) {
        // If YouTube API or player element isn't ready yet, try again in 100ms
        setTimeout(initYouTubePlayer, 100);
        return;
      }

      try {
        const player = new window.YT.Player('youtube-player', {
          videoId: teslaYoutubeVideoId,
          playerVars: {
            autoplay: 0,
            controls: 1, // Show YouTube controls as fallback
            disablekb: 0, // Enable keyboard controls
            enablejsapi: 1, // Enable JavaScript API
            modestbranding: 1,
            playsinline: 1,
            rel: 0, // Don't show related videos
          },
          events: {
            onReady: (event) => {
              console.log('YouTube player ready')
              setYtPlayer(event.target)
              setYtPlayerReady(true)
              setVideoDuration(event.target.getDuration())
              setTotalFrames(Math.floor(event.target.getDuration() * 30)) // Assuming 30fps
              setVideoLoaded(true)
            },
            onStateChange: (event) => {
              setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
            },
            onError: (event) => {
              console.error('YouTube player error:', event)
              setVideoError(true)
            }
          }
        });
      } catch (error) {
        console.error('Error initializing YouTube player:', error);
      }
    };

    // Load YouTube API
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      // Initialize player when API is ready
      window.onYouTubeIframeAPIReady = initYouTubePlayer;
    } else {
      // If API is already loaded, initialize player directly
      initYouTubePlayer();
    }

    return () => {
      // Cleanup
      if (ytPlayer && ytPlayerReady) {
        try {
          ytPlayer.destroy()
        } catch (error) {
          console.error('Error destroying YouTube player:', error)
        }
      }

      // Remove style element
      const styleElement = document.querySelector('style[data-youtube-player-style]')
      if (styleElement) {
        styleElement.remove()
      }
    }
  }, [])

  // Update video time periodically when playing
  useEffect(() => {
    if (!ytPlayer || !ytPlayerReady || !isPlaying) return

    const interval = setInterval(() => {
      try {
        const currentTime = ytPlayer.getCurrentTime()
        setCurrentTime(currentTime)
        setCurrentFrame(Math.floor(currentTime * 30) + 1) // Assuming 30fps
      } catch (error) {
        console.error('Error getting current time:', error)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [ytPlayer, ytPlayerReady, isPlaying])

  // Handle playback speed changes
  useEffect(() => {
    if (!ytPlayer || !ytPlayerReady) return

    try {
      ytPlayer.setPlaybackRate(playbackSpeed)
    } catch (error) {
      console.error('Error setting playback rate:', error)
    }
  }, [ytPlayer, ytPlayerReady, playbackSpeed])

  // Video control functions
  const handlePlayPause = () => {
    if (!ytPlayer || !ytPlayerReady) return

    try {
      if (isPlaying) {
        ytPlayer.pauseVideo()
      } else {
        ytPlayer.playVideo()
      }
      setIsPlaying(!isPlaying) // Update state immediately for better UI responsiveness
    } catch (error) {
      console.error('Error playing/pausing video:', error)
    }
  }

  const handleSeekVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!ytPlayer || !ytPlayerReady) return

    try {
      const seekTime = parseFloat(e.target.value)
      ytPlayer.seekTo(seekTime, true)
      setCurrentTime(seekTime)
      setCurrentFrame(Math.floor(seekTime * 30) + 1)
    } catch (error) {
      console.error('Error seeking video:', error)
    }
  }

  const handleJumpToFrame = (frameNumber: number) => {
    if (!ytPlayer || !ytPlayerReady) return

    try {
      if (frameNumber >= 1 && frameNumber <= totalFrames) {
        const seekTime = (frameNumber - 1) / 30
        ytPlayer.seekTo(seekTime, true)
        setCurrentTime(seekTime)
        setCurrentFrame(frameNumber)
      }
    } catch (error) {
      console.error('Error jumping to frame:', error)
    }
  }

  const goToNextFrame = () => {
    if (!ytPlayer || !ytPlayerReady) return

    try {
      if (currentFrame < totalFrames) {
        const seekTime = currentTime + (1 / 30)
        ytPlayer.seekTo(seekTime, true)
        setCurrentTime(seekTime)
        setCurrentFrame(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error going to next frame:', error)
    }
  }

  const goToPrevFrame = () => {
    if (!ytPlayer || !ytPlayerReady) return

    try {
      if (currentFrame > 1) {
        const seekTime = currentTime - (1 / 30)
        ytPlayer.seekTo(seekTime, true)
        setCurrentTime(seekTime)
        setCurrentFrame(prev => prev - 1)
      }
    } catch (error) {
      console.error('Error going to previous frame:', error)
    }
  }

  // Render annotations on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get iframe dimensions
    const iframe = ytPlayer?.getIframe()
    const iframeWidth = iframe ? iframe.clientWidth : 640
    const iframeHeight = iframe ? iframe.clientHeight : 360

    // Make sure canvas dimensions match iframe
    canvas.width = iframeWidth
    canvas.height = iframeHeight

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
    const currentFrameAnnotations = annotations.filter(
      (ann) =>
        ann.frame === currentFrame &&
        (!filterLabel || ann.label === filterLabel) &&
        (!searchAnnotation || ann.id.includes(searchAnnotation) || ann.label.includes(searchAnnotation)),
    )
    currentFrameAnnotations.forEach((ann) => {
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
    if (isDrawing && newAnnotation) {
      ctx.strokeStyle = getColorForLabel(selectedLabel)
      ctx.lineWidth = 2
      ctx.strokeRect(
        newAnnotation.x,
        newAnnotation.y,
        newAnnotation.width,
        newAnnotation.height
      )
    }

    ctx.restore()
  }, [
    currentFrame,
    annotations,
    selectedAnnotation,
    isDrawing,
    newAnnotation,
    filterLabel,
    searchAnnotation,
    zoomLevel,
    showGrid,
    selectedLabel,
    ytPlayer,
    ytPlayerReady,
  ])

  // Update the getColorForLabel function to use appropriate colors for the new labels
  const getColorForLabel = (label: string) => {
    switch (label) {
      case "vehicle":
        return "#ef4444" // red
      case "pedestrian":
        return "#3b82f6" // blue
      case "cyclist":
        return "#f59e0b" // amber
      case "traffic_sign":
        return "#8b5cf6" // purple
      case "traffic_light":
        return "#6366f1" // indigo
      case "road_marking":
        return "#10b981" // green
      case "lane":
        return "#ec4899" // pink
      case "obstacle":
        return "#6b7280" // gray
      case "construction":
        return "#6b7280" // gray
      default:
        return "#6b7280" // gray
    }
  }

  // Mouse event handlers for drawing annotations
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel
    const y = (e.clientY - rect.top) / zoomLevel

    setIsDrawing(true)
    setNewAnnotation({
      x,
      y,
      width: 0,
      height: 0,
      label: selectedLabel
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !newAnnotation) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoomLevel
    const y = (e.clientY - rect.top) / zoomLevel

    setNewAnnotation({
      ...newAnnotation,
      width: x - newAnnotation.x,
      height: y - newAnnotation.y,
      label: selectedLabel
    })
  }

  const handleMouseUp = () => {
    if (isDrawing && newAnnotation) {
      // Only add annotation if it has positive width and height
      if (newAnnotation.width > 10 && newAnnotation.height > 10) {
        const newAnnotationObj = {
          id: `ann-${Date.now()}`,
          frame: currentFrame,
          type: "bounding_box",
          label: selectedLabel,
          coordinates: {
            x: newAnnotation.x,
            y: newAnnotation.y,
            width: Math.abs(newAnnotation.width),
            height: Math.abs(newAnnotation.height),
          },
        }

        setAnnotations([...annotations, newAnnotationObj])

        toast({
          title: "Annotation added",
          description: `Added ${selectedLabel} bounding box to frame ${currentFrame}`,
        })
      }
    }

    setIsDrawing(false)
    setNewAnnotation(null)
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
                {/* YouTube video embed */}
                <div className="aspect-video w-full relative">
                  <div id="youtube-player" className="w-full h-full"></div>

                  {/* Loading indicator */}
                  {!ytPlayerReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading Tesla driving footage...</p>
                      </div>
                    </div>
                  )}

                  {/* Error message */}
                  {videoError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <div className="bg-background p-4 rounded-md shadow-lg text-center max-w-md">
                        <h3 className="font-bold text-lg mb-2">Video Failed to Load</h3>
                        <p className="text-muted-foreground mb-4">
                          The Tesla driving footage could not be loaded. This might be due to network issues or the video source being unavailable.
                        </p>
                        <Button onClick={() => window.location.reload()}>
                          Reload Page
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Canvas overlay for annotations */}
                  <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full pointer-events-auto z-10"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                      backgroundColor: 'transparent',
                      touchAction: 'none'
                    }}
                  />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleJumpToFrame(1)}
                    disabled={currentFrame === 1 || !ytPlayerReady}
                    className="hover:bg-primary/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToPrevFrame}
                    disabled={currentFrame === 1 || !ytPlayerReady}
                    className="hover:bg-primary/20"
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePlayPause}
                    disabled={!ytPlayerReady}
                    className="hover:bg-primary/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={goToNextFrame}
                    disabled={currentFrame === totalFrames || !ytPlayerReady}
                    className="hover:bg-primary/20"
                  >
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleJumpToFrame(totalFrames)}
                    disabled={currentFrame === totalFrames || !ytPlayerReady}
                    className="hover:bg-primary/20"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 mx-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{formatTime(currentTime)}</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={videoDuration}
                        step="0.1"
                        value={currentTime}
                        onChange={handleSeekVideo}
                        className="w-full h-2 rounded-full appearance-none bg-muted cursor-pointer"
                        disabled={!ytPlayerReady}
                      />
                    </div>
                    <span className="text-xs">{formatTime(videoDuration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={playbackSpeed.toString()}
                    onValueChange={(value) => setPlaybackSpeed(parseFloat(value))}
                    disabled={!ytPlayerReady}
                  >
                    <SelectTrigger className="w-[80px] h-8">
                      <SelectValue placeholder="Speed" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.25">0.25x</SelectItem>
                      <SelectItem value="0.5">0.5x</SelectItem>
                      <SelectItem value="1">1x</SelectItem>
                      <SelectItem value="1.5">1.5x</SelectItem>
                      <SelectItem value="2">2x</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-1">
                    <span className="text-xs">Frame:</span>
                    <input
                      type="number"
                      min="1"
                      max={totalFrames}
                      value={currentFrame}
                      onChange={(e) => handleJumpToFrame(parseInt(e.target.value))}
                      className="w-16 h-8 px-2 text-xs rounded-md border border-input bg-background"
                      disabled={!ytPlayerReady}
                    />
                    <span className="text-xs">/ {totalFrames}</span>
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
                      className={`flex items-center justify-between p-2 rounded-md ${selectedAnnotation === ann.id ? "bg-primary/10" : "hover:bg-muted"
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
        </div>
      </div>
    </div>
  )
}


