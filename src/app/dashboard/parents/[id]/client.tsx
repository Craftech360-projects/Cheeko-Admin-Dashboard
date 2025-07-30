'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RouteGuard } from '@/components/auth/route-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/ui/loading-spinner'
import { ErrorState } from '@/components/ui/error-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowLeft, Edit, Trash2, Mail, Phone, User, Calendar } from 'lucide-react'
import { useParentProfile, useUpdateParentProfile, useDeleteParentProfile } from '@/hooks/use-parent-profiles'
import { EditParentForm } from '@/components/forms/edit-parent-form'

interface ParentDetailsClientProps {
  id: string
}

export function ParentDetailsClient({ id }: ParentDetailsClientProps) {
  const router = useRouter()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  const { data: profileResponse, isLoading, error, refetch } = useParentProfile(id)
  const updateParentMutation = useUpdateParentProfile()
  const deleteParentMutation = useDeleteParentProfile()

  const parentProfile = profileResponse?.data

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!parentProfile) return
    
    const response = await deleteParentMutation.mutateAsync(parentProfile.id)
    if (response.success) {
      router.push('/dashboard/parents')
    }
  }

  if (isLoading) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <LoadingState message="Loading parent details..." />
        </DashboardLayout>
      </RouteGuard>
    )
  }

  if (error || !profileResponse?.success || !parentProfile) {
    return (
      <RouteGuard>
        <DashboardLayout>
          <ErrorState 
            message={profileResponse?.error || 'Failed to load parent details'} 
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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Parent Details</h1>
                <p className="text-muted-foreground">
                  View and manage parent profile information
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Parent profile details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p className="text-lg">{parentProfile.parent_name || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p className="text-lg">{parentProfile.parent_email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="text-lg">{parentProfile.parent_phone_number || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Created At</p>
                    <p className="text-lg">
                      {new Date(parentProfile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">User ID</p>
                    <p className="text-sm font-mono text-muted-foreground">
                      {parentProfile.user_id || 'Not linked to user'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Parent Profile</DialogTitle>
                <DialogDescription>
                  Update parent profile information
                </DialogDescription>
              </DialogHeader>
              <EditParentForm
                parent={parentProfile}
                onSuccess={() => {
                  setEditDialogOpen(false)
                  refetch()
                }}
                isLoading={updateParentMutation.isPending}
              />
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation */}
          <ConfirmDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            title="Delete Parent Profile"
            description={`Are you sure you want to delete ${parentProfile.parent_name || 'this parent profile'}? This action cannot be undone.`}
            confirmText="Delete"
            variant="destructive"
            onConfirm={confirmDelete}
          />
        </div>
      </DashboardLayout>
    </RouteGuard>
  )
}