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
import { useActivatedToys, useCreateActivatedToy, useUpdateActivatedToy, useDeleteActivatedToy } from '@/hooks/use-activated-toys'
import { CreateActivatedToyForm } from '@/components/forms/create-activated-toy-form'
import { EditActivatedToyForm } from '@/components/forms/edit-activated-toy-form'
import type { Toy } from '@/types/database'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ActivatedToysPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedToy, setSelectedToy] = useState<Toy | null>(null)

  const { data: toysResponse, isLoading, error, refetch } = useActivatedToys()
  const createToyMutation = useCreateActivatedToy()
  const updateToyMutation = useUpdateActivatedToy()
  const deleteToyMutation = useDeleteActivatedToy()

  const handleView = (toy: Toy) => {
    setSelectedToy(toy)
    setViewDialogOpen(true)
  }

  const handleEdit = (toy: Toy) => {
    setSelectedToy(toy)
    setEditDialogOpen(true)
  }

  const handleDelete = (toy: Toy) => {
    setSelectedToy(toy)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedToy) return
    
    const response = await deleteToyMutation.mutateAsync(selectedToy.id)
    if (response.success) {
      setDeleteDialogOpen(false)
      setSelectedToy(null)
    }
  }

  const columns: ColumnDef<Toy>[] = [
    {
      accessorKey: 'name',
      header: 'Toy Name',
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
    },
    {
      accessorKey: 'kid_name',
      header: 'Kid Name',
      cell: ({ row }) => {
        const kidName = row.getValue('kid_name') as string
        return kidName || <span className="text-muted-foreground">-</span>
      },
    },
    {
      accessorKey: 'role_type',
      header: 'Role',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('role_type')}
        </Badge>
      ),
    },
    {
      accessorKey: 'language',
      header: 'Language',
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('language')}
        </Badge>
      ),
    },
    {
      accessorKey: 'voice',
      header: 'Voice',
      cell: ({ row }) => (
        <span className="text-sm capitalize">{row.getValue('voice')}</span>
      ),
    },
    {
      accessorKey: 'toy_mac_id',
      header: 'MAC ID',
      cell: ({ row }) => {
        const macId = row.getValue('toy_mac_id') as string
        return macId ? (
          <code className="text-xs bg-muted px-2 py-1 rounded">{macId}</code>
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
              <DropdownMenuItem onClick={() => handleView(toy)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
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
          <LoadingState message="Loading activated toys..." />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  if (error || !toysResponse?.success) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <ErrorState 
            message={toysResponse?.error || 'Failed to load activated toys'} 
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
              <h1 className="text-3xl font-bold">Activated Toys</h1>
              <p className="text-muted-foreground">
                Manage detailed profiles for toys that have been activated ({toys.length} total)
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Activated Toy
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Activated Toy Profile</DialogTitle>
                  <DialogDescription>
                    Create a new activated toy profile with detailed configuration.
                  </DialogDescription>
                </DialogHeader>
                <CreateActivatedToyForm
                  onSuccess={() => setCreateDialogOpen(false)}
                  isLoading={createToyMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          <DataTable
            columns={columns}
            data={toys}
            searchKey="name"
            searchPlaceholder="Search by toy name..."
          />

          {/* View Details Dialog */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Toy Details</DialogTitle>
                <DialogDescription>
                  Complete information for {selectedToy?.name}
                </DialogDescription>
              </DialogHeader>
              {selectedToy && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Toy Name</label>
                      <p className="text-sm text-muted-foreground">{selectedToy.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Kid Name</label>
                      <p className="text-sm text-muted-foreground">{selectedToy.kid_name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Kid Age</label>
                      <p className="text-sm text-muted-foreground">{selectedToy.kid_age || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date of Birth</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedToy.DOB ? new Date(selectedToy.DOB).toLocaleDateString() : 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role Type</label>
                      <p className="text-sm text-muted-foreground">{selectedToy.role_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Language</label>
                      <p className="text-sm text-muted-foreground">{selectedToy.language}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Voice</label>
                      <p className="text-sm text-muted-foreground">{selectedToy.voice}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">MAC ID</label>
                      <p className="text-sm text-muted-foreground font-mono">{selectedToy.toy_mac_id || 'Not set'}</p>
                    </div>
                  </div>
                  {selectedToy.additional_instructions && (
                    <div>
                      <label className="text-sm font-medium">Additional Instructions</label>
                      <p className="text-sm text-muted-foreground mt-1 p-3 bg-muted rounded">
                        {selectedToy.additional_instructions}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Activated Toy</DialogTitle>
                <DialogDescription>
                  Update the toy profile and configuration.
                </DialogDescription>
              </DialogHeader>
              {selectedToy && (
                <EditActivatedToyForm
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
            title="Delete Activated Toy"
            description={`Are you sure you want to delete the toy profile "${selectedToy?.name}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDelete}
          />
        </div>
      </DashboardLayout>
    </RouteGuard>
  )
}