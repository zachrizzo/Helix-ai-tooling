"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  Download,
  Filter,
  LineChart,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Zap,
  Brain,
  Database,
  FlaskConical,
} from "lucide-react"
import { mockDatasets, mockExperiments, mockPerformanceMetrics } from "@/lib/utils"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d")

  // Calculate summary metrics
  const latestAccuracy =
    mockPerformanceMetrics?.modelAccuracy && mockPerformanceMetrics.modelAccuracy.length > 0
      ? mockPerformanceMetrics.modelAccuracy[mockPerformanceMetrics.modelAccuracy.length - 1].value
      : 0
  const previousAccuracy =
    mockPerformanceMetrics?.modelAccuracy && mockPerformanceMetrics.modelAccuracy.length > 1
      ? mockPerformanceMetrics.modelAccuracy[mockPerformanceMetrics.modelAccuracy.length - 2].value
      : 0
  const accuracyChange = latestAccuracy - previousAccuracy
  const accuracyChangePercent = previousAccuracy ? (accuracyChange / previousAccuracy) * 100 : 0

  const latestTrainingTime =
    mockPerformanceMetrics?.trainingTime && mockPerformanceMetrics.trainingTime.length > 0
      ? mockPerformanceMetrics.trainingTime[mockPerformanceMetrics.trainingTime.length - 1].value
      : 0
  const previousTrainingTime =
    mockPerformanceMetrics?.trainingTime && mockPerformanceMetrics.trainingTime.length > 1
      ? mockPerformanceMetrics.trainingTime[mockPerformanceMetrics.trainingTime.length - 2].value
      : 0
  const trainingTimeChange = previousTrainingTime - latestTrainingTime
  const trainingTimeChangePercent = previousTrainingTime ? (trainingTimeChange / previousTrainingTime) * 100 : 0

  const latestInferenceSpeed =
    mockPerformanceMetrics?.inferenceSpeed && mockPerformanceMetrics.inferenceSpeed.length > 0
      ? mockPerformanceMetrics.inferenceSpeed[mockPerformanceMetrics.inferenceSpeed.length - 1].value
      : 0
  const previousInferenceSpeed =
    mockPerformanceMetrics?.inferenceSpeed && mockPerformanceMetrics.inferenceSpeed.length > 1
      ? mockPerformanceMetrics.inferenceSpeed[mockPerformanceMetrics.inferenceSpeed.length - 2].value
      : 0
  const inferenceSpeedChange = previousInferenceSpeed - latestInferenceSpeed
  const inferenceSpeedChangePercent = previousInferenceSpeed ? (inferenceSpeedChange / previousInferenceSpeed) * 100 : 0

  // Calculate experiment success rate
  const completedExperiments = mockExperiments.filter((exp) => exp.status === "Completed").length
  const totalExperiments = mockExperiments.length
  const successRate = (completedExperiments / totalExperiments) * 100

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button
              variant={timeRange === "7d" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setTimeRange("7d")}
            >
              7D
            </Button>
            <Button
              variant={timeRange === "30d" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setTimeRange("30d")}
            >
              30D
            </Button>
            <Button
              variant={timeRange === "90d" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setTimeRange("90d")}
            >
              90D
            </Button>
            <Button
              variant={timeRange === "all" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setTimeRange("all")}
            >
              All
            </Button>
          </div>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Brain className="h-4 w-4 text-blue-700 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{(latestAccuracy * 100).toFixed(1)}%</div>
            <div className="flex items-center mt-2">
              {accuracyChange > 0 ? (
                <div className="text-xs bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{accuracyChangePercent.toFixed(1)}%
                </div>
              ) : (
                <div className="text-xs bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 px-2 py-1 rounded-full flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  {Math.abs(accuracyChangePercent).toFixed(1)}%
                </div>
              )}
              <span className="text-xs text-muted-foreground ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Training Time</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Clock className="h-4 w-4 text-green-700 dark:text-green-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">{latestTrainingTime.toFixed(1)} hrs</div>
            <div className="flex items-center mt-2">
              {trainingTimeChange > 0 ? (
                <div className="text-xs bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  -{trainingTimeChangePercent.toFixed(1)}%
                </div>
              ) : (
                <div className="text-xs bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 px-2 py-1 rounded-full flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{Math.abs(trainingTimeChangePercent).toFixed(1)}%
                </div>
              )}
              <span className="text-xs text-muted-foreground ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inference Speed</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-700 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{latestInferenceSpeed.toFixed(0)} ms</div>
            <div className="flex items-center mt-2">
              {inferenceSpeedChange > 0 ? (
                <div className="text-xs bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 px-2 py-1 rounded-full flex items-center">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  -{inferenceSpeedChangePercent.toFixed(1)}%
                </div>
              ) : (
                <div className="text-xs bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 px-2 py-1 rounded-full flex items-center">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +{Math.abs(inferenceSpeedChangePercent).toFixed(1)}%
                </div>
              )}
              <span className="text-xs text-muted-foreground ml-2">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Experiment Success</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <FlaskConical className="h-4 w-4 text-purple-700 dark:text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{successRate.toFixed(0)}%</div>
            <div className="flex items-center mt-2">
              <div className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
                {completedExperiments} of {totalExperiments} experiments completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
            <CardTitle>Model Performance Trends</CardTitle>
            <CardDescription>Accuracy, training time, and inference speed over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] pt-6">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between pb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Performance Metrics</p>
                  <p className="text-sm text-muted-foreground">
                    {timeRange === "7d"
                      ? "Last 7 days"
                      : timeRange === "30d"
                        ? "Last 30 days"
                        : timeRange === "90d"
                          ? "Last 90 days"
                          : "All time"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="mr-1.5 h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-muted-foreground">Accuracy</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1.5 h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-muted-foreground">Training Time</span>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-1.5 h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-muted-foreground">Inference Speed</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 relative">
                {/* Chart grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full h-px bg-gray-100 dark:bg-gray-800" />
                  ))}
                </div>

                {/* Line chart visualization */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full grid grid-cols-5 h-full">
                    {mockPerformanceMetrics.modelAccuracy.map((point, index) => (
                      <div key={index} className="flex flex-col justify-end h-full relative group">
                        {/* Accuracy line and point */}
                        <div
                          className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-blue-500 transform -translate-x-1/2 z-10 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-md"
                          style={{ bottom: `${point.value * 100 * 3}px` }}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs whitespace-nowrap z-20">
                            Accuracy: {(point.value * 100).toFixed(1)}%
                          </div>
                        </div>
                        {index > 0 && (
                          <div
                            className="absolute h-0.5 bg-blue-500 z-0"
                            style={{
                              bottom: `${mockPerformanceMetrics.modelAccuracy[index - 1].value * 100 * 3}px`,
                              left: "-50%",
                              width: "100%",
                              transform: `rotate(${Math.atan2(
                                (point.value - mockPerformanceMetrics.modelAccuracy[index - 1].value) * 100 * 3,
                                100
                              )}rad)`,
                              transformOrigin: "right",
                            }}
                          ></div>
                        )}

                        {/* Training time point */}
                        {mockPerformanceMetrics?.trainingTime && mockPerformanceMetrics.trainingTime[index] && (
                          <>
                            <div
                              className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-green-500 transform -translate-x-1/2 z-10 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-md"
                              style={{ bottom: `${(30 - mockPerformanceMetrics.trainingTime[index].value * 10) * 10}px` }}
                            >
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs whitespace-nowrap z-20">
                                Training: {mockPerformanceMetrics.trainingTime[index].value.toFixed(1)} hrs
                              </div>
                            </div>
                            {index > 0 && (
                              <div
                                className="absolute h-0.5 bg-green-500 z-0"
                                style={{
                                  bottom: `${(30 - mockPerformanceMetrics.trainingTime[index - 1].value * 10) * 10}px`,
                                  left: "-50%",
                                  width: "100%",
                                  transform: `rotate(${Math.atan2(
                                    (30 - mockPerformanceMetrics.trainingTime[index].value * 10) * 10 -
                                    (30 - mockPerformanceMetrics.trainingTime[index - 1].value * 10) * 10,
                                    100
                                  )}rad)`,
                                  transformOrigin: "right",
                                }}
                              ></div>
                            )}
                          </>
                        )}

                        {/* Inference speed point */}
                        {mockPerformanceMetrics?.inferenceSpeed && mockPerformanceMetrics.inferenceSpeed[index] && (
                          <>
                            <div
                              className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-amber-500 transform -translate-x-1/2 z-10 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:shadow-md"
                              style={{ bottom: `${(150 - mockPerformanceMetrics.inferenceSpeed[index].value) * 2}px` }}
                            >
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs whitespace-nowrap z-20">
                                Inference: {mockPerformanceMetrics.inferenceSpeed[index].value} ms
                              </div>
                            </div>
                            {index > 0 && (
                              <div
                                className="absolute h-0.5 bg-amber-500 z-0"
                                style={{
                                  bottom: `${(150 - mockPerformanceMetrics.inferenceSpeed[index - 1].value) * 2}px`,
                                  left: "-50%",
                                  width: "100%",
                                  transform: `rotate(${Math.atan2(
                                    (150 - mockPerformanceMetrics.inferenceSpeed[index].value) * 2 -
                                    (150 - mockPerformanceMetrics.inferenceSpeed[index - 1].value) * 2,
                                    100
                                  )}rad)`,
                                  transformOrigin: "right",
                                }}
                              ></div>
                            )}
                          </>
                        )}

                        <div className="text-xs text-muted-foreground text-center absolute bottom-[-24px] left-0 right-0">
                          {new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>CPU, memory, and GPU usage during training</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between pb-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Resource Metrics</p>
                  <p className="text-sm text-muted-foreground">Current training session</p>
                </div>
              </div>
              <div className="flex-1 space-y-8">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-blue-500">
                        <LineChart className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">CPU Usage</span>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-green-500">
                        <BarChart3 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Memory Usage</span>
                    </div>
                    <span className="text-sm font-medium">64%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-green-500" style={{ width: "64%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-purple-500">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">GPU Usage</span>
                    </div>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-purple-500" style={{ width: "92%" }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 text-yellow-500">
                        <PieChart className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">Disk I/O</span>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-full rounded-full bg-yellow-500" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Dataset Distribution</CardTitle>
            <CardDescription>Distribution of samples across datasets</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="flex h-full items-center justify-center">
              <div className="relative h-40 w-40">
                {/* Simple pie chart visualization */}
                <div
                  className="absolute inset-0 rounded-full border-8 border-blue-500"
                  style={{ clipPath: "polygon(50% 50%, 0 0, 0 100%, 100% 100%, 100% 0)" }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-green-500"
                  style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 50%)" }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-yellow-500"
                  style={{ clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)" }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-purple-500"
                  style={{ clipPath: "polygon(50% 50%, 50% 100%, 0 100%, 0 50%)" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Database className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {mockDatasets.map((dataset, index) => (
                <div key={dataset.id} className="flex items-center">
                  <div
                    className={`mr-2 h-3 w-3 rounded-full ${index === 0
                      ? "bg-blue-500"
                      : index === 1
                        ? "bg-green-500"
                        : index === 2
                          ? "bg-yellow-500"
                          : "bg-purple-500"
                      }`}
                  ></div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium leading-none">{dataset.name}</p>
                    <p className="text-xs text-muted-foreground">{dataset.samples} samples</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Annotation Quality</CardTitle>
            <CardDescription>Quality metrics for annotated data</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Consistency Score</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "87%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Precision</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Recall</span>
                  <span className="text-sm font-medium">84%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "84%" }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">F1 Score</span>
                  <span className="text-sm font-medium">88%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "88%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Training Progress</CardTitle>
            <CardDescription>Current training progress by epoch</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Epoch</span>
                  <span className="text-sm font-medium">42 / 100</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: "42%" }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Loss</span>
                  <span className="text-sm font-medium">0.0342</span>
                </div>
                <div className="relative pt-6">
                  {/* Simple line chart for loss */}
                  <div className="absolute inset-x-0 top-0 h-[1px] bg-muted"></div>
                  <div className="flex h-24 items-end">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-primary/20"
                          style={{
                            height: `${24 - Math.abs(Math.sin(i * 0.5) * 20 + Math.random() * 4)}px`,
                            opacity: i > 7 ? 0.5 : 1,
                          }}
                        ></div>
                        <div className="text-xs text-muted-foreground mt-1">{i * 5 + 5}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="text-sm font-medium">Estimated Time Remaining</div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">3h 24m</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

