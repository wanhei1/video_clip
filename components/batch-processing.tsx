"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileVideo, Loader2, AlertCircle, CheckCircle, X, Layers, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/user-context"
import { PremiumFeature } from "@/components/premium-feature"
import { SubscriptionBadge } from "@/components/subscription-badge"

type BatchJob = {
  id: string
  fileName: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  error?: string
  outputUrl?: string
}

interface BatchProcessingProps {}

export function BatchProcessing({}: BatchProcessingProps) {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("upload")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [jobs, setJobs] = useState<BatchJob[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...filesArray])
    }
  }, [])

  const removeSelectedFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  const startBatchProcessing = useCallback(async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one video file")
      return
    }

    setIsProcessing(true)
    setError(null)
    setSuccess(null)

    // 创建作业队列
    const newJobs: BatchJob[] = selectedFiles.map(file => ({
      id: crypto.randomUUID(),
      fileName: file.name,
      status: "queued",
      progress: 0,
    }))

    setJobs(prev => [...prev, ...newJobs])
    setActiveTab("jobs")

    // 模拟批处理过程
    for (let i = 0; i < newJobs.length; i++) {
      const job = newJobs[i]

      // 更新状态为处理中
      setJobs(prev =>
        prev.map(j => (j.id === job.id ? { ...j, status: "processing" } : j)),
      )

      try {
        // 模拟处理过程
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 300))
          setJobs(prev =>
            prev.map(j => (j.id === job.id ? { ...j, progress } : j)),
          )
        }

        // 更新为完成状态
        setJobs(prev =>
          prev.map(j =>
            j.id === job.id
              ? {
                  ...j,
                  status: "completed",
                  progress: 100,
                  outputUrl: `#output-${j.fileName}`,
                }
              : j,
          ),
        )
      } catch (err) {
        // 更新为失败状态
        setJobs(prev =>
          prev.map(j =>
            j.id === job.id
              ? {
                  ...j,
                  status: "failed",
                  error: "Processing failed. Please try again.",
                }
              : j,
          ),
        )
      }
    }

    setIsProcessing(false)
    setSelectedFiles([])
    setSuccess("Batch processing completed")
  }, [selectedFiles])

  const clearCompletedJobs = useCallback(() => {
    setJobs(prev => prev.filter(job => job.status !== "completed"))
  }, [])

  const retryFailedJobs = useCallback(() => {
    const failedJobs = jobs.filter(job => job.status === "failed")

    if (failedJobs.length === 0) return

    setJobs(prev =>
      prev.map(job =>
        job.status === "failed"
          ? { ...job, status: "queued", progress: 0, error: undefined }
          : job,
      ),
    )

    // 重新开始处理失败的作业
    startBatchProcessing()
  }, [jobs, startBatchProcessing])

  return (
    <PremiumFeature requiredTier="pro">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              Batch Processing
              <SubscriptionBadge tier="pro" size="sm" />
            </CardTitle>
          </div>
          <CardDescription>
            Process multiple videos simultaneously with our queue system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="jobs">Jobs {jobs.length > 0 && `(${jobs.length})`}</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="batch-files">Select Video Files</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="batch-files"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={() => document.getElementById("batch-files")?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Browse
                  </Button>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Selected Files ({selectedFiles.length}):</h3>
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md border p-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <FileVideo className="h-4 w-4 text-indigo-500" />
                            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                            <span className="text-zinc-500 dark:text-zinc-400">
                              ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSelectedFile(index)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Button
                    onClick={startBatchProcessing}
                    disabled={isProcessing || selectedFiles.length === 0}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Start Batch Processing ({selectedFiles.length} files)</>
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              {jobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Layers className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                  <h3 className="text-lg font-medium">No jobs in queue</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Upload videos in the Upload tab to start processing
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setActiveTab("upload")}
                  >
                    Go to Upload
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Processing Queue ({jobs.length} jobs)</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={retryFailedJobs}>
                        Retry Failed
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearCompletedJobs}>
                        Clear Completed
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[300px] rounded-md border p-2">
                    <div className="space-y-3">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="rounded-md border p-3 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileVideo className="h-4 w-4 text-indigo-500" />
                              <span className="font-medium truncate max-w-[200px]">{job.fileName}</span>
                            </div>
                            <Badge
                              variant={job.status === "completed" ? "default" : job.status === "failed" ? "destructive" : "outline"}
                              className={job.status === "processing" ? "animate-pulse" : ""}
                            >
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </Badge>
                          </div>

                          <Progress value={job.progress} className="h-2" />

                          {job.error && (
                            <Alert variant="destructive" className="py-2">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-xs">{job.error}</AlertDescription>
                            </Alert>
                          )}

                          {job.status === "completed" && (
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline" asChild>
                                <a href={job.outputUrl} download>
                                  Download Result
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PremiumFeature>
  )
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  )
}