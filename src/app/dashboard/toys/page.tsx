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
import { useAllToys, useCreateToy, useUpdateToy, useDeleteToy } from '@/hooks/use-mqtt-auth'
import { CreateToyForm } from '@/components/forms/create-toy-form'
import { EditToyForm } from '@/components/forms/edit-toy-form'
import type { MqttAuth } from '@/types/database'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AllToysPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedToy, setSelectedToy] = useState<MqttAuth | null>(null)

  const { data: toysResponse, isLoading, error, refetch } = useAllToys()
  const createToyMutation = useCreateToy()
  const updateToyMutation = useUpdateToy()
  const deleteToyMutation = useDeleteToy()

  const handleEdit = (toy: MqttAuth) => {
    setSelectedToy(toy)
    setEditDialogOpen(true)
  }

  const handleDelete = (toy: MqttAuth) => {
    setSelectedToy(toy)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedToy) return
    
    const response = await deleteToyMutation.mutateAsync(selectedToy.mac_id)
    if (response.success) {
      setDeleteDialogOpen(false)
      setSelectedToy(null)
    }
  }

  const columns: ColumnDef<MqttAuth>[] = [
    {
      accessorKey: 'mac_id',
      header: 'MAC ID',
      cell: ({ row }) => (
        <code className="text-sm bg-muted px-2 py-1 rounded">
          {row.getValue('mac_id')}
        </code>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      cell: ({ row }) => {
        const isActive = row.getValue('is_active') as boolean
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'activation_code',
      header: 'Activation Code',
      cell: ({ row }) => {
        const code = row.getValue('activation_code') as string
        return code ? (
          <code className="text-sm bg-muted px-2 py-1 rounded">{code}</code>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Created',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string
        return date ? new Date(date).toLocaleDateString() : '-'
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const toy = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(toy)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(toy)}
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
          <LoadingState message="Loading toys..." />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  if (error || !toysResponse?.success) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <ErrorState 
            message={toysResponse?.error || 'Failed to load toys'} 
            onRetry={refetch}
          />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  const toys = toysResponse.data || []

  return (
    <RouteGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">All Toys</h1>
              <p className="text-muted-foreground">
                Manage all registered toys in the system ({toys.length} total)
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Toy
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Toy</DialogTitle>
                  <DialogDescription>
                    Create a new toy registration. MAC ID and activation code will be generated automatically.
                  </DialogDescription>
                </DialogHeader>
                <CreateToyForm
                  onSuccess={() => setCreateDialogOpen(false)}
                  isLoading={createToyMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          <DataTable
            columns={columns}
            data={toys}
            searchKey="mac_id"
            searchPlaceholder="Search by MAC ID..."
          />

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Toy</DialogTitle>
                <DialogDescription>
                  Update toy details and activation status.
                </DialogDescription>
              </DialogHeader>
              {selectedToy && (
                <EditToyForm
                  toy={selectedToy}
                  onSuccess={() => setEditDialogOpen(false)}
                  isLoading={updateToyMutation.isPending}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Toy"
            description={`Are you sure you want to delete toy ${selectedToy?.mac_id}? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDelete}
          />
        </div>
      </DashboardLayout>
    </RouteGuard>
  )
}