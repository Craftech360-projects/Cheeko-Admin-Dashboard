'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateBugReport } from '@/hooks/use-bug-reports'
import type { BugReport, UpdateBugReportData, BugSeverity, BugStatus, BugCategory } from '@/types/database'

interface EditBugReportFormProps {
  bug: BugReport
  onSuccess: () => void
  isLoading: boolean
}

const severityOptions: BugSeverity[] = ['low', 'medium', 'high', 'critical']
const statusOptions: BugStatus[] = ['open', 'in_progress', 'resolved', 'closed']
const categoryOptions: BugCategory[] = ['UI', 'Performance', 'Crash', 'Logic', 'Other']

export function EditBugReportForm({ bug, onSuccess, isLoading }: EditBugReportFormProps) {
  const [formData, setFormData] = useState({
    title: bug.title,
    description: bug.description,
    severity: bug.severity,
    status: bug.status,
    bug_category: bug.bug_category || '',
    platform: bug.platform || '',
    app_version: bug.app_version || '',
    build_number: bug.build_number || '',
    os_version: bug.os_version || '',
    device_model: bug.device_model || '',
    app_screen: bug.app_screen || '',
    steps_to_reproduce: bug.steps_to_reproduce || '',
    screenshot_url: bug.screenshot_url || ''
  })
  const [error, setError] = useState('')

  const updateBugMutation = useUpdateBugReport()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title || !formData.description) {
      setError('Title and description are required')
      return
    }

    const updates: UpdateBugReportData = {
      title: formData.title,
      description: formData.description,
      severity: formData.severity,
      status: formData.status,
      bug_category: (formData.bug_category as BugCategory) || null,
      platform: formData.platform || null,
      app_version: formData.app_version || null,
      build_number: formData.build_number || null,
      os_version: formData.os_version || null,
      device_model: formData.device_model || null,
      app_screen: formData.app_screen || null,
      steps_to_reproduce: formData.steps_to_reproduce || null,
      screenshot_url: formData.screenshot_url || null,
    }

    try {
      const response = await updateBugMutation.mutateAsync({
        id: bug.id,
        updates
      })
      
      if (response.success) {
        onSuccess()
      } else {
        setError(response.error || 'Failed to update bug report')
      }
    } catch (err) {
      console.error('Update bug report error:', err)
      setError('An unexpected error occurred')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          disabled={isLoading}
          placeholder="Brief description of the bug"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          disabled={isLoading}
          placeholder="Detailed description of the bug and its impact"
          rows={4}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Severity</Label>
          <Select
            value={formData.severity}
            onValueChange={(value: BugSeverity) => handleInputChange('severity', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              {severityOptions.map((severity) => (
                <SelectItem key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: BugStatus) => handleInputChange('status', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.bug_category}
            onValueChange={(value: BugCategory | '') => handleInputChange('bug_category', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No category</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="steps_to_reproduce">Steps to Reproduce</Label>
        <Textarea
          id="steps_to_reproduce"
          value={formData.steps_to_reproduce}
          onChange={(e) => handleInputChange('steps_to_reproduce', e.target.value)}
          disabled={isLoading}
          placeholder="1. Step one&#10;2. Step two&#10;3. Step three"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input
            id="platform"
            value={formData.platform}
            onChange={(e) => handleInputChange('platform', e.target.value)}
            disabled={isLoading}
            placeholder="iOS, Android, Web"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="app_version">App Version</Label>
          <Input
            id="app_version"
            value={formData.app_version}
            onChange={(e) => handleInputChange('app_version', e.target.value)}
            disabled={isLoading}
            placeholder="1.0.0"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="device_model">Device Model</Label>
          <Input
            id="device_model"
            value={formData.device_model}
            onChange={(e) => handleInputChange('device_model', e.target.value)}
            disabled={isLoading}
            placeholder="iPhone 13, Samsung Galaxy S21"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="os_version">OS Version</Label>
          <Input
            id="os_version"
            value={formData.os_version}
            onChange={(e) => handleInputChange('os_version', e.target.value)}
            disabled={isLoading}
            placeholder="iOS 15.0, Android 12"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="app_screen">App Screen</Label>
          <Input
            id="app_screen"
            value={formData.app_screen}
            onChange={(e) => handleInputChange('app_screen', e.target.value)}
            disabled={isLoading}
            placeholder="Home, Settings, Profile"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshot_url">Screenshot URL</Label>
          <Input
            id="screenshot_url"
            type="url"
            value={formData.screenshot_url}
            onChange={(e) => handleInputChange('screenshot_url', e.target.value)}
            disabled={isLoading}
            placeholder="https://example.com/screenshot.png"
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Created:</strong> {new Date(bug.created_at).toLocaleString()}
          </div>
          <div>
            <strong>Last Updated:</strong> {new Date(bug.updated_at).toLocaleString()}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Bug Report'}
        </Button>
      </div>
    </form>
  )
}