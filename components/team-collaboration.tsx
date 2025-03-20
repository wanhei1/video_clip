"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertCircle, Users, UserPlus, Share2, Globe, Lock, Mail, Copy, Check, Clock, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUser } from "@/contexts/user-context"
import { PremiumFeature } from "@/components/premium-feature"
import { SubscriptionBadge } from "@/components/subscription-badge"

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

interface TeamCollaborationProps {}

export function TeamCollaboration({}: TeamCollaborationProps) {
  const { user } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("team")
  const [inviteEmail, setInviteEmail] = useState("")
  const [shareLink, setShareLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
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

  const handleInviteMember = useCallback(() => {
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
  }, [inviteEmail])

  const handleShareProject = useCallback(() => {
    // 生成分享链接
    const link = `https://clipapp.example.com/shared/project-${crypto.randomUUID().slice(0, 8)}`
    setShareLink(link)
    setShowShareDialog(true)
  }, [])

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(shareLink)
    setLinkCopied(true)

    setTimeout(() => {
      setLinkCopied(false)
    }, 2000)
  }, [shareLink])

  return (
    <PremiumFeature requiredTier="team">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Team Collaboration
              <SubscriptionBadge tier="team" size="sm" />
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/account/team')}
              className="flex items-center gap-1"
            >
              <Settings className="h-3.5 w-3.5" />
              Manage Team
            </Button>
          </div>
          <CardDescription>
            Share projects with your team and collaborate in real-time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="team">Team Members</TabsTrigger>
              <TabsTrigger value="projects">Shared Projects</TabsTrigger>
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

            <TabsContent value="team" className="space-y-4">
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

              <ScrollArea className="h-[300px] pr-4">
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
                      <Badge
                        variant={member.role === "owner" ? "default" : member.role === "editor" ? "outline" : "secondary"}
                        className="capitalize"
                      >
                        {member.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Shared Projects ({sharedProjects.length})</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareProject}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share Project
                </Button>
              </div>

              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {sharedProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Owner: {project.owner} · Updated {project.updatedAt}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {project.visibility === "private" ? (
                            <>
                              <Lock className="h-3 w-3" />
                              Private
                            </>
                          ) : project.visibility === "team" ? (
                            <>
                              <Users className="h-3 w-3" />
                              Team
                            </>
                          ) : (
                            <>
                              <Globe className="h-3 w-3" />
                              Public
                            </>
                          )}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400">
                          <Users className="h-3.5 w-3.5" />
                          {project.members} members
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                          Open Project
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Invite Member Dialog */}
          <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to collaborate on your projects
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-zinc-500" />
                    <Input
                      id="invite-email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Permission Level</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center p-2 border rounded-md border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <Lock className="h-4 w-4 mb-1" />
                      <span className="text-sm font-medium">Viewer</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Can view only</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 border-2 rounded-md border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20">
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Editor</span>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400">Can edit</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 border rounded-md border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <Globe className="h-4 w-4 mb-1" />
                      <span className="text-sm font-medium">Admin</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Full access</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>Cancel</Button>
                <Button onClick={handleInviteMember}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Share Project Dialog */}
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Project</DialogTitle>
                <DialogDescription>
                  Share your project with team members or via link
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Share Link</Label>
                  <div className="flex items-center gap-2">
                    <Input value={shareLink} readOnly className="flex-1" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyShareLink}
                      className="flex items-center gap-1 min-w-[80px]"
                    >
                      {linkCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center p-2 border rounded-md border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <Lock className="h-4 w-4 mb-1" />
                      <span className="text-sm font-medium">Private</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Only invited</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 border-2 rounded-md border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20">
                      <Users className="h-4 w-4 mb-1 text-indigo-700 dark:text-indigo-300" />
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Team</span>
                      <span className="text-xs text-indigo-600 dark:text-indigo-400">All team members</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2 border rounded-md border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                      <Globe className="h-4 w-4 mb-1" />
                      <span className="text-sm font-medium">Public</span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">Anyone with link</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowShareDialog(false)}>Cancel</Button>
                <Button onClick={handleInviteMember}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </PremiumFeature>
  );
}