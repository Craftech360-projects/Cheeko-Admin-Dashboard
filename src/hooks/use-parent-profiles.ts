import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getParentProfiles,
  createParentProfile,
  updateParentProfile,
  deleteParentProfile
} from '@/lib/supabase/database'
import type { CreateParentProfileData, UpdateParentProfileData } from '@/types/database'

const QUERY_KEY = 'parent-profiles'

export function useParentProfiles() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getParentProfiles,
  })
}

export function useCreateParentProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateParentProfileData) => createParentProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useUpdateParentProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateParentProfileData }) =>
      updateParentProfile(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeleteParentProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteParentProfile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}