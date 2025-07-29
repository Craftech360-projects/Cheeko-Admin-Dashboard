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
import { useLoginHistory, useUpdateLoginHistory, useDeleteLoginHistory } from '@/hooks/use-login-history'
import type { LoginHistory } from '@/types/database'
import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Flag, FlagOff, Trash2, MapPin, Monitor, Clock, AlertTriangle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export default function LoginHistoryPage() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<LoginHistory | null>(null)

  const { data: historyResponse, isLoading, error, refetch } = useLoginHistory()
  const updateHistoryMutation = useUpdateLoginHistory()
  const deleteHistoryMutation = useDeleteLoginHistory()

  const handleToggleSuspicious = async (record: LoginHistory) => {
    const response = await updateHistoryMutation.mutateAsync({
      id: record.id,
      updates: { is_suspicious: !record.is_suspicious }
    })
    if (!response.success) {
      // Handle error - could show toast notification
      console.error('Failed to update suspicious flag:', response.error)
    }
  }

  const handleDelete = (record: LoginHistory) => {
    setSelectedRecord(record)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedRecord) return
    
    const response = await deleteHistoryMutation.mutateAsync(selectedRecord.id)
    if (response.success) {
      setDeleteDialogOpen(false)
      setSelectedRecord(null)
    }
  }

  const formatDuration = (duration: string | null) => {
    if (!duration) return '-'
    
    // Convert PostgreSQL interval to readable format
    const match = duration.match(/(\d+):(\d+):(\d+)/)
    if (match) {
      const [, hours, minutes, seconds] = match
      if (parseInt(hours) > 0) {
        return `${hours}h ${minutes}m`
      } else if (parseInt(minutes) > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }
    }
    return duration
  }

  const columns: ColumnDef<LoginHistory>[] = [
    {
      accessorKey: 'user_id',
      header: 'User ID',
      cell: ({ row }) => {
        const userId = row.getValue('user_id') as string
        return (
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {userId.substring(0, 8)}...
          </code>
        )
      },
    },
    {
      accessorKey: 'login_time',
      header: 'Login Time',
      cell: ({ row }) => {
        const date = new Date(row.getValue('login_time') as string)
        return (
          <div className="space-y-1">
            <div className="text-sm">{date.toLocaleDateString()}</div>
            <div className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</div>
          </div>
        )
      },
    },
    {
      accessorKey: 'ip_address',
      header: 'IP Address',
      cell: ({ row }) => {
        const ip = row.getValue('ip_address') as string
        return ip ? (
          <code className="text-xs bg-muted px-2 py-1 rounded">{ip}</code>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const location = row.getValue('location') as string
        return location ? (
          <div className="flex items-center gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{location}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'device_info',
      header: 'Device',
      cell: ({ row }) => {
        const device = row.getValue('device_info') as string
        return device ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 cursor-help">
                  <Monitor className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[100px]">{device}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{device}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'session_duration',
      header: 'Duration',
      cell: ({ row }) => {
        const duration = row.getValue('session_duration') as string
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{formatDuration(duration)}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'is_suspicious',
      header: 'Status',
      cell: ({ row }) => {
        const isSuspicious = row.getValue('is_suspicious') as boolean
        return (
          <div className="flex items-center gap-2">
            {isSuspicious ? (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Suspicious
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                Normal
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const record = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => handleToggleSuspicious(record)}
                disabled={updateHistoryMutation.isPending}
              >
                {record.is_suspicious ? (
                  <>
                    <FlagOff className="mr-2 h-4 w-4" />
                    Mark as Normal
                  </>
                ) : (
                  <>
                    <Flag className="mr-2 h-4 w-4" />
                    Flag as Suspicious
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(record)}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Record
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
          <LoadingState message="Loading login history..." />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  if (error || !historyResponse?.success) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <ErrorState 
            message={historyResponse?.error || 'Failed to load login history'} 
            onRetry={refetch}
          />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  const history = historyResponse.data || []
  const suspiciousCount = history.filter(h => h.is_suspicious).length

  return (
    <RouteGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Login History</h1>
              <p className="text-muted-foreground">
                Monitor user login activity for security and diagnostic purposes ({history.length} total)
              </p>
            </div>
            <div className="flex items-center gap-4">
              {suspiciousCount > 0 && (
                <Badge variant="destructive" className="text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {suspiciousCount} Suspicious
                </Badge>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">{history.length}</div>
              <div className="text-sm text-muted-foreground">Total Logins</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-red-600">{suspiciousCount}</div>
              <div className="text-sm text-muted-foreground">Suspicious</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{history.length - suspiciousCount}</div>
              <div className="text-sm text-muted-foreground">Normal</div>
            </div>
            <div className="bg-card p-4 rounded-lg border">
              <div className="text-2xl font-bold">
                {history.length > 0 ? new Set(history.map(h => h.user_id)).size : 0}
              </div>
              <div className="text-sm text-muted-foreground">Unique Users</div>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={history}
            searchKey="ip_address"
            searchPlaceholder="Search by IP address..."
          />

          {/* Delete Confirmation */}
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Login Record"
            description={`Are you sure you want to delete this login record? This action cannot be undone and may be required for compliance purposes.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDelete}
          />
        </div>
      </DashboardLayout>
    </RouteGuard>
  )
}