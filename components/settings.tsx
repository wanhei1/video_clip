"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useUser } from "@/contexts/user-context"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { Settings as SettingsIcon, Cloud, Save, Database } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PremiumFeature } from "@/components/premium-feature"

interface SettingsProps {}

export function Settings({}: SettingsProps) {
  const { user } = useUser()
  const [exportFormat, setExportFormat] = useState("mp4")
  const [timestampPrecision, setTimestampPrecision] = useState("milliseconds")
  const [colorTheme, setColorTheme] = useState("indigo")
  const [interfaceDensity, setInterfaceDensity] = useState("comfortable")
  const [cloudStorageEnabled, setCloudStorageEnabled] = useState(true)
  const [autoSaveInterval, setAutoSaveInterval] = useState(5)
  const [success, setSuccess] = useState<string | null>(null)

  // Mock cloud storage usage data
  const storageUsed = 1.2 // GB
  const storageLimit = 5 // GB
  const storagePercentage = (storageUsed / storageLimit) * 100

  const handleSaveSettings = useCallback(() => {
    // Here you would save the settings to your backend or local storage
    // For now, we'll just show a success message
    setSuccess("Settings saved successfully")

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null)
    }, 3000)
  }, [exportFormat, timestampPrecision, colorTheme, interfaceDensity, cloudStorageEnabled, autoSaveInterval])

  return (
    <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90 overflow-hidden">
      <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-indigo-500" />
          Editor Settings
        </CardTitle>
        <CardDescription>Customize your video editing experience.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Video Preferences</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Default Export Format
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="mp4"
                      name="format"
                      className="text-indigo-600"
                      checked={exportFormat === "mp4"}
                      onChange={() => setExportFormat("mp4")}
                    />
                    <Label htmlFor="mp4" className="text-sm">
                      MP4
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="webm"
                      name="format"
                      className="text-indigo-600"
                      checked={exportFormat === "webm"}
                      onChange={() => setExportFormat("webm")}
                    />
                    <Label htmlFor="webm" className="text-sm">
                      WebM
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Timestamp Precision
                </Label>
                <select
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm"
                  value={timestampPrecision}
                  onChange={(e) => setTimestampPrecision(e.target.value)}
                >
                  <option value="milliseconds">Milliseconds (0.001s)</option>
                  <option value="centiseconds">Centiseconds (0.01s)</option>
                  <option value="deciseconds">Deciseconds (0.1s)</option>
                  <option value="seconds">Seconds (1s)</option>
                </select>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3">Theme & Appearance</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Color Theme
                </Label>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ${colorTheme === 'indigo' ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-zinc-900' : ''}`}
                    onClick={() => setColorTheme('indigo')}
                    aria-label="Indigo theme"
                  ></button>
                  <button
                    className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 ${colorTheme === 'blue' ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-zinc-900' : ''}`}
                    onClick={() => setColorTheme('blue')}
                    aria-label="Blue theme"
                  ></button>
                  <button
                    className={`w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 ${colorTheme === 'green' ? 'ring-2 ring-offset-2 ring-emerald-500 dark:ring-offset-zinc-900' : ''}`}
                    onClick={() => setColorTheme('green')}
                    aria-label="Green theme"
                  ></button>
                  <button
                    className={`w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 ${colorTheme === 'pink' ? 'ring-2 ring-offset-2 ring-rose-500 dark:ring-offset-zinc-900' : ''}`}
                    onClick={() => setColorTheme('pink')}
                    aria-label="Pink theme"
                  ></button>
                  <button
                    className={`w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 ${colorTheme === 'orange' ? 'ring-2 ring-offset-2 ring-amber-500 dark:ring-offset-zinc-900' : ''}`}
                    onClick={() => setColorTheme('orange')}
                    aria-label="Orange theme"
                  ></button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Interface Density
                </Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="compact"
                      name="density"
                      className="text-indigo-600"
                      checked={interfaceDensity === "compact"}
                      onChange={() => setInterfaceDensity("compact")}
                    />
                    <Label htmlFor="compact" className="text-sm">
                      Compact
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="comfortable"
                      name="density"
                      className="text-indigo-600"
                      checked={interfaceDensity === "comfortable"}
                      onChange={() => setInterfaceDensity("comfortable")}
                    />
                    <Label htmlFor="comfortable" className="text-sm">
                      Comfortable
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Cloud className="h-5 w-5 text-indigo-500" />
              Cloud Storage
              <SubscriptionBadge tier="pro" size="sm" />
            </h3>

            <PremiumFeature requiredTier="pro">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Enable Cloud Storage</Label>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Store your clips and projects in the cloud</p>
                  </div>
                  <Switch
                    checked={cloudStorageEnabled}
                    onCheckedChange={setCloudStorageEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Storage Usage</Label>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {storageUsed.toFixed(1)} GB of {storageLimit} GB
                    </span>
                  </div>
                  <Progress value={storagePercentage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Auto-Save Interval</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      max="60"
                      value={autoSaveInterval}
                      onChange={(e) => setAutoSaveInterval(parseInt(e.target.value) || 5)}
                      className="w-20"
                    />
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">minutes</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Database className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Your data is securely stored and encrypted
                  </span>
                </div>
              </div>
            </PremiumFeature>
          </div>
        </div>
      </CardContent>

      {success && (
        <Alert className="mx-6 mb-4 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <CardFooter className="flex justify-end border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-6 py-4">
        <Button
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  )
}