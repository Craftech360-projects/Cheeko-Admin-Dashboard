'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateActivatedToy } from '@/hooks/use-activated-toys'
import type { Toy, UpdateToyData, RoleType, LanguageType, VoiceType } from '@/types/database'

interface EditActivatedToyFormProps {
  toy: Toy
  onSuccess: () => void
  isLoading: boolean
}

const roleTypes: RoleType[] = ['friend', 'teacher', 'parent', 'sibling', 'pet', 'character']
const languageTypes: LanguageType[] = ['english', 'spanish', 'french', 'german', 'chinese', 'japanese']
const voiceTypes: VoiceType[] = ['male', 'female', 'child', 'robot', 'custom']

export function EditActivatedToyForm({ toy, onSuccess, isLoading }: EditActivatedToyFormProps) {
  const [formData, setFormData] = useState({
    name: toy.name,
    kid_name: toy.kid_name || '',
    kid_age: toy.kid_age?.toString() || '',
    DOB: toy.DOB ? toy.DOB.split('T')[0] : '',
    role_type: toy.role_type,
    language: toy.language,
    voice: toy.voice,
    toy_mac_id: toy.toy_mac_id || '',
    activation_code: toy.activation_code || '',
    additional_instructions: toy.additional_instructions || ''
  })
  const [error, setError] = useState('')

  const updateToyMutation = useUpdateActivatedToy()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.role_type || !formData.language || !formData.voice) {
      setError('Please fill in all required fields')
      return
    }

    const updates: UpdateToyData = {
      name: formData.name,
      role_type: formData.role_type,
      language: formData.language,
      voice: formData.voice,
      kid_name: formData.kid_name || null,
      kid_age: formData.kid_age ? parseInt(formData.kid_age) : null,
      DOB: formData.DOB || toy.DOB,
      toy_mac_id: formData.toy_mac_id || null,
      activation_code: formData.activation_code || null,
      additional_instructions: formData.additional_instructions || null,
    }

    try {
      const response = await updateToyMutation.mutateAsync({
        id: toy.id,
        updates
      })
      
      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to update activated toy')
      }
    } catch (err) {
      console.error('Update activated toy error:', err)
      setError('An unexpected error occurred')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Toy Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={isLoading}
            placeholder="e.g., Buddy the Robot"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="kid_name">Kid Name</Label>
          <Input
            id="kid_name"
            value={formData.kid_name}
            onChange={(e) => handleInputChange('kid_name', e.target.value)}
            disabled={isLoading}
            placeholder="Child's name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="kid_age">Kid Age</Label>
          <Input
            id="kid_age"
            type="number"
            min="1"
            max="18"
            value={formData.kid_age}
            onChange={(e) => handleInputChange('kid_age', e.target.value)}
            disabled={isLoading}
            placeholder="Age in years"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="DOB">Date of Birth</Label>
          <Input
            id="DOB"
            type="date"
            value={formData.DOB}
            onChange={(e) => handleInputChange('DOB', e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Role Type *</Label>
          <Select
            value={formData.role_type}
            onValueChange={(value) => handleInputChange('role_type', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleTypes.map((role) => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Language *</Label>
          <Select
            value={formData.language}
            onValueChange={(value) => handleInputChange('language', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageTypes.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Voice Type *</Label>
          <Select
            value={formData.voice}
            onValueChange={(value) => handleInputChange('voice', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {voiceTypes.map((voice) => (
                <SelectItem key={voice} value={voice}>
                  {voice.charAt(0).toUpperCase() + voice.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="toy_mac_id">MAC ID</Label>
          <Input
            id="toy_mac_id"
            value={formData.toy_mac_id}
            onChange={(e) => handleInputChange('toy_mac_id', e.target.value)}
            disabled={isLoading}
            placeholder="AA:BB:CC:DD:EE:FF"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="activation_code">Activation Code</Label>
          <Input
            id="activation_code"
            value={formData.activation_code}
            onChange={(e) => handleInputChange('activation_code', e.target.value)}
            disabled={isLoading}
            placeholder="Activation code"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additional_instructions">Additional Instructions</Label>
        <Textarea
          id="additional_instructions"
          value={formData.additional_instructions}
          onChange={(e) => handleInputChange('additional_instructions', e.target.value)}
          disabled={isLoading}
          placeholder="Special instructions or notes for this toy..."
          rows={3}
        />
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