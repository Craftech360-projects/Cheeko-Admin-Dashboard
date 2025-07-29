import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getLoginHistory,
  updateLoginHistory,
  deleteLoginHistory
} from '@/lib/supabase/database'
import type { UpdateLoginHistoryData } from '@/types/database'

const QUERY_KEY = 'login-history'

export function useLoginHistory() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getLoginHistory,
  })
}

export function useUpdateLoginHistory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateLoginHistoryData }) =>
      updateLoginHistory(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeleteLoginHistory() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => deleteLoginHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}