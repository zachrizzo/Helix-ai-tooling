"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUpDown,
  BarChart,
  Clock,
  Download,
  Filter,
  FlaskConical,
  Pause,
  Play,
  Plus,
  Search,
  StopCircle,
} from "lucide-react"
import { mockExperiments } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function ExperimentTracker() {
  const { toast } = useToast()
  const [experiments, setExperiments] = useState(mockExperiments)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(null)

  const filteredExperiments = experiments.filter(
    (experiment) =>
      experiment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.dataset.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateExperiment = () => {
    toast({
      title: "Create experiment",
      description: "The experiment creation form would open here",
    })
  }

  const handleExperimentAction = (id: string, action: "start" | "pause" | "stop") => {
    const actionMap = {
      start: "Running",
      pause: "Paused",
      stop: "Completed",
    }

    setExperiments(experiments.map((exp) => (exp.id === id ? { ...exp, status: actionMap[action] } : exp)))

    toast({
      title: `Experiment ${action}ed`,
      description: `The experiment has been ${action}ed successfully`,
    })
  }

  const handleDownloadResults = (id: string) => {
    toast({
      title: "Download started",
      description: `Downloading results for experiment ${experiments.find((e) => e.id === id)?.name}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search experiments..."
            className="pl-8 h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Sort
          </Button>
          <Button onClick={handleCreateExperiment}>
            <Plus className="mr-2 h-4 w-4" />
            New Experiment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredExperiments.map((experiment) => (
          <Card
            key={experiment.id}
            className={`overflow-hidden cursor-pointer transition-all ${selectedExperiment === experiment.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
            onClick={() => setSelectedExperiment(experiment.id === selectedExperiment ? null : experiment.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{experiment.name}</CardTitle>
                <div
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    experiment.status === "Running"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                      : experiment.status === "Completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : experiment.status === "Paused"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
                  )}
                >
                  {experiment.status}
                </div>
              </div>
              <CardDescription>{experiment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <FlaskConical className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Dataset: {experiment.dataset}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Started: {new Date(experiment.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{experiment.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full",
                        experiment.status === "Running"
                          ? "bg-blue-500"
                          : experiment.status === "Completed"
                            ? "bg-green-500"
                            : experiment.status === "Paused"
                              ? "bg-yellow-500"
                              : "bg-gray-500",
                      )}
                      style={{ width: `${experiment.progress}%` }}
                    />
                  </div>
                </div>

                {experiment.metrics && (
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                    {Object.entries(experiment.metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold">{(value * 100).toFixed(0)}%</div>
                        <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedExperiment === experiment.id && (
                  <div className="pt-2 flex justify-between border-t">
                    <div className="flex gap-2">
                      {experiment.status !== "Running" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExperimentAction(experiment.id, "start")
                          }}
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Start
                        </Button>
                      )}
                      {experiment.status === "Running" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExperimentAction(experiment.id, "pause")
                          }}
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                      )}
                      {experiment.status !== "Completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExperimentAction(experiment.id, "stop")
                          }}
                        >
                          <StopCircle className="mr-2 h-4 w-4" />
                          Stop
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          toast({
                            title: "View metrics",
                            description: "Opening detailed metrics view",
                          })
                        }}
                      >
                        <BarChart className="mr-2 h-4 w-4" />
                        Metrics
                      </Button>
                      {experiment.status === "Completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDownloadResults(experiment.id)
                          }}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Results
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredExperiments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FlaskConical className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No experiments found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : "Try creating a new experiment"}
            </p>
            <Button onClick={handleCreateExperiment}>
              <Plus className="mr-2 h-4 w-4" />
              Create Experiment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

