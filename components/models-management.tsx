"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpDown,
  Brain,
  Check,
  ChevronDown,
  Cloud,
  Code,
  Download,
  Filter,
  GitBranch,
  Layers,
  Plus,
  Rocket,
  Search,
  Server,
  Settings,
  Share2,
  Tag,
  Trash2,
  Upload,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data for models
const mockModels = [
  {
    id: "model-001",
    name: "Humanoid Locomotion v2.4",
    description: "Advanced bipedal movement model with improved stability on uneven surfaces",
    type: "Transformer",
    status: "Deployed",
    version: "2.4.0",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-28",
    accuracy: 0.92,
    size: "1.2 GB",
    trainedOn: "Humanoid Movement Patterns",
    deployedTo: ["Production", "Testing"],
    tags: ["locomotion", "stability", "transformer"],
  },
  {
    id: "model-002",
    name: "Object Manipulation CNN",
    description: "Convolutional neural network for precise object grasping and manipulation",
    type: "CNN",
    status: "Training",
    version: "1.8.3",
    createdAt: "2024-02-01",
    updatedAt: "2024-03-01",
    accuracy: 0.87,
    size: "845 MB",
    trainedOn: "Object Manipulation Training",
    deployedTo: ["Development"],
    tags: ["manipulation", "grasping", "cnn"],
    trainingProgress: 78,
  },
  {
    id: "model-003",
    name: "Human Interaction BERT",
    description: "BERT-based model for understanding human commands and gestures",
    type: "BERT",
    status: "Ready",
    version: "1.2.1",
    createdAt: "2024-01-20",
    updatedAt: "2024-02-15",
    accuracy: 0.89,
    size: "950 MB",
    trainedOn: "Human-Robot Interaction",
    deployedTo: [],
    tags: ["interaction", "nlp", "bert"],
  },
  {
    id: "model-004",
    name: "Environmental Mapping GNN",
    description: "Graph neural network for spatial awareness and navigation",
    type: "GNN",
    status: "Testing",
    version: "0.9.5",
    createdAt: "2024-02-10",
    updatedAt: "2024-02-25",
    accuracy: 0.83,
    size: "720 MB",
    trainedOn: "Environmental Navigation",
    deployedTo: ["Testing"],
    tags: ["navigation", "mapping", "gnn"],
  },
  {
    id: "model-005",
    name: "Force Feedback RNN",
    description: "Recurrent neural network for tactile feedback and force control",
    type: "RNN",
    status: "Archived",
    version: "1.5.2",
    createdAt: "2023-11-05",
    updatedAt: "2024-01-10",
    accuracy: 0.81,
    size: "680 MB",
    trainedOn: "Object Manipulation Training",
    deployedTo: [],
    tags: ["tactile", "force", "rnn"],
  },
]

