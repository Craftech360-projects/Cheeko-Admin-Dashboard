import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getActivatedToys,
  createActivatedToy,
  updateActivatedToy,
  deleteActivatedToy
} from '@/lib/supabase/database'
import type { CreateToyData, UpdateToyData } from '@/types/database'

const QUERY_KEY = 'activated-toys'

export function useActivatedToys() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getActivatedToys,
  })
}

export function useCreateActivatedToy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateToyData) => createActivatedToy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useUpdateActivatedToy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateToyData }) =>
      updateActivatedToy(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeleteActivatedToy() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => deleteActivatedToy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}