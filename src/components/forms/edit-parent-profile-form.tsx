'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUpdateParentProfile } from '@/hooks/use-parent-profiles'
import type { ParentProfile, UpdateParentProfileData } from '@/types/database'

interface EditParentProfileFormProps {
  profile: ParentProfile
  onSuccess: () => void
  isLoading: boolean
}

export function EditParentProfileForm({ profile, onSuccess, isLoading }: EditParentProfileFormProps) {
  const [formData, setFormData] = useState({
    parent_name: profile.parent_name || '',
    parent_email: profile.parent_email || '',
    parent_phone_number: profile.parent_phone_number || ''
  })
  const [error, setError] = useState('')

  const updateProfileMutation = useUpdateParentProfile()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Basic validation
    if (!formData.parent_name && !formData.parent_email && !formData.parent_phone_number) {
      setError('Please provide at least a name, email, or phone number')
      return
    }

    // Email validation
    if (formData.parent_email && !formData.parent_email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    const updates: UpdateParentProfileData = {
      parent_name: formData.parent_name || null,
      parent_email: formData.parent_email || null,
      parent_phone_number: formData.parent_phone_number || null,
    }

    try {
      const response = await updateProfileMutation.mutateAsync({
        id: profile.id,
        updates
      })
      
      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to update parent profile')
      }
    } catch (err) {
      console.error('Update parent profile error:', err)
      setError('An unexpected error occurred')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="parent_name">Parent Name</Label>
        <Input
          id="parent_name"
          value={formData.parent_name}
          onChange={(e) => handleInputChange('parent_name', e.target.value)}
          disabled={isLoading}
          placeholder="Enter parent's full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_email">Email Address</Label>
        <Input
          id="parent_email"
          type="email"
          value={formData.parent_email}
          onChange={(e) => handleInputChange('parent_email', e.target.value)}
          disabled={isLoading}
          placeholder="parent@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="parent_phone_number">Phone Number</Label>
        <Input
          id="parent_phone_number"
          type="tel"
          value={formData.parent_phone_number}
          onChange={(e) => handleInputChange('parent_phone_number', e.target.value)}
          disabled={isLoading}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label>User ID</Label>
        <Input 
          value={profile.user_id || 'Not linked'} 
          disabled 
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          User ID cannot be changed after creation
        </p>
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
        <strong>Created:</strong> {new Date(profile.created_at).toLocaleString()}
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