'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateParentProfile } from '@/hooks/use-parent-profiles'
import type { ParentProfile, UpdateParentProfileData } from '@/types/database'

interface EditParentFormProps {
  parent: ParentProfile
  onSuccess: () => void
  isLoading: boolean
}

export function EditParentForm({ parent, onSuccess, isLoading }: EditParentFormProps) {
  const [parentName, setParentName] = useState(parent.parent_name || '')
  const [parentEmail, setParentEmail] = useState(parent.parent_email || '')
  const [parentPhoneNumber, setParentPhoneNumber] = useState(parent.parent_phone_number || '')
  const [error, setError] = useState('')

  const updateParentMutation = useUpdateParentProfile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const updates: UpdateParentProfileData = {
      parent_name: parentName || null,
      parent_email: parentEmail || null,
      parent_phone_number: parentPhoneNumber || null,
    }

    try {
      const response = await updateParentMutation.mutateAsync({
        id: parent.id,
        updates,
      })
      
      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to update parent profile')
      }
    } catch (err) {
      console.error('Update parent error:', err)
      setError('An unexpected error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="parent_name">Parent Name</Label>
        <Input
          id="parent_name"
          placeholder="Enter parent name"
          value={parentName}
          onChange={(e) => setParentName(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_email">Email</Label>
        <Input
          id="parent_email"
          type="email"
          placeholder="Enter email address"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_phone_number">Phone Number</Label>
        <Input
          id="parent_phone_number"
          placeholder="Enter phone number"
          value={parentPhoneNumber}
          onChange={(e) => setParentPhoneNumber(e.target.value)}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  )
}