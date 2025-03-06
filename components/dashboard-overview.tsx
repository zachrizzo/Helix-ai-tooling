"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart,
  CheckCircle2,
  Clock,
  Database,
  FlaskConical,
  Tag,
  Sparkles,
  Zap,
  TrendingUp,
  Bell
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { mockAnnotationTasks, mockDatasets, mockExperiments, mockPerformanceMetrics } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function DashboardOverview() {
  // Calculate summary statistics
  const totalDatasets = mockDatasets.length
  const totalExperiments = mockExperiments.length
  const activeExperiments = mockExperiments.filter((exp) => exp.status === "Running").length
  const pendingAnnotations = mockAnnotationTasks.filter((task) => task.progress < 100).length
  const averageAnnotationProgress = Math.round(mockAnnotationTasks.reduce((acc, task) => acc + task.progress, 0) / mockAnnotationTasks.length)

  // Calculate model accuracy trend
  const currentAccuracy = mockPerformanceMetrics.modelAccuracy[mockPerformanceMetrics.modelAccuracy.length - 1].value * 100
  const previousAccuracy = mockPerformanceMetrics.modelAccuracy[mockPerformanceMetrics.modelAccuracy.length - 2].value * 100
  const accuracyTrend = currentAccuracy - previousAccuracy
  const accuracyTrendPositive = accuracyTrend >= 0

  // Get recent items
  const recentDatasets = mockDatasets.slice(0, 3)
  const recentTasks = mockAnnotationTasks.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here's what's happening with your AI projects today.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/experiments/new">
              <Sparkles className="mr-2 h-4 w-4" />
              New Experiment
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/datasets/upload">
              <Database className="mr-2 h-4 w-4" />
              Upload Dataset
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Database className="h-4 w-4 text-blue-700 dark:text-blue-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalDatasets}</div>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-normal">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 this month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <FlaskConical className="h-4 w-4 text-purple-700 dark:text-purple-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{activeExperiments}</div>
            <div className="flex items-center mt-1">
              <p className="text-xs text-muted-foreground">
                {activeExperiments} of {totalExperiments} experiments running
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Annotations</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Tag className="h-4 w-4 text-amber-700 dark:text-amber-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{pendingAnnotations}</div>
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">{averageAnnotationProgress}%</span>
              </div>
              <Progress value={averageAnnotationProgress} className="h-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
              <Activity className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">{currentAccuracy.toFixed(1)}%</div>
            <div className="flex items-center mt-1">
              <Badge
                variant="outline"
                className={cn(
                  "font-normal",
                  accuracyTrendPositive
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                )}
              >
                {accuracyTrendPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1 transform rotate-90" />}
                {accuracyTrendPositive ? '+' : ''}{accuracyTrend.toFixed(1)}% from last period
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-md bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-950/50 dark:to-slate-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Model performance over the last 3 months</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8 shadow-sm hover:shadow transition-all">
                <Link href="/analytics" className="flex items-center">
                  <span>Detailed Analysis</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end gap-2 pt-4 relative">
            {/* Grid lines */}
            <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-full h-px bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>

            {mockPerformanceMetrics.modelAccuracy.map((point, index) => (
              <div key={index} className="relative flex flex-col items-center group z-10 flex-1">
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800 shadow-md rounded-md px-2 py-1 text-xs whitespace-nowrap z-20">
                  {(point.value * 100).toFixed(1)}%
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white dark:border-t-gray-800"></div>
                </div>
                <div
                  className="w-full max-w-[50px] rounded-t-md transition-all duration-500 ease-out group-hover:opacity-90 group-hover:shadow-lg relative overflow-hidden"
                  style={{
                    height: `${point.value * 300}px`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-violet-500 dark:from-blue-600 dark:to-violet-600"></div>
                  <div className="absolute inset-0 opacity-10"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white/10 to-transparent"></div>
                </div>
                <span className="text-xs mt-2 text-muted-foreground">
                  {new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Annotation Tasks</CardTitle>
                <CardDescription>Your assigned annotation tasks</CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Due {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-medium">{task.progress}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full",
                          task.progress < 30 ? "bg-red-500" :
                            task.progress < 70 ? "bg-amber-500" : "bg-green-500"
                        )}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/annotation">
                  <span>View all tasks</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Datasets</CardTitle>
                <CardDescription>Recently updated datasets</CardDescription>
              </div>
              <Badge variant="outline" className="font-normal">
                {totalDatasets} total
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDatasets.map((dataset) => (
                <div key={dataset.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{dataset.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Zap className="mr-1 h-3 w-3" />
                      {dataset.samples.toLocaleString()} samples
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(dataset.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/datasets">
                  <span>View all datasets</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Experiment Status</CardTitle>
                <CardDescription>Current experiment progress</CardDescription>
              </div>
              <Badge variant="outline" className="font-normal">
                {activeExperiments} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExperiments.slice(0, 3).map((experiment) => (
                <div key={experiment.id} className="space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{experiment.name}</p>
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
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{experiment.progress}%</span>
                  </div>
                  <Progress
                    value={experiment.progress}
                    className={cn(
                      "h-1.5",
                      experiment.status === "Running"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : experiment.status === "Completed"
                          ? "bg-green-100 dark:bg-green-900"
                          : experiment.status === "Paused"
                            ? "bg-yellow-100 dark:bg-yellow-900"
                            : "bg-gray-100 dark:bg-gray-900"
                    )}
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <Link href="/experiments">
                  <span>View all experiments</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="default" className="w-full justify-start h-auto py-3 group" asChild>
                <Link href="/annotation">
                  <div className="bg-primary-foreground/10 rounded-md p-2 mr-3 group-hover:bg-primary-foreground/20 transition-colors">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Start Annotation</div>
                    <div className="text-xs text-muted-foreground">Begin labeling your data</div>
                  </div>
                </Link>
              </Button>

              <Button variant="default" className="w-full justify-start h-auto py-3 group" asChild>
                <Link href="/experiments/new">
                  <div className="bg-primary-foreground/10 rounded-md p-2 mr-3 group-hover:bg-primary-foreground/20 transition-colors">
                    <FlaskConical className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Create Experiment</div>
                    <div className="text-xs text-muted-foreground">Test your model hypothesis</div>
                  </div>
                </Link>
              </Button>

              <Button variant="default" className="w-full justify-start h-auto py-3 group" asChild>
                <Link href="/datasets/upload">
                  <div className="bg-primary-foreground/10 rounded-md p-2 mr-3 group-hover:bg-primary-foreground/20 transition-colors">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Upload Dataset</div>
                    <div className="text-xs text-muted-foreground">Import new training data</div>
                  </div>
                </Link>
              </Button>

              <Button variant="default" className="w-full justify-start h-auto py-3 group" asChild>
                <Link href="/analytics">
                  <div className="bg-primary-foreground/10 rounded-md p-2 mr-3 group-hover:bg-primary-foreground/20 transition-colors">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">View Analytics</div>
                    <div className="text-xs text-muted-foreground">Explore performance metrics</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

