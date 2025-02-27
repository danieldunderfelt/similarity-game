import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Tables } from '../database.types'
import supabase from '../supabase'

type Match = Tables<'matches'>
type Text = Tables<'texts'>

type MatchWithTexts = Match & {
  text1: Pick<Text, 'id' | 'text'>
  text2: Pick<Text, 'id' | 'text'>
}

// Types for the stats
export type TraitPairStats = {
  count: number
  averageResult: number
}

// Get or create a session ID from localStorage
const getSessionId = () => {
  const STORAGE_KEY = 'similarity_game_session_id'
  let sessionId = localStorage.getItem(STORAGE_KEY)

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, sessionId)
  }

  return sessionId
}

// Session ID for the current browser
const SESSION_ID = getSessionId()

// Storage key for current match
const CURRENT_MATCH_KEY = 'similarity_game_current_match'

// Store the current match ID in localStorage
export const storeCurrentMatchId = (matchId: string) => {
  localStorage.setItem(CURRENT_MATCH_KEY, matchId)
}

// Get the current match ID from localStorage
export const getCurrentMatchId = (): string | null => {
  return localStorage.getItem(CURRENT_MATCH_KEY)
}

// Clear the current match ID from localStorage
export const clearCurrentMatchId = () => {
  localStorage.removeItem(CURRENT_MATCH_KEY)
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

// Checkout an existing match
export const useCheckoutMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (matchId: string) => {
      const { data, error } = await supabase
        .from('matches')
        .update({
          checkout_at: new Date().toISOString(),
          checkout_session_id: SESSION_ID,
        })
        .eq('id', matchId)
        .select()
        .single()

      if (error) throw error
      return data.id as string
    },
    onSuccess: (matchId) => {
      queryClient.invalidateQueries({ queryKey: ['match', matchId] })
      storeCurrentMatchId(matchId)
    },
  })
}

// Get or create a match with checkout
export const useGetOrCreateMatch = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('get_or_create_match', { session_id: SESSION_ID })

      if (error) throw error
      return data as string // Returns the match ID
    },
    onSuccess: (matchId) => {
      queryClient.invalidateQueries({ queryKey: ['match', matchId] })
      storeCurrentMatchId(matchId)
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
      queryClient.invalidateQueries({ queryKey: ['traitPairStats'] })
      queryClient.invalidateQueries({ queryKey: ['sessionRatedCount', SESSION_ID] })
    },
  })
}

// Get statistics for a pair of traits
export const useTraitPairStats = (text1Id: string | undefined, text2Id: string | undefined) => {
  return useQuery({
    queryKey: ['traitPairStats', text1Id, text2Id],
    queryFn: async () => {
      if (!text1Id || !text2Id) return null

      const { data, error } = await supabase.rpc('get_trait_pair_stats', {
        text_id_1: text1Id,
        text_id_2: text2Id,
      })

      if (error) throw error

      // The function returns an array with a single row
      if (data && data.length > 0) {
        return {
          count: data[0].count,
          averageResult: data[0].average_result,
        } as TraitPairStats
      }

      return { count: 0, averageResult: 0 } as TraitPairStats
    },
    enabled: !!text1Id && !!text2Id,
  })
}

// Get count of matches rated by the current session
export const useSessionRatedCount = () => {
  return useQuery({
    queryKey: ['sessionRatedCount', SESSION_ID],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_session_rated_count', {
        session_id: SESSION_ID,
      })

      if (error) throw error
      return data as number
    },
  })
}

export function useRecordMatchResponse() {}
