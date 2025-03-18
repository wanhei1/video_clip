"use client"

import type React from "react"

import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit2, Trash2, Play, Clock, Scissors, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type Timestamp = {
  id: string
  startTime: number
  endTime: number | null
  label: string
}

interface TimestampListProps {
  timestamps: Timestamp[]
  onLabelChange: (id: string, label: string) => void
  onDelete: (id: string) => void
  onSeek: (time: number) => void
  activeTimestamp: string | null
  onExtractClip?: (id: string) => void
}

export const TimestampList = memo(function TimestampList({
  timestamps,
  onLabelChange,
  onDelete,
  onSeek,
  activeTimestamp,
  onExtractClip,
}: TimestampListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    const milliseconds = Math.floor((time % 1) * 100)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }, [])

  const handleEdit = useCallback((id: string, currentLabel: string) => {
    setEditingId(id)
    setEditValue(currentLabel)
  }, [])

  const handleSave = useCallback(
    (id: string) => {
      onLabelChange(id, editValue)
      setEditingId(null)
    },
    [editValue, onLabelChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      if (e.key === "Enter") {
        handleSave(id)
      } else if (e.key === "Escape") {
        setEditingId(null)
      }
    },
    [handleSave],
  )

  const handleCancel = useCallback(() => {
    setEditingId(null)
  }, [])

  if (timestamps.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-4 text-center">
        <Clock className="mb-2 h-10 w-10 text-zinc-500 dark:text-zinc-400" />
        <p className="text-sm text-zinc-600 dark:text-zinc-400">No timestamps recorded yet</p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
          Start recording timestamps by clicking the button below the video
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {timestamps.map((timestamp) => (
          <div
            key={timestamp.id}
            className={cn(
              "rounded-lg border p-3 transition-all",
              activeTimestamp === timestamp.id
                ? "border-rose-400 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20"
                : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700",
            )}
          >
            <div className="mb-2 flex items-center justify-between">
              {editingId === timestamp.id ? (
                <div className="flex w-full gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, timestamp.id)}
                    autoFocus
                    className="h-8 text-sm"
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-500 dark:hover:text-green-400 dark:hover:bg-green-900/50"
                      onClick={() => handleSave(timestamp.id)}
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Save</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-600 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-300 dark:hover:bg-zinc-800"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="font-medium text-zinc-800 dark:text-zinc-200">{timestamp.label}</div>
              )}

              {editingId !== timestamp.id && (
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
                          onClick={() => handleEdit(timestamp.id, timestamp.label)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit label</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-rose-900/50"
                          onClick={() => onDelete(timestamp.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete timestamp</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex flex-wrap gap-x-2 gap-y-1">
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
                  <span className="font-medium">Start:</span> {formatTime(timestamp.startTime)}
                </Badge>

                {timestamp.endTime !== null && (
                  <>
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
                      <span className="font-medium">End:</span> {formatTime(timestamp.endTime)}
                    </Badge>
                    <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
                      <span className="font-medium">Duration:</span>{" "}
                      {formatTime(timestamp.endTime - timestamp.startTime)}
                    </Badge>
                  </>
                )}
              </div>

              <div className="flex gap-1 ml-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-800/70"
                        onClick={() => onSeek(timestamp.startTime)}
                      >
                        <Play className="h-3 w-3" />
                        <span className="sr-only">Play</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Play from this timestamp</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {timestamp.endTime !== null && onExtractClip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-800/70"
                          onClick={() => onExtractClip(timestamp.id)}
                        >
                          <Scissors className="h-3 w-3" />
                          <span className="sr-only">Extract Clip</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Extract this clip</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
})

