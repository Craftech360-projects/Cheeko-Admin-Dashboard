'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useCreateToy } from '@/hooks/use-mqtt-auth'
import type { CreateMqttAuthData } from '@/types/database'

interface CreateToyFormProps {
  onSuccess: () => void
  isLoading: boolean
}

export function CreateToyForm({ onSuccess, isLoading }: CreateToyFormProps) {
  const [macId, setMacId] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [activationCode, setActivationCode] = useState('')
  const [error, setError] = useState('')

  const createToyMutation = useCreateToy()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const toyData: CreateMqttAuthData = {
      ...(macId && { mac_id: macId }),
      is_active: isActive,
      ...(activationCode && { activation_code: activationCode }),
    }

    try {
      const response = await createToyMutation.mutateAsync(toyData)
      
      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to create toy')
      }
    } catch (err) {
      console.error('Create toy error:', err)
      setError('An unexpected error occurred')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mac_id">MAC ID (optional)</Label>
        <Input
          id="mac_id"
          placeholder="Leave empty to auto-generate"
          value={macId}
          onChange={(e) => setMacId(e.target.value)}
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          If not provided, a MAC ID will be generated automatically
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="activation_code">Activation Code (optional)</Label>
        <Input
          id="activation_code"
          placeholder="Leave empty to auto-generate"
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          If not provided, an activation code will be generated automatically
        </p>
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

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Toy'}
        </Button>
      </div>
    </form>
  )
}