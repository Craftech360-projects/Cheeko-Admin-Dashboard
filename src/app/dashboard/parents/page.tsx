'use client'

import { useState, useMemo } from 'react'
import { RouteGuard } from '@/components/auth/route-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DataTable } from '@/components/ui/data-table'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-spinner'
import { ErrorState } from '@/components/ui/error-state'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useParentProfiles, useCreateParentProfile, useUpdateParentProfile, useDeleteParentProfile } from '@/hooks/use-parent-profiles'
import { CreateParentProfileForm } from '@/components/forms/create-parent-profile-form'
import { EditParentProfileForm } from '@/components/forms/edit-parent-profile-form'
import type { ParentProfile } from '@/types/database'
import type { ColumnDef } from '@tanstack/react-table'
import { Plus, Edit, Trash2, MoreHorizontal, Mail, Phone } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ParentProfilesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<ParentProfile | null>(null)
  const [globalFilter, setGlobalFilter] = useState('')

  const { data: profilesResponse, isLoading, error, refetch } = useParentProfiles()
  const createProfileMutation = useCreateParentProfile()
  const updateProfileMutation = useUpdateParentProfile()
  const deleteProfileMutation = useDeleteParentProfile()

  const handleEdit = (profile: ParentProfile) => {
    setSelectedProfile(profile)
    setEditDialogOpen(true)
  }

  const handleDelete = (profile: ParentProfile) => {
    setSelectedProfile(profile)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedProfile) return
    
    const response = await deleteProfileMutation.mutateAsync(selectedProfile.id)
    if (response.success) {
      setDeleteDialogOpen(false)
      setSelectedProfile(null)
    }
  }

  // Get profiles data with default empty array
  const profiles = useMemo(() => profilesResponse?.data || [], [profilesResponse?.data])

  // Filter profiles based on global filter
  const filteredProfiles = useMemo(() => {
    if (!globalFilter) return profiles
    
    const lowerFilter = globalFilter.toLowerCase()
    return profiles.filter(profile => {
      // Search in parent name
      if (profile.parent_name?.toLowerCase().includes(lowerFilter)) return true
      // Search in parent email
      if (profile.parent_email?.toLowerCase().includes(lowerFilter)) return true
      // Search in parent phone number
      if (profile.parent_phone_number?.toLowerCase().includes(lowerFilter)) return true
      
      return false
    })
  }, [profiles, globalFilter])

  const columns: ColumnDef<ParentProfile>[] = [
    {
      accessorKey: 'parent_name',
      header: 'Parent Name',
      cell: ({ row }) => {
        const name = row.getValue('parent_name') as string
        return (
          <div className="font-medium">
            {name || <span className="text-muted-foreground italic">No name</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'parent_email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('parent_email') as string
        return email ? (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{email}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'parent_phone_number',
      header: 'Phone',
      cell: ({ row }) => {
        const phone = row.getValue('parent_phone_number') as string
        return phone ? (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{phone}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'user_id',
      header: 'User ID',
      cell: ({ row }) => {
        const userId = row.getValue('user_id') as string
        return userId ? (
          <code className="text-xs bg-muted px-2 py-1 rounded">
            {userId.substring(0, 8)}...
          </code>
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
        return new Date(date).toLocaleDateString()
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const profile = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(profile)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDelete(profile)}
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
          <LoadingState message="Loading parent profiles..." />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  if (error || !profilesResponse?.success) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <ErrorState 
            message={profilesResponse?.error || 'Failed to load parent profiles'} 
            onRetry={refetch}
          />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Parent Profiles</h1>
              <p className="text-muted-foreground">
                Manage parent user profiles and contact information ({profiles.length} total)
              </p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Parent Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Parent Profile</DialogTitle>
                  <DialogDescription>
                    Create a new parent profile with contact information.
                  </DialogDescription>
                </DialogHeader>
                <CreateParentProfileForm
                  onSuccess={() => setCreateDialogOpen(false)}
                  isLoading={createProfileMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          <DataTable
            columns={columns}
            data={filteredProfiles}
            globalFilter={globalFilter}
            onGlobalFilterChange={setGlobalFilter}
            searchPlaceholder="Search by name, email, or phone..."
          />

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Parent Profile</DialogTitle>
                <DialogDescription>
                  Update parent contact details and information.
                </DialogDescription>
              </DialogHeader>
              {selectedProfile && (
                <EditParentProfileForm
                  profile={selectedProfile}
                  onSuccess={() => setEditDialogOpen(false)}
                  isLoading={updateProfileMutation.isPending}
                />
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Parent Profile"
            description={`Are you sure you want to delete the profile for "${selectedProfile?.parent_name || 'this parent'}"? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDelete}
          />
        </div>
      </DashboardLayout>
    </RouteGuard>
  )
}