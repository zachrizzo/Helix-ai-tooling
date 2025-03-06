"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Upload, FileText, Database, FileUp, Check, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UploadDatasetPage() {
    const router = useRouter()
    const [file, setFile] = useState<File | null>(null)
    const [datasetName, setDatasetName] = useState("")
    const [description, setDescription] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            handleFileSelect(droppedFile)
        }
    }

    const handleFileSelect = (selectedFile: File) => {
        if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv") ||
            selectedFile.type === "application/json" || selectedFile.name.endsWith(".json")) {
            setFile(selectedFile)

            // Auto-fill dataset name from filename if empty
            if (!datasetName) {
                setDatasetName(selectedFile.name.split(".")[0].replace(/_/g, " "))
            }
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file || !datasetName) return

        setIsUploading(true)

        // This is just a simulation since we don't have a real backend
        setTimeout(() => {
            setIsUploading(false)
            setUploadStatus("success")

            // Redirect after successful upload
            setTimeout(() => {
                router.push("/datasets")
            }, 2000)
        }, 2000)
    }

    return (
        <DashboardLayout>
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Upload Dataset</h1>
                    <p className="text-muted-foreground">Upload your dataset files for training and testing your models.</p>
                </div>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Dataset Information</CardTitle>
                        <CardDescription>Provide details about your dataset.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Dataset Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Customer Behavior Data"
                                value={datasetName}
                                onChange={(e) => setDatasetName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                rows={3}
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="Brief description about this dataset and its purpose"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Dataset File</Label>
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center gap-4 transition-colors cursor-pointer",
                                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                                    file ? "bg-primary/5" : ""
                                )}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => {
                                    const fileInput = document.getElementById("file-upload")
                                    if (fileInput) {
                                        fileInput.click()
                                    }
                                }}
                            >
                                {!file ? (
                                    <>
                                        <div className="p-4 rounded-full bg-muted">
                                            <Upload className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                                            <p className="text-xs text-muted-foreground">Supports CSV and JSON files up to 50MB</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 rounded-full bg-primary/10">
                                            <FileText className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-sm font-medium">{file.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type || "CSV/JSON"}
                                            </p>
                                        </div>
                                    </>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".csv,.json"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!file || !datasetName || isUploading || uploadStatus === "success"}
                            className="min-w-[120px]"
                        >
                            {isUploading ? (
                                <>
                                    <span className="animate-pulse">Uploading...</span>
                                </>
                            ) : uploadStatus === "success" ? (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Uploaded
                                </>
                            ) : (
                                <>
                                    <FileUp className="mr-2 h-4 w-4" />
                                    Upload Dataset
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {uploadStatus === "success" && (
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        <p>Dataset uploaded successfully! Redirecting to datasets page...</p>
                    </div>
                )}

                {uploadStatus === "error" && (
                    <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <p>There was an error uploading your dataset. Please try again.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
