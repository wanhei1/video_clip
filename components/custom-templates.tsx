"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileJson, Save, Plus, Trash2, Edit, AlertCircle, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUser } from "@/contexts/user-context"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { PremiumFeature } from "@/components/premium-feature"

type Template = {
  id: string
  name: string
  description: string
  timestamps: Array<{
    label: string
    shortcut?: string
  }>
}

interface CustomTemplatesProps {
  onApplyTemplate?: (template: Template) => void
}

export function CustomTemplates({ onApplyTemplate }: CustomTemplatesProps) {
  const { user } = useUser()
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "default-figure-skating",
      name: "Figure Skating Elements",
      description: "Common figure skating elements for competition analysis",
      timestamps: [
        { label: "Jump - Triple Axel", shortcut: "3A" },
        { label: "Jump - Quad Toe Loop", shortcut: "4T" },
        { label: "Spin - Camel Spin", shortcut: "CSp" },
        { label: "Spin - Sit Spin", shortcut: "SSp" },
        { label: "Step Sequence", shortcut: "StSq" },
        { label: "Choreographic Sequence", shortcut: "ChSq" },
      ],
    },
  ])
  const [activeTab, setActiveTab] = useState("browse")
  const [newTemplate, setNewTemplate] = useState<{
    name: string
    description: string
    timestamps: Array<{ label: string; shortcut?: string }>
  }>({
    name: "",
    description: "",
    timestamps: [{ label: "", shortcut: "" }],
  })
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleAddTimestampField = useCallback(() => {
    if (editingTemplate) {
      setEditingTemplate({
        ...editingTemplate,
        timestamps: [...editingTemplate.timestamps, { label: "", shortcut: "" }],
      })
    } else {
      setNewTemplate({
        ...newTemplate,
        timestamps: [...newTemplate.timestamps, { label: "", shortcut: "" }],
      })
    }
  }, [editingTemplate, newTemplate])

  const handleRemoveTimestampField = useCallback(
    (index: number) => {
      if (editingTemplate) {
        const updatedTimestamps = [...editingTemplate.timestamps]
        updatedTimestamps.splice(index, 1)
        setEditingTemplate({
          ...editingTemplate,
          timestamps: updatedTimestamps,
        })
      } else {
        const updatedTimestamps = [...newTemplate.timestamps]
        updatedTimestamps.splice(index, 1)
        setNewTemplate({
          ...newTemplate,
          timestamps: updatedTimestamps,
        })
      }
    },
    [editingTemplate, newTemplate],
  )

  const handleTimestampChange = useCallback(
    (index: number, field: "label" | "shortcut", value: string) => {
      if (editingTemplate) {
        const updatedTimestamps = [...editingTemplate.timestamps]
        updatedTimestamps[index] = { ...updatedTimestamps[index], [field]: value }
        setEditingTemplate({
          ...editingTemplate,
          timestamps: updatedTimestamps,
        })
      } else {
        const updatedTimestamps = [...newTemplate.timestamps]
        updatedTimestamps[index] = { ...updatedTimestamps[index], [field]: value }
        setNewTemplate({
          ...newTemplate,
          timestamps: updatedTimestamps,
        })
      }
    },
    [editingTemplate, newTemplate],
  )

  const handleSaveTemplate = useCallback(() => {
    setError(null)

    const templateToSave = editingTemplate || newTemplate

    if (!templateToSave.name.trim()) {
      setError("Template name is required")
      return
    }

    if (templateToSave.timestamps.length === 0) {
      setError("At least one timestamp is required")
      return
    }

    if (templateToSave.timestamps.some(t => !t.label.trim())) {
      setError("All timestamp labels are required")
      return
    }

    if (editingTemplate) {
      // Update existing template
      setTemplates(prev =>
        prev.map(t => (t.id === editingTemplate.id ? { ...editingTemplate } : t)),
      )
      setEditingTemplate(null)
      setSuccess("Template saved successfully")
    }
    else {
      // Add new template
      const newTemplateWithId = {
        id: crypto.randomUUID(),
        ...newTemplate,
      }
      setTemplates(prev => [...prev, newTemplateWithId])
      setNewTemplate({
        name: "",
        description: "",
        timestamps: [{ label: "", shortcut: "" }],
      })
      setSuccess("Template created successfully")
    }

    // Clear success message after a few seconds
    setTimeout(() => {
      setSuccess(null)
    }, 3000)
  }, [editingTemplate, newTemplate])

  const handleEditTemplate = useCallback((template: Template) => {
    setEditingTemplate(template)
    setActiveTab("create")
  }, [])

  const handleDeleteTemplate = useCallback((templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId))
  }, [])

  const handleApplyTemplateClick = useCallback((template: Template) => {
    if (onApplyTemplate) {
      onApplyTemplate(template)
    }
  }, [onApplyTemplate])

  return (
    <PremiumFeature requiredTier="pro">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <FileJson className="h-5 w-5 text-indigo-500" />
              Custom Templates
              <SubscriptionBadge tier="pro" size="sm" />
            </CardTitle>
          </div>
          <CardDescription>
            Create and manage custom timestamp templates for different video types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Browse Templates</TabsTrigger>
              <TabsTrigger value="create">{editingTemplate ? "Edit Template" : "Create Template"}</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                <Check className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="browse" className="space-y-4">
              {templates.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 dark:text-zinc-400">
                  <p>No templates yet. Create your first template to get started.</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setActiveTab("create")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {templates.map(template => (
                      <Card key={template.id} className="overflow-hidden">
                        <CardHeader className="pb-2 pt-4">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base font-medium">{template.name}</CardTitle>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-rose-900/50"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                            {template.timestamps.length} timestamps
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {template.timestamps.map((timestamp, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs bg-zinc-50 dark:bg-zinc-900"
                              >
                                {timestamp.label}
                                {timestamp.shortcut && (
                                  <span className="ml-1 text-zinc-400 dark:text-zinc-500">
                                    ({timestamp.shortcut})
                                  </span>
                                )}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                            onClick={() => handleApplyTemplateClick(template)}
                          >
                            Apply Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="create" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={editingTemplate ? editingTemplate.name : newTemplate.name}
                    onChange={(e) =>
                      editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, name: e.target.value })
                        : setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                    placeholder="e.g., Figure Skating Elements"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={editingTemplate ? editingTemplate.description : newTemplate.description}
                    onChange={(e) =>
                      editingTemplate
                        ? setEditingTemplate({ ...editingTemplate, description: e.target.value })
                        : setNewTemplate({ ...newTemplate, description: e.target.value })
                    }
                    placeholder="Describe what this template is for"
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label>Timestamps</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddTimestampField}
                      className="h-8 px-2 text-xs"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Timestamp
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {(editingTemplate ? editingTemplate.timestamps : newTemplate.timestamps).map((timestamp, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Input
                            value={timestamp.label}
                            onChange={(e) => handleTimestampChange(index, "label", e.target.value)}
                            placeholder="Timestamp label (e.g., Triple Axel Jump)"
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            value={timestamp.shortcut || ""}
                            onChange={(e) => handleTimestampChange(index, "shortcut", e.target.value)}
                            placeholder="Shortcut"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTimestampField(index)}
                          className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-100 dark:text-rose-500 dark:hover:text-rose-400 dark:hover:bg-rose-900/50"
                          disabled={(editingTemplate ? editingTemplate.timestamps : newTemplate.timestamps).length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleSaveTemplate}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editingTemplate ? "Update Template" : "Save Template"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </PremiumFeature>
  )
}