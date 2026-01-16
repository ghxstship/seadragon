
"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { logger } from '@/lib/logger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  AlertTriangle,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export interface ApprovalLevel {
  id: string
  name: string
  approvers: Array<{
    id: string
    name: string
    email: string
    avatar?: string
  }>
  requiredApprovals: number
  isParallel?: boolean
}

export interface ApprovalStep {
  id: string
  levelId: string
  approverId: string
  status: 'pending' | 'approved' | 'rejected' | 'skipped'
  decisionAt?: Date
  comments?: string
  attachments?: Array<{
    id: string
    name: string
    url: string
    type: string
  }>
}

export interface ApprovalWorkflowProps {
  title: string
  description?: string
  requester: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  levels: ApprovalLevel[]
  steps: ApprovalStep[]
  currentUserId?: string
  onApprove?: (stepId: string, comments?: string, attachments?: File[]) => void
  onReject?: (stepId: string, comments?: string, attachments?: File[]) => void
  onEscalate?: (stepId: string, reason: string) => void
  className?: string
  showHistory?: boolean
  allowAttachments?: boolean
}

const ApprovalWorkflowForm = ({
  title,
  description,
  requester,
  levels,
  steps,
  currentUserId,
  onApprove,
  onReject,
  onEscalate,
  className,
  showHistory = true,
  allowAttachments = true
}: ApprovalWorkflowProps) => {
  const [selectedStep, setSelectedStep] = useState<ApprovalStep | null>(null)
  const [actionDialog, setActionDialog] = useState<{
    type: 'approve' | 'reject' | 'escalate'
    step: ApprovalStep | null
  } | null>(null)
  const [comments, setComments] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])

  const workflowStatus = useMemo(() => {
    const totalSteps = steps.length
    const completedSteps = steps.filter(s => s.status === 'approved' || s.status === 'rejected').length
    const approvedSteps = steps.filter(s => s.status === 'approved').length
    const rejectedSteps = steps.filter(s => s.status === 'rejected').length

    if (rejectedSteps > 0) return 'rejected'
    if (completedSteps === totalSteps && approvedSteps === totalSteps) return 'approved'
    if (completedSteps > 0) return 'in_progress'
    return 'pending'
  }, [steps])

  const currentPendingSteps = useMemo(() => {
    return steps.filter(step =>
      step.status === 'pending' &&
      levels.find(l => l.id === step.levelId)?.approvers.some(a => a.id === step.approverId) &&
      (!currentUserId || step.approverId === currentUserId)
    )
  }, [steps, levels, currentUserId])

  const getLevelStatus = useCallback((levelId: string) => {
    const levelSteps = steps.filter(s => s.levelId === levelId)
    const approved = levelSteps.filter(s => s.status === 'approved').length
    const rejected = levelSteps.filter(s => s.status === 'rejected').length
    const level = levels.find(l => l.id === levelId)

    if (!level) return 'unknown'

    if (rejected > 0) return 'rejected'
    if (approved >= level.requiredApprovals) return 'approved'
    if (levelSteps.some(s => s.status === 'approved' || s.status === 'pending')) return 'in_progress'
    return 'pending'
  }, [steps, levels])

  const getStepStatusIcon = (status: ApprovalStep['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-semantic-success"/>
      case 'rejected': return <XCircle className="w-4 h-4 text-semantic-error"/>
      case 'pending': return <Clock className="w-4 h-4 text-semantic-warning"/>
      case 'skipped': return <AlertTriangle className="w-4 h-4 text-muted-foreground"/>
    }
  }

  const getWorkflowStatusBadge = () => {
    switch (workflowStatus) {
      case 'approved':
        return <Badge className="bg-semantic-success text-primary-foreground">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'in_progress':
        return <Badge className="bg-semantic-info text-primary-foreground">In Progress</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const handleAction = useCallback(async (type: 'approve' | 'reject' | 'escalate') => {
    if (!actionDialog?.step) return

    try {
      if (type === 'approve') {
        await onApprove?.(actionDialog.step.id, comments, attachments)
      } else if (type === 'reject') {
        await onReject?.(actionDialog.step.id, comments, attachments)
      } else if (type === 'escalate') {
        await onEscalate?.(actionDialog.step.id, comments)
      }

      setActionDialog(null)
      setComments('')
      setAttachments([])
    } catch (error) {
      logger.error('Action failed', error)
    }
  }, [actionDialog, comments, attachments, onApprove, onReject, onEscalate])

  const progressPercentage = useMemo(() => {
    const completed = steps.filter(s => s.status === 'approved' || s.status === 'rejected').length
    return (completed / steps.length) * 100
  }, [steps])

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center space-x-3">
                <FileText className="w-5 h-5"/>
                <span>{title}</span>
              </CardTitle>
              {description && (
                <p className="text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            {getWorkflowStatusBadge()}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={requester.avatar}/>
                <AvatarFallback>
                  {requester.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{requester.name}</div>
                <div className="text-xs text-muted-foreground">Requester</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span className="ml-2 font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="w-24 h-2"/>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Approval Levels */}
      <div className="space-y-4">
        {levels.map((level, levelIndex) => {
          const levelStatus = getLevelStatus(level.id)
          const levelSteps = steps.filter(s => s.levelId === level.id)

          return (
            <Card key={level.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Level {levelIndex + 1}: {level.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      levelStatus === 'approved' ? 'default' :
                      levelStatus === 'rejected' ? 'destructive' :
                      levelStatus === 'in_progress' ? 'secondary' : 'outline'
                    }>
                      {levelStatus.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {level.approvers.length} approver{level.approvers.length !== 1 ? 's' : ''},
                      {level.requiredApprovals} required
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {levelSteps.map((step) => {
                    const approver = level.approvers.find(a => a.id === step.approverId)
                    const canAct = currentUserId === step.approverId && step.status === 'pending'

                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-colors",
                          step.status === 'approved' ? "bg-semantic-success/5 border-semantic-success/20" :
                          step.status === 'rejected' ? "bg-semantic-error/5 border-semantic-error/20" :
                          step.status === 'pending' ? "bg-semantic-warning/5 border-semantic-warning/20" :
                          "bg-muted/50 border-muted",
                          canAct && "ring-2 ring-accent-primary/20"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          {getStepStatusIcon(step.status)}
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={approver?.avatar}/>
                            <AvatarFallback>
                              {approver?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{approver?.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {step.decisionAt ? format(step.decisionAt, 'MMM d, yyyy h:mm a') : 'Pending'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {step.comments && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedStep(step)}
                            >
                              <MessageSquare className="w-4 h-4"/>
                            </Button>
                          )}

                          {canAct && (
                            <div className="flex items-center space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActionDialog({ type: 'approve', step })}
                                className="text-semantic-success border-semantic-success/20 hover:bg-semantic-success/10"
                              >
                                <CheckCircle className="w-4 h-4 mr-1"/>
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActionDialog({ type: 'reject', step })}
                                className="text-semantic-error border-semantic-error/20 hover:bg-semantic-error/10"
                              >
                                <XCircle className="w-4 h-4 mr-1"/>
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Dialog */}
      <Dialog
        open={!!actionDialog}
        onOpenChange={(open) => !open && setActionDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog?.type === 'approve' ? 'Approve Request' :
               actionDialog?.type === 'reject' ? 'Reject Request' :
               'Escalate Request'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog?.type === 'approve' ? 'Confirm approval of this request.' :
               actionDialog?.type === 'reject' ? 'Provide a reason for rejecting this request.' :
               'Provide a reason for escalating this request.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Comments (Optional)</label>
              <Textarea
                value={comments}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                placeholder="Add any comments or notes..."
                className="mt-1"/>
            </div>

            {allowAttachments && actionDialog?.type !== 'escalate' && (
              <div>
                <label className="text-sm font-medium">Attachments (Optional)</label>
                <Input
                  type="file"
                  multiple
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttachments(Array.from(e.target.files || []))}
                  className="mt-1 block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                    file:text-sm file:font-medium file:bg-accent-primary
                    file:text-primary-foreground hover:file:bg-accent-primary/90"/>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleAction(actionDialog!.type)}
              className={
                actionDialog?.type === 'approve' ? 'bg-semantic-success hover:bg-semantic-success/90' :
                actionDialog?.type === 'reject' ? 'bg-semantic-error hover:bg-semantic-error/90' : ''
              }
            >
              {actionDialog?.type === 'approve' ? 'Approve' :
               actionDialog?.type === 'reject' ? 'Reject' : 'Escalate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={!!selectedStep} onOpenChange={(open) => !open && setSelectedStep(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approval Comments</DialogTitle>
            <DialogDescription>
              Comments from {levels.find(l => l.id === selectedStep?.levelId)?.approvers.find(a => a.id === selectedStep?.approverId)?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">{selectedStep?.comments || 'No comments provided.'}</p>
            {selectedStep?.attachments && selectedStep.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Attachments:</h4>
                <div className="space-y-1">
                  {selectedStep.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.url}
                      className="text-sm text-accent-primary hover:underline flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3"/>
                      <span>{attachment.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setSelectedStep(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApprovalWorkflowForm
