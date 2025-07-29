'use client'

import { useState } from 'react'
import { RouteGuard } from '@/components/auth/route-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-spinner'
import { ErrorState } from '@/components/ui/error-state'
import { Badge } from '@/components/ui/badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useBugReports, useCreateBugReport, useUpdateBugReport, useDeleteBugReport } from '@/hooks/use-bug-reports'
import { CreateBugReportForm } from '@/components/forms/create-bug-report-form'
import { EditBugReportForm } from '@/components/forms/edit-bug-report-form'
import type { BugReport, BugStatus, BugSeverity } from '@/types/database'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Edit, Trash2, MoreHorizontal, Eye, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const statusIcons = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle,
  closed: XCircle,
}

const statusColors = {
  open: 'destructive',
  in_progress: 'default',
  resolved: 'secondary',
  closed: 'outline',
} as const

const severityColors = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
  critical: 'destructive',
} as const

export default function BugReportsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null)

  const { data: bugsResponse, isLoading, error, refetch } = useBugReports()
  const createBugMutation = useCreateBugReport()
  const updateBugMutation = useUpdateBugReport()
  const deleteBugMutation = useDeleteBugReport()

  const handleStatusChange = async (bug: BugReport, newStatus: BugStatus) => {
    const response = await updateBugMutation.mutateAsync({
      id: bug.id,
      updates: { status: newStatus }
    })
    if (!response.success) {
      console.error('Failed to update bug status:', response.error)
    }
  }

  const handleSeverityChange = async (bug: BugReport, newSeverity: BugSeverity) => {
    const response = await updateBugMutation.mutateAsync({
      id: bug.id,
      updates: { severity: newSeverity }
    })
    if (!response.success) {
      console.error('Failed to update bug severity:', response.error)
    }
  }

  const handleView = (bug: BugReport) => {
    setSelectedBug(bug)
    setViewDialogOpen(true)
  }

  const handleEdit = (bug: BugReport) => {
    setSelectedBug(bug)
    setEditDialogOpen(true)
  }

  const handleDelete = (bug: BugReport) => {
    setSelectedBug(bug)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedBug) return
    
    const response = await deleteBugMutation.mutateAsync(selectedBug.id)
    if (response.success) {
      setDeleteDialogOpen(false)
      setSelectedBug(null)
    }
  }

  const columns: ColumnDef<BugReport>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="font-medium max-w-[200px] truncate">
          {row.getValue('title')}
        </div>
      ),
    },
    {
      accessorKey: 'severity',
      header: 'Severity',
      cell: ({ row }) => {
        const severity = row.getValue('severity') as BugSeverity
        const bug = row.original
        return (
          <Select
            value={severity}
            onValueChange={(value: BugSeverity) => handleSeverityChange(bug, value)}
            disabled={updateBugMutation.isPending}
          >
            <SelectTrigger className="w-[100px] h-8">
              <SelectValue>
                <Badge variant={severityColors[severity]} className="text-xs">
                  {severity}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as BugStatus
        const bug = row.original
        const StatusIcon = statusIcons[status]
        
        return (
          <Select
            value={status}
            onValueChange={(value: BugStatus) => handleStatusChange(bug, value)}
            disabled={updateBugMutation.isPending}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue>
                <Badge variant={statusColors[status]} className="text-xs">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.replace('_', ' ')}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        )
      },
    },
    {
      accessorKey: 'bug_category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.getValue('bug_category') as string
        return category ? (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'platform',
      header: 'Platform',
      cell: ({ row }) => {
        const platform = row.getValue('platform') as string
        return platform || <span className="text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.getValue('created_at') as string)
        return (
          <div className="text-sm">
            {date.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const bug = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleView(bug)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(bug)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(bug)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <LoadingState message="Loading bug reports..." />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  if (error || !bugsResponse?.success) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <ErrorState 
            message={bugsResponse?.error || 'Failed to load bug reports'} 
            onRetry={refetch}
          />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  const bugs = bugsResponse.data || []
  const openBugs = bugs.filter(b => b.status === 'open').length
  const criticalBugs = bugs.filter(b => b.severity === 'critical').length

  return (
    <RouteGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Bug Reports</h1>
              <p className="text-muted-foreground">
                Track and manage bugs reported by users ({bugs.length} total)
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Report Bug
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Bug Report</DialogTitle>
                  <DialogDescription>
                    Report a new bug or issue in the system.
                  </DialogDescription>
                </DialogHeader>
                <CreateBugReportForm
                  onSuccess={() => setCreateDialogOpen(false)}
                  isLoading={createBugMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{bugs.length}</div>
              <div className="text-sm text-muted-foreground">Total Reports</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{openBugs}</div>
              <div className="text-sm text-muted-foreground">Open</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">{criticalBugs}</div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {bugs.filter(b => b.status === 'resolved').length}
              </div>
              <div className="text-sm text-muted-foreground">Resolved</div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={bugs}
            searchKey="title"
            searchPlaceholder="Search by title..."
          />

          {/* View Details Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Bug Report Details</DialogTitle>
                <DialogDescription>
                  Complete information for bug #{selectedBug?.id}
                </DialogDescription>
              </DialogHeader>
              {selectedBug && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <p className="text-sm text-muted-foreground">{selectedBug.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge variant={statusColors[selectedBug.status]} className="text-xs ml-2">
                        {selectedBug.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Severity</label>
                      <Badge variant={severityColors[selectedBug.severity]} className="text-xs ml-2">
                        {selectedBug.severity}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <p className="text-sm text-muted-foreground">{selectedBug.bug_category || 'Not categorized'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded whitespace-pre-wrap">
                      {selectedBug.description}
                    </p>
                  </div>

                  {selectedBug.steps_to_reproduce && (
                    <div>
                      <label className="text-sm font-medium">Steps to Reproduce</label>
                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded whitespace-pre-wrap">
                        {selectedBug.steps_to_reproduce}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Platform</label>
                      <p className="text-sm text-muted-foreground">{selectedBug.platform || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">App Version</label>
                      <p className="text-sm text-muted-foreground">{selectedBug.app_version || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Device Model</label>
                      <p className="text-sm text-muted-foreground">{selectedBug.device_model || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">OS Version</label>
                      <p className="text-sm text-muted-foreground">{selectedBug.os_version || 'Not specified'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <strong>Created:</strong> {new Date(selectedBug.created_at).toLocaleString()}
                    </div>
                    <div>
                      <strong>Updated:</strong> {new Date(selectedBug.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Bug Report</DialogTitle>
                <DialogDescription>
                  Update bug report details and status.
                </DialogDescription>
              </DialogHeader>
              {selectedBug && (
                <EditBugReportForm
                  bug={selectedBug}
                  onSuccess={() => setEditDialogOpen(false)}
                  isLoading={updateBugMutation.isPending}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Bug Report"
            description={`Are you sure you want to delete bug report "${selectedBug?.title}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDelete}
          />
        </div>
      </DashboardLayout>
    </RouteGuard>
  )
}