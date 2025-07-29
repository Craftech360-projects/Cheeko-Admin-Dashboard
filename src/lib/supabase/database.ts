import { supabase } from './client'
import type {
  MqttAuth,
  Toy,
  ParentProfile,
  LoginHistory,
  BugReport,
  CreateMqttAuthData,
  UpdateMqttAuthData,
  CreateToyData,
  UpdateToyData,
  CreateParentProfileData,
  UpdateParentProfileData,
  UpdateLoginHistoryData,
  CreateBugReportData,
  UpdateBugReportData,
  ApiResponse
} from '@/types/database'

// Utility function to handle Supabase responses
function handleSupabaseResponse<T>(data: T | null, error: unknown): ApiResponse<T> {
  if (error) {
    console.error('Supabase error:', error)
    return {
      data: null,
      error: (error as Error)?.message || 'An unexpected error occurred',
      success: false
    }
  }
  
  return {
    data,
    error: null,
    success: true
  }
}

// Generate a random MAC address for new toys
function generateMacId(): string {
  const hex = '0123456789ABCDEF'
  let mac = ''
  for (let i = 0; i < 6; i++) {
    if (i > 0) mac += ':'
    mac += hex[Math.floor(Math.random() * 16)]
    mac += hex[Math.floor(Math.random() * 16)]
  }
  return mac
}

// Generate a random activation code
function generateActivationCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Generate password hash (simplified for demo - use proper hashing in production)
function generatePasswordHash(macId: string): string {
  return btoa(macId + Date.now()).substring(0, 32)
}

// ============================================================================
// MQTT_AUTH (All Toys) OPERATIONS
// ============================================================================

export async function getAllToys(): Promise<ApiResponse<MqttAuth[]>> {
  const { data, error } = await supabase
    .from('mqtt_auth')
    .select('*')
    .order('created_at', { ascending: false })
  
  return handleSupabaseResponse(data, error)
}

export async function createToy(toyData: CreateMqttAuthData = {}): Promise<ApiResponse<MqttAuth>> {
  const newToy = {
    mac_id: toyData.mac_id || generateMacId(),
    password_hash: toyData.password_hash || generatePasswordHash(toyData.mac_id || 'default'),
    is_active: toyData.is_active ?? false,
    activation_code: toyData.activation_code || generateActivationCode()
  }

  const { data, error } = await supabase
    .from('mqtt_auth')
    .insert([newToy])
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function updateToy(macId: string, updates: UpdateMqttAuthData): Promise<ApiResponse<MqttAuth>> {
  const { data, error } = await supabase
    .from('mqtt_auth')
    .update(updates)
    .eq('mac_id', macId)
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function deleteToy(macId: string): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('mqtt_auth')
    .delete()
    .eq('mac_id', macId)
  
  return handleSupabaseResponse(null, error)
}

// ============================================================================
// TOYS (Activated Toys) OPERATIONS
// ============================================================================

export async function getActivatedToys(): Promise<ApiResponse<Toy[]>> {
  const { data, error } = await supabase
    .from('toys')
    .select('*')
    .order('created_at', { ascending: false })
  
  return handleSupabaseResponse(data, error)
}

export async function createActivatedToy(toyData: CreateToyData): Promise<ApiResponse<Toy>> {
  const { data, error } = await supabase
    .from('toys')
    .insert([toyData])
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function updateActivatedToy(id: string, updates: UpdateToyData): Promise<ApiResponse<Toy>> {
  const { data, error } = await supabase
    .from('toys')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function deleteActivatedToy(id: string): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('toys')
    .delete()
    .eq('id', id)
  
  return handleSupabaseResponse(null, error)
}

// ============================================================================
// PARENT PROFILES OPERATIONS
// ============================================================================

export async function getParentProfiles(): Promise<ApiResponse<ParentProfile[]>> {
  const { data, error } = await supabase
    .from('parent_profiles')
    .select('*')
    .order('created_at', { ascending: false })
  
  return handleSupabaseResponse(data, error)
}

export async function createParentProfile(profileData: CreateParentProfileData): Promise<ApiResponse<ParentProfile>> {
  const { data, error } = await supabase
    .from('parent_profiles')
    .insert([profileData])
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function updateParentProfile(id: string, updates: UpdateParentProfileData): Promise<ApiResponse<ParentProfile>> {
  const { data, error } = await supabase
    .from('parent_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function deleteParentProfile(id: string): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('parent_profiles')
    .delete()
    .eq('id', id)
  
  return handleSupabaseResponse(null, error)
}

// ============================================================================
// LOGIN HISTORY OPERATIONS
// ============================================================================

export async function getLoginHistory(): Promise<ApiResponse<LoginHistory[]>> {
  const { data, error } = await supabase
    .from('login_history')
    .select('*')
    .order('login_time', { ascending: false })
  
  return handleSupabaseResponse(data, error)
}

export async function updateLoginHistory(id: number, updates: UpdateLoginHistoryData): Promise<ApiResponse<LoginHistory>> {
  const { data, error } = await supabase
    .from('login_history')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function deleteLoginHistory(id: number): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('login_history')
    .delete()
    .eq('id', id)
  
  return handleSupabaseResponse(null, error)
}

// ============================================================================
// BUG REPORTS OPERATIONS
// ============================================================================

export async function getBugReports(): Promise<ApiResponse<BugReport[]>> {
  const { data, error } = await supabase
    .from('bugs_reported')
    .select('*')
    .order('created_at', { ascending: false })
  
  return handleSupabaseResponse(data, error)
}

export async function createBugReport(bugData: CreateBugReportData): Promise<ApiResponse<BugReport>> {
  const { data, error } = await supabase
    .from('bugs_reported')
    .insert([{
      ...bugData,
      severity: bugData.severity || 'medium',
      status: bugData.status || 'open'
    }])
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function updateBugReport(id: number, updates: UpdateBugReportData): Promise<ApiResponse<BugReport>> {
  const { data, error } = await supabase
    .from('bugs_reported')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()
  
  return handleSupabaseResponse(data, error)
}

export async function deleteBugReport(id: number): Promise<ApiResponse<void>> {
  const { error } = await supabase
    .from('bugs_reported')
    .delete()
    .eq('id', id)
  
  return handleSupabaseResponse(null, error)
}