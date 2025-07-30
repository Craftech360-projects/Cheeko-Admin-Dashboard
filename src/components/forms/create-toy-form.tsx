'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateToy } from '@/hooks/use-mqtt-auth'
import type { CreateMqttAuthData } from '@/types/database'

interface CreateToyFormProps {
  onSuccess: () => void
  isLoading: boolean
}

export function CreateToyForm({ onSuccess, isLoading }: CreateToyFormProps) {
  const [macId, setMacId] = useState('')
  const [error, setError] = useState('')

  const createToyMutation = useCreateToy()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate Mac ID is provided
    if (!macId.trim()) {
      setError('MAC ID is required')
      return
    }

    const toyData: CreateMqttAuthData = {
      mac_id: macId.trim()
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
        <Label htmlFor="mac_id">MAC ID <span className="text-red-500">*</span></Label>
        <Input
          id="mac_id"
          placeholder="Enter MAC ID"
          value={macId}
          onChange={(e) => setMacId(e.target.value)}
          disabled={isLoading}
          required
        />
        <p className="text-sm text-muted-foreground">
          A unique 6-digit activation code will be auto-generated for this toy
        </p>
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