import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Tables } from '../database.types'
import supabase from '../supabase'

type Match = Tables<'matches'>
type Text = Tables<'texts'>

type MatchWithTexts = Match & {
  text1: Pick<Text, 'id' | 'text'>
  text2: Pick<Text, 'id' | 'text'>
}

// Get a match by ID along with its associated texts
export const useMatch = (matchId: string | null) => {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      if (!matchId) return null

      const { data: match, error } = await supabase
        .from('matches')
        .select(
          '*, text1:texts!matches_text_1_fkey(id, text), text2:texts!matches_text_2_fkey(id, text)',
        )
        .eq('id', matchId)
        .single()

      if (error) throw error
      return match as MatchWithTexts
    },
    enabled: !!matchId,
  })
}

// Create a new random match
export const useCreateRandomMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('create_random_match')

      if (error) throw error
      return data as string // Returns the match ID
    },
    onSuccess: (matchId) => {
      queryClient.invalidateQueries({ queryKey: ['match', matchId] })
    },
  })
}

// Update a match with the similarity score
export const useUpdateMatchResult = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ matchId, result }: { matchId: string; result: number }) => {
      const { data, error } = await supabase
        .from('matches')
        .update({ result })
        .eq('id', matchId)
        .select()
        .single()

      if (error) throw error
      return data as Match
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['match', data.id] })
    },
  })
}

export function useRecordMatchResponse() {}
