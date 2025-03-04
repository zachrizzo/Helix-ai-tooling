"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ArrowRight, BarChart, CheckCircle2, Clock, Database, FlaskConical, Tag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { mockAnnotationTasks, mockDatasets, mockExperiments, mockPerformanceMetrics } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function DashboardOverview() {
  // Calculate summary statistics
  const totalDatasets = mockDatasets.length
  const totalExperiments = mockExperiments.length
  const activeExperiments = mockExperiments.filter((exp) => exp.status === "Running").length
  const pendingAnnotations = mockAnnotationTasks.filter((task) => task.progress < 100).length

  // Get recent items
  const recentDatasets = mockDatasets.slice(0, 3)
  const recentTasks = mockAnnotationTasks.slice(0, 3)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDatasets}</div>
            <p className="text-xs text-muted-foreground">+2 added this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeExperiments}</div>
            <p className="text-xs text-muted-foreground">
              {activeExperiments} of {totalExperiments} experiments running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Annotations</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAnnotations}</div>
            <p className="text-xs text-muted-foreground">
              {mockAnnotationTasks.reduce((acc, task) => acc + task.progress, 0) / mockAnnotationTasks.length}% average
              completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                mockPerformanceMetrics.modelAccuracy[mockPerformanceMetrics.modelAccuracy.length - 1].value * 100
              ).toFixed(1)}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {(
                (mockPerformanceMetrics.modelAccuracy[mockPerformanceMetrics.modelAccuracy.length - 1].value -
                  mockPerformanceMetrics.modelAccuracy[mockPerformanceMetrics.modelAccuracy.length - 2].value) *
                100
              ).toFixed(1)}
              % from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Model performance over the last 3 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-end gap-2">
            {mockPerformanceMetrics.modelAccuracy.map((point, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div className="w-12 bg-primary rounded-t-md" style={{ height: `${point.value * 300}px` }} />
                <span className="text-xs mt-2 text-muted-foreground">
                  {new Date(point.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Annotation Tasks</CardTitle>
            <CardDescription>Your assigned annotation tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{task.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      Due {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <div className="w-10 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${task.progress}%` }} />
                    </div>
                    <span>{task.progress}%</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/annotation">
                  <span>View all tasks</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Datasets</CardTitle>
            <CardDescription>Recently updated datasets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDatasets.map((dataset) => (
                <div key={dataset.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                    <Database className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{dataset.name}</p>
                    <p className="text-xs text-muted-foreground">{dataset.samples} samples</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(dataset.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/datasets">
                  <span>View all datasets</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Experiment Status</CardTitle>
            <CardDescription>Current experiment progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExperiments.slice(0, 3).map((experiment) => (
                <div key={experiment.id} className="space-y-2">
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
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
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
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/experiments">
                  <span>View all experiments</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/annotation">
                  <Tag className="mr-2 h-4 w-4" />
                  Start Annotation
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/experiments/new">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Create Experiment
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/datasets/upload">
                  <Database className="mr-2 h-4 w-4" />
                  Upload Dataset
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/analytics">
                  <BarChart className="mr-2 h-4 w-4" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/models/deploy">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Deploy Model
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

