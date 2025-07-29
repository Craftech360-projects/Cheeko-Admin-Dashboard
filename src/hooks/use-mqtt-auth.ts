import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllToys,
  createToy,
  updateToy,
  deleteToy
} from '@/lib/supabase/database'
import type { CreateMqttAuthData, UpdateMqttAuthData } from '@/types/database'

const QUERY_KEY = 'mqtt-auth'

export function useAllToys() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getAllToys,
  })
}

export function useCreateToy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateMqttAuthData) => createToy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useUpdateToy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ macId, updates }: { macId: string; updates: UpdateMqttAuthData }) =>
      updateToy(macId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeleteToy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (macId: string) => deleteToy(macId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}