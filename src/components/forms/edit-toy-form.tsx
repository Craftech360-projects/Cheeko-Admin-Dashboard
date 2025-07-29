'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useUpdateToy } from '@/hooks/use-mqtt-auth'
import type { MqttAuth, UpdateMqttAuthData } from '@/types/database'

interface EditToyFormProps {
  toy: MqttAuth
  onSuccess: () => void
  isLoading: boolean
}

export function EditToyForm({ toy, onSuccess, isLoading }: EditToyFormProps) {
  const [isActive, setIsActive] = useState(toy.is_active ?? false)
  const [activationCode, setActivationCode] = useState(toy.activation_code || '')
  const [error, setError] = useState('')

  const updateToyMutation = useUpdateToy()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const updates: UpdateMqttAuthData = {
      is_active: isActive,
      activation_code: activationCode || undefined,
    }

    try {
      const response = await updateToyMutation.mutateAsync({
        macId: toy.mac_id,
        updates
      })
      
      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to update toy')
      }
    } catch (err) {
      console.error('Update toy error:', err)
      setError('An unexpected error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>MAC ID</Label>
        <Input 
          value={toy.mac_id} 
          disabled 
          className="bg-muted"
        />
        <p className="text-sm text-muted-foreground">
          MAC ID cannot be changed after creation
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activation_code">Activation Code</Label>
        <Input
          id="activation_code"
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          disabled={isLoading}
          placeholder="Enter activation code"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={setIsActive}
          disabled={isLoading}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
        <strong>Created:</strong> {toy.created_at ? new Date(toy.created_at).toLocaleString() : 'Unknown'}
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Toy'}
        </Button>
      </div>
    </form>
  )
}