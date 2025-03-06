"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Database, Download, Filter, Plus, Search, Tag, Upload } from "lucide-react"
import Image from "next/image"
import { mockDatasets } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

export function DatasetExplorer() {
  const { toast } = useToast()
  const [datasets, setDatasets] = useState(mockDatasets)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)

  const filteredDatasets = datasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dataset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleUploadDataset = () => {
    toast({
      title: "Upload initiated",
      description: "The dataset upload dialog would open here",
    })
  }

  const handleCreateDataset = () => {
    toast({
      title: "Create dataset",
      description: "The dataset creation form would open here",
    })
  }

  const handleDownloadDataset = (id: string) => {
    toast({
      title: "Download started",
      description: `Downloading dataset ${datasets.find((d) => d.id === id)?.name}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search datasets..."
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
          <Button variant="outline" onClick={handleUploadDataset}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button onClick={handleCreateDataset}>
            <Plus className="mr-2 h-4 w-4" />
            New Dataset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset) => (
          <Card
            key={dataset.id}
            className={`overflow-hidden cursor-pointer transition-all ${selectedDataset === dataset.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
            onClick={() => setSelectedDataset(dataset.id === selectedDataset ? null : dataset.id)}
          >
            <div className="aspect-video relative">
              <Image src={dataset.thumbnail || "/placeholder.svg"} alt={dataset.name} fill className="object-cover" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{dataset.name}</CardTitle>
              <CardDescription>{dataset.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {dataset.tags && dataset.tags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full flex items-center"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <Database className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{dataset.samples} samples</span>
                  </div>
                  <div className="text-muted-foreground">
                    Updated {new Date(dataset.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                {selectedDataset === dataset.id && (
                  <div className="pt-2 flex justify-between border-t">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownloadDataset(dataset.id)
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredDatasets.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No datasets found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : "Try creating a new dataset or uploading data"}
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleUploadDataset}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Dataset
              </Button>
              <Button onClick={handleCreateDataset}>
                <Plus className="mr-2 h-4 w-4" />
                Create Dataset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

