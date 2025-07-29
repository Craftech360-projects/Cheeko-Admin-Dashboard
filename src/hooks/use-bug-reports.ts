import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getBugReports,
  createBugReport,
  updateBugReport,
  deleteBugReport
} from '@/lib/supabase/database'
import type { CreateBugReportData, UpdateBugReportData } from '@/types/database'

const QUERY_KEY = 'bug-reports'

export function useBugReports() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getBugReports,
  })
}

export function useCreateBugReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateBugReportData) => createBugReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useUpdateBugReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateBugReportData }) =>
      updateBugReport(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}

export function useDeleteBugReport() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => deleteBugReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
    },
  })
}