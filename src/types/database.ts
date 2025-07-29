// Database table interfaces based on Supabase schema
export interface MqttAuth {
  mac_id: string
  password_hash: string
  is_active: boolean | null
  created_at: string | null
  activation_code: string | null
}

export interface Toy {
  id: string
  user_id: string | null
  name: string
  role_type: RoleType
  language: LanguageType
  voice: VoiceType
  created_at: string | null
  kid_name: string | null
  activation_code: string | null
  toy_mac_id: string | null
  kid_age: number | null
  DOB: string
  additional_instructions: string | null
}

export interface ParentProfile {
  id: string
  user_id: string | null
  created_at: string
  parent_name: string | null
  parent_email: string | null
  parent_phone_number: string | null
}

export interface LoginHistory {
  id: number
  user_id: string
  device_info: string | null
  device_fingerprint: string | null
  ip_address: string | null
  location: string | null
  login_method: string | null
  login_time: string
  logout_time: string | null
  session_duration: string | null
  is_suspicious: boolean | null
}

export interface BugReport {
  id: number
  user_id: string | null
  title: string
  description: string
  app_version: string | null
  build_number: string | null
  platform: string | null
  os_version: string | null
  device_model: string | null
  app_screen: string | null
  steps_to_reproduce: string | null
  severity: BugSeverity
  status: BugStatus
  created_at: string
  updated_at: string
  bug_category: BugCategory | null
  screenshot_url: string | null
}

// Enum types (to be updated based on actual Supabase enum definitions)
export type RoleType = 'friend' | 'teacher' | 'parent' | 'sibling' | 'pet' | 'character'
export type LanguageType = 'english' | 'spanish' | 'french' | 'german' | 'chinese' | 'japanese'
export type VoiceType = 'male' | 'female' | 'child' | 'robot' | 'custom'

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical'
export type BugStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type BugCategory = 'UI' | 'Performance' | 'Crash' | 'Logic' | 'Other'

// Form data types for creating/updating records
export interface CreateMqttAuthData {
  mac_id?: string
  password_hash?: string
  is_active?: boolean
  activation_code?: string
}

export interface UpdateMqttAuthData {
  is_active?: boolean
  activation_code?: string
}

export interface CreateToyData {
  user_id?: string | null
  name: string
  role_type: RoleType
  language: LanguageType
  voice: VoiceType
  kid_name?: string | null
  activation_code?: string | null
  toy_mac_id?: string | null
  kid_age?: number | null
  DOB?: string
  additional_instructions?: string | null
}

export interface UpdateToyData {
  user_id?: string | null
  name?: string
  role_type?: RoleType
  language?: LanguageType
  voice?: VoiceType
  kid_name?: string | null
  activation_code?: string | null
  toy_mac_id?: string | null
  kid_age?: number | null
  DOB?: string
  additional_instructions?: string | null
}

export interface CreateParentProfileData {
  user_id?: string | null
  parent_name?: string | null
  parent_email?: string | null
  parent_phone_number?: string | null
}

export interface UpdateParentProfileData {
  parent_name?: string | null
  parent_email?: string | null
  parent_phone_number?: string | null
}

export interface UpdateLoginHistoryData {
  is_suspicious?: boolean
}

export interface CreateBugReportData {
  user_id?: string | null
  title: string
  description: string
  app_version?: string | null
  build_number?: string | null
  platform?: string | null
  os_version?: string | null
  device_model?: string | null
  app_screen?: string | null
  steps_to_reproduce?: string | null
  severity?: BugSeverity
  status?: BugStatus
  bug_category?: BugCategory | null
  screenshot_url?: string | null
}

export interface UpdateBugReportData {
  title?: string
  description?: string
  app_version?: string | null
  build_number?: string | null
  platform?: string | null
  os_version?: string | null
  device_model?: string | null
  app_screen?: string | null
  steps_to_reproduce?: string | null
  severity?: BugSeverity
  status?: BugStatus
  bug_category?: BugCategory | null
  screenshot_url?: string | null
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}