export function ModelsManagement() {
  const { toast } = useToast()
  const [models, setModels] = useState(mockModels)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [expandedModel, setExpandedModel] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<"name" | "date" | "accuracy">("date")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const filteredModels = models
    .filter(
      (model) =>
        (searchQuery === "" ||
          model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
        (filterStatus === null || model.status === filterStatus),
    )
    .sort((a, b) => {
      if (sortOrder === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortOrder === "date") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      } else if (sortOrder === "accuracy") {
        return b.accuracy - a.accuracy
      }
      return 0
    })

  const handleCreateModel = () => {
    toast({
      title: "Create model",
      description: "The model creation form would open here",
    })
  }

  const handleImportModel = () => {
    toast({
      title: "Import model",
      description: "The model import dialog would open here",
    })
  }

  const handleDeployModel = (id: string) => {
    const model = models.find((m) => m.id === id)
    toast({
      title: "Deploy model",
      description: `Deployment process started for model ${model?.name}`,
    })
  }

  const handleVersionModel = (id: string) => {
    const model = models.find((m) => m.id === id)
    toast({
      title: "New version",
      description: `Creating new version for model ${model?.name}`,
    })
  }

  const handleDownloadModel = (id: string) => {
    const model = models.find((m) => m.id === id)
    toast({
      title: "Download started",
      description: `Downloading model ${model?.name} (${model?.size})`,
    })
  }

  const handleShareModel = (id: string) => {
    const model = models.find((m) => m.id === id)
    toast({
      title: "Share model",
      description: `Sharing options for model ${model?.name}`,
    })
  }

  const handleConfigureModel = (id: string) => {
    const model = models.find((m) => m.id === id)
    toast({
      title: "Configure model",
      description: `Opening configuration for model ${model?.name}`,
    })
  }

  const handleDeleteModel = (id: string) => {
    const model = models.find((m) => m.id === id)
    toast({
      title: "Delete model",
      description: `Model ${model?.name} has been deleted`,
    })
    setModels(models.filter((model) => model.id !== id))
    if (selectedModel === id) {
      setSelectedModel(null)
    }
    if (expandedModel === id) {
      setExpandedModel(null)
    }
  }

  const handleSort = () => {
    // Cycle through sort options
    if (sortOrder === "date") {
      setSortOrder("name")
      toast({
        title: "Sorted by name",
        description: "Models are now sorted alphabetically",
      })
    } else if (sortOrder === "name") {
      setSortOrder("accuracy")
      toast({
        title: "Sorted by accuracy",
        description: "Models are now sorted by accuracy",
      })
    } else {
      setSortOrder("date")
      toast({
        title: "Sorted by date",
        description: "Models are now sorted by last updated date",
      })
    }
  }

  const handleAddIntegration = () => {
    toast({
      title: "Add integration",
      description: "The integration configuration dialog would open here",
    })
  }

  const handleConnectStorage = () => {
    toast({
      title: "Connect storage",
      description: "The cloud storage connection dialog would open here",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Deployed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Training":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Ready":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "Testing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Handle model expansion with debouncing to prevent ResizeObserver errors
  const handleExpandModel = (modelId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // Prevent rapid toggling
    if (isTransitioning) return

    setIsTransitioning(true)

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    // If closing, collapse immediately
    if (expandedModel === modelId) {
      setExpandedModel(null)
      // Short delay before allowing new transitions
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    } else {
      // If opening, add a small delay
      transitionTimeoutRef.current = setTimeout(() => {
        setExpandedModel(modelId)
        setIsTransitioning(false)
      }, 100)
    }
  }

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search models..."
            className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="h-4 w-4" />
              {filterStatus || "Status"}
              <ChevronDown className="h-4 w-4" />
            </Button>
            {isFilterOpen && (
              <div className="absolute z-10 mt-1 w-40 rounded-md border bg-background shadow-lg">
                <div className="p-1">
                  <button
                    className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-muted"
                    onClick={() => {
                      setFilterStatus(null)
                      setIsFilterOpen(false)
                    }}
                  >
                    All
                  </button>
                  {["Deployed", "Training", "Ready", "Testing", "Archived"].map((status) => (
                    <button
                      key={status}
                      className="w-full rounded-sm px-2 py-1.5 text-sm text-left hover:bg-muted"
                      onClick={() => {
                        setFilterStatus(status)
                        setIsFilterOpen(false)
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button variant="outline" onClick={handleSort}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort: {sortOrder === "date" ? "Date" : sortOrder === "name" ? "Name" : "Accuracy"}
          </Button>
          <Button variant="outline" onClick={handleImportModel}>
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button onClick={handleCreateModel}>
            <Plus className="mr-2 h-4 w-4" />
            New Model
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredModels.map((model) => (
          <Card
            key={model.id}
            className={`overflow-hidden transition-all ${selectedModel === model.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
          >
            <div
              className="flex items-center justify-between p-6 cursor-pointer"
              onClick={() => {
                if (!isTransitioning) {
                  setSelectedModel(model.id === selectedModel ? null : model.id)
                }
              }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{model.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {model.type} • v{model.version}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(model.status)}`}>{model.status}</div>
                <Button variant="ghost" size="icon" onClick={(e) => handleExpandModel(model.id, e)}>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${expandedModel === model.id ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {(selectedModel === model.id || expandedModel === model.id) && (
              <div className="px-6 pb-6 pt-0 overflow-hidden transition-all duration-300 ease-in-out">
                <div className="space-y-4">
                  <div className="text-sm">{model.description}</div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                      <div className="font-medium">{(model.accuracy * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Size</div>
                      <div className="font-medium">{model.size}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Created</div>
                      <div className="font-medium">{new Date(model.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Updated</div>
                      <div className="font-medium">{new Date(model.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {model.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </div>
                    ))}
                  </div>

                  {model.status === "Training" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Training Progress</span>
                        <span>{model.trainingProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${model.trainingProgress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {model.status !== "Archived" && model.status !== "Training" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeployModel(model.id)
                        }}
                      >
                        <Rocket className="mr-2 h-4 w-4" />
                        {model.status === "Deployed" ? "Redeploy" : "Deploy"}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVersionModel(model.id)
                      }}
                    >
                      <GitBranch className="mr-2 h-4 w-4" />
                      New Version
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadModel(model.id)
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleShareModel(model.id)
                      }}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleConfigureModel(model.id)
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteModel(model.id)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>

                  {model.deployedTo && model.deployedTo.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Deployed Environments</div>
                      <div className="flex flex-wrap gap-2">
                        {model.deployedTo.map((env) => (
                          <div
                            key={env}
                            className="flex items-center gap-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full"
                          >
                            <Cloud className="h-3 w-3" />
                            {env}
                            <Check className="h-3 w-3" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}

        {filteredModels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No models found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || filterStatus
                ? "No results match your search criteria"
                : "Try creating a new model or importing one"}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleImportModel}>
                <Upload className="mr-2 h-4 w-4" />
                Import Model
              </Button>
              <Button onClick={handleCreateModel}>
                <Plus className="mr-2 h-4 w-4" />
                Create Model
              </Button>
            </div>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Model Registry</CardTitle>
          <CardDescription>Connect to external model registries and repositories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Model Registry</h4>
                    <p className="text-xs text-muted-foreground">Internal registry</p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Connected
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Code className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">GitHub</h4>
                    <p className="text-xs text-muted-foreground">Model version control</p>
                  </div>
                  <div className="ml-auto">
                    <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Connected
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted/50">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-md bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                    <Cloud className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-medium">Cloud Storage</h4>
                    <p className="text-xs text-muted-foreground">Model artifacts</p>
                  </div>
                  <div className="ml-auto">
                    <Button variant="outline" size="sm" onClick={handleConnectStorage}>
                      Connect
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Button variant="outline" className="w-full" onClick={handleAddIntegration}>
              <Plus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

