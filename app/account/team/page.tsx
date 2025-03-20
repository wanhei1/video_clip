"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SubscriptionBadge } from "@/components/subscription-badge"
import { BrandLogo } from "@/components/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Users, UserPlus, Share2, Globe, Lock, Mail, Copy, Check, Clock, AlertCircle } from "lucide-react"

type TeamMember = {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "editor" | "viewer"
  status: "online" | "offline"
  lastActive?: string
}

type SharedProject = {
  id: string
  name: string
  owner: string
  visibility: "private" | "team" | "public"
  updatedAt: string
  members: number
}

export default function TeamPage() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("members")
  const [inviteEmail, setInviteEmail] = useState("")
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Mock data for team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "You",
      email: user?.email || "you@example.com",
      role: "owner",
      status: "online",
    },
    {
      id: "2",
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "/placeholder-user.jpg",
      role: "editor",
      status: "online",
      lastActive: "Just now",
    },
    {
      id: "3",
      name: "Sam Wilson",
      email: "sam@example.com",
      role: "viewer",
      status: "offline",
      lastActive: "2 hours ago",
    },
  ])

  // Mock data for shared projects
  const [sharedProjects, setSharedProjects] = useState<SharedProject[]>([
    {
      id: "1",
      name: "Competition Analysis 2023",
      owner: "You",
      visibility: "team",
      updatedAt: "2 days ago",
      members: 3,
    },
    {
      id: "2",
      name: "Training Analysis - Junior Championships",
      owner: "Alex Johnson",
      visibility: "private",
      updatedAt: "1 week ago",
      members: 2,
    },
  ])

  const handleInviteMember = () => {
    setError(null)

    if (!inviteEmail.trim()) {
      setError("Email address is required")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      setError("Please enter a valid email address")
      return
    }

    // 模拟邀请成功
    setSuccess(`Invitation sent to ${inviteEmail}`)
    setInviteEmail("")
    setShowInviteDialog(false)

    // 清除成功消息
    setTimeout(() => {
      setSuccess(null)
    }, 3000)
  }

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id))
    setSuccess("Team member removed successfully")

    // 清除成功消息
    setTimeout(() => {
      setSuccess(null)
    }, 3000)
  }

  const handleChangeRole = (id: string, newRole: "owner" | "editor" | "viewer") => {
    setTeamMembers(teamMembers.map(member =>
      member.id === id ? { ...member, role: newRole } : member
    ))
    setSuccess("Role updated successfully")

    // 清除成功消息
    setTimeout(() => {
      setSuccess(null)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-slate-50 to-zinc-100 dark:from-zinc-950 dark:via-slate-950 dark:to-zinc-900 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.02] pointer-events-none"></div>

      {/* Gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>

      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="container flex h-16 items-center justify-between py-4">
          <BrandLogo animated />
          <div className="flex items-center gap-4">
            <SubscriptionBadge tier={user?.subscriptionTier || "free"} />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container max-w-4xl py-12 relative z-10">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-zinc-600 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 mb-4 transition-colors"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-500" />
                Team Management
              </h1>
              <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Manage your team members, roles, and shared projects
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Card className="border-zinc-200/50 bg-white/90 backdrop-blur-sm shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/90">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Team Management
                <SubscriptionBadge tier="team" size="sm" />
              </CardTitle>
            </div>
            <CardDescription>
              Manage your team members, roles, and collaboration settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="members">Team Members</TabsTrigger>
                <TabsTrigger value="projects">Shared Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Team Members ({teamMembers.length})</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInviteDialog(true)}
                    className="flex items-center gap-1"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Invite Member
                  </Button>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                              {member.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {member.name}
                              {member.status === "online" ? (
                                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                                  <Clock className="h-3 w-3" />
                                  {member.lastActive}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-zinc-500 dark:text-zinc-400">{member.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={member.role === "owner" ? "default" : member.role === "editor" ? "outline" : "secondary"}
                            className="capitalize"
                          >
                            {member.role}
                          </Badge>

                          {member.id !== "1" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Shared Projects ({sharedProjects.length})</h3>
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-3">
                    {sharedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{project.name}</div>
                          <Badge
                            variant={project.visibility === "public" ? "default" : project.visibility === "team" ? "outline" : "secondary"}
                            className="capitalize flex items-center gap-1"
                          >
                            {project.visibility === "public" ? (
                              <Globe className="h-3 w-3" />
                            ) : project.visibility === "team" ? (
                              <Users className="h-3 w-3" />
                            ) : (
                              <Lock className="h-3 w-3" />
                            )}
                            {project.visibility}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-2">
                            <span>Owner: {project.owner}</span>
                            <span>•</span>
                            <span>{project.members} members</span>
                          </div>
                          <span>Updated {project.updatedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}