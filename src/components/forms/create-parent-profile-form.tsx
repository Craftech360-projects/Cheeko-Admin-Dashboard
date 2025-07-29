'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateParentProfile } from '@/hooks/use-parent-profiles'
import type { CreateParentProfileData } from '@/types/database'

interface CreateParentProfileFormProps {
  onSuccess: () => void
  isLoading: boolean
}

export function CreateParentProfileForm({ onSuccess, isLoading }: CreateParentProfileFormProps) {
  const [formData, setFormData] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone_number: '',
    user_id: ''
  })
  const [error, setError] = useState('')

  const createProfileMutation = useCreateParentProfile()

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

    const profileData: CreateParentProfileData = {
      parent_name: formData.parent_name || undefined,
      parent_email: formData.parent_email || undefined,
      parent_phone_number: formData.parent_phone_number || undefined,
      user_id: formData.user_id || undefined,
    }

    try {
      const response = await createProfileMutation.mutateAsync(profileData)
      
      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to create parent profile')
      }
    } catch (err) {
      console.error('Create parent profile error:', err)
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
        <Label htmlFor="user_id">User ID (optional)</Label>
        <Input
          id="user_id"
          value={formData.user_id}
          onChange={(e) => handleInputChange('user_id', e.target.value)}
          disabled={isLoading}
          placeholder="UUID from auth.users table"
        />
        <p className="text-sm text-muted-foreground">
          Link this profile to an existing user account
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Profile'}
        </Button>
      </div>
    </form>
  )
}