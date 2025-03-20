"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Loader2, AlertCircle, Upload, FileVideo } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from "@/contexts/user-context"
import { PremiumFeature } from "@/components/premium-feature"
import { SubscriptionBadge } from "@/components/subscription-badge"

interface AIEditingProps {
  videoSrc?: string | null
  onApplySuggestion?: (timestamp: { startTime: number; endTime: number; label: string }) => void
}

export function AIEditing({ videoSrc: externalVideoSrc, onApplySuggestion }: AIEditingProps) {
  const { hasAccess } = useUser()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<Array<{ startTime: number; endTime: number; label: string; confidence: number }>>([])
  const [localVideoSrc, setLocalVideoSrc] = useState<string | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 有效的视频源是外部提供的或本地上传的
  const videoSrc = externalVideoSrc || localVideoSrc

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    const file = files[0]
    setVideoFile(file)

    // 创建临时URL以在浏览器中显示上传的视频
    const objectUrl = URL.createObjectURL(file)
    setLocalVideoSrc(objectUrl)
    setIsUploading(false)

    // 清除输入值，允许再次选择相同文件
    e.target.value = ""
  }, [])

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const analyzeVideo = useCallback(async () => {
    if (!videoSrc) {
      setError("请先上传视频")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setSuggestions([])

    try {
      // 在实际应用中，这里应该调用AI分析API
      // 这里使用模拟数据进行演示
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 模拟AI返回的时间戳建议
      const mockSuggestions = [
        { startTime: 15.2, endTime: 18.5, label: "Triple Axel Jump", confidence: 0.92 },
        { startTime: 32.7, endTime: 35.1, label: "Camel Spin", confidence: 0.87 },
        { startTime: 48.3, endTime: 52.6, label: "Step Sequence", confidence: 0.79 },
      ]

      setSuggestions(mockSuggestions)
    } catch (err) {
      console.error("Error analyzing video:", err)
      setError("视频分析失败，请重试。")
    } finally {
      setIsAnalyzing(false)
    }
  }, [videoSrc])

  const handleApplySuggestion = useCallback((suggestion: { startTime: number; endTime: number; label: string }) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion)
    }
  }, [onApplySuggestion])

  return (
    <PremiumFeature requiredTier="pro">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              AI-Powered Editing
              <SubscriptionBadge tier="pro" size="sm" />
            </CardTitle>
          </div>
          <CardDescription>
            智能时间戳建议基于视频内容分析
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {!videoSrc && (
              <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center">
                <FileVideo className="h-10 w-10 mx-auto mb-2 text-zinc-400" />
                <h3 className="text-sm font-medium mb-1">没有视频</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                  上传视频以使用AI分析功能
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={triggerFileInput}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      上传中...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      上传视频
                    </>
                  )}
                </Button>
              </div>
            )}

            {videoSrc && (
              <div className="space-y-4">
                <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden relative">
                  <video
                    src={videoSrc}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={triggerFileInput}
                    size="sm"
                    className="text-xs"
                  >
                    <Upload className="mr-1 h-3.5 w-3.5" />
                    更换视频
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex-1 truncate">
                    {videoFile ? videoFile.name : '视频已加载'}
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={analyzeVideo}
              disabled={isAnalyzing || !videoSrc}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  分析视频中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  分析视频
                </>
              )}
            </Button>

            {suggestions.length > 0 && (
              <div className="space-y-3 mt-4">
                <h3 className="text-sm font-medium">AI建议:</h3>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <div className="font-medium">{suggestion.label}</div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">
                        {formatTime(suggestion.startTime)} - {formatTime(suggestion.endTime)}
                        <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                          {Math.round(suggestion.confidence * 100)}% 置信度
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApplySuggestion(suggestion)}
                    >
                      应用
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </PremiumFeature>
  )
}

// 辅助函数：格式化时间
function formatTime(time: number): string {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  const milliseconds = Math.floor((time % 1) * 100)
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
}