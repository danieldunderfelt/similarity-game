import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import SimilaritySlider from './components/SimilaritySlider'
import TextComparison from './components/TextComparison'
import {
  useCheckoutMatch,
  useGetOrCreateMatch,
  useMatch,
  useUpdateMatchResult,
} from './data/matches'
import { useStoredState } from './lib/useStoredState'
import supabase from './supabase'

// Create a client
const queryClient = new QueryClient()

// Match storage key
const CURRENT_MATCH_KEY = 'similarity_game_current_match'

// Wrap the app content with QueryClientProvider
function SimilarityGame() {
  const [similarityValue, setSimilarityValue] = useState(5.0)
  const [isLoading, setIsLoading] = useState(false)

  // Use the stored state hook for match ID
  const [matchId, setMatchId] = useStoredState<string | null>(CURRENT_MATCH_KEY, null)

  // Query and mutation hooks
  const { mutateAsync: getOrCreateMatch } = useGetOrCreateMatch()
  const { mutateAsync: checkoutMatch } = useCheckoutMatch()
  const { data: currentMatch, isLoading: isMatchLoading } = useMatch(matchId ?? null)
  const { mutateAsync: updateMatchResult } = useUpdateMatchResult()

  // Initialize a match once hydration is complete
  useEffect(() => {
    // Skip if the state is still being hydrated from storage
    if (matchId === undefined) {
      console.log('Waiting for matchId to hydrate from storage...')
      return
    }

    // Skip if already loading
    if (isLoading) return

    const initializeMatch = async () => {
      console.log('Initializing match with ID:', matchId)

      // If we already have a match ID, check if it's valid
      if (matchId) {
        try {
          // Check if the match exists and hasn't been rated yet
          const savedMatch = await queryClient.fetchQuery({
            queryKey: ['match', matchId],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('matches')
                .select('result')
                .eq('id', matchId)
                .single()

              if (error) throw error
              return data
            },
          })

          if (savedMatch && savedMatch.result === null) {
            // The match exists and hasn't been rated yet, check it out
            console.log('Found valid match, checking out:', matchId)
            await checkoutMatch(matchId)
            return // Keep using this match
          }

          console.log('Match exists but has already been rated, getting new match')
          // If we get here, we need a new match (match has been rated or doesn't exist)
        } catch (error) {
          console.error('Error checking match:', error)
          // Continue to get a new match
        }
      } else {
        console.log('No matchId in storage, getting new match')
      }

      // Get a new match
      try {
        setIsLoading(true)
        const newMatchId = await getOrCreateMatch()
        console.log('Created new match:', newMatchId)
        setMatchId(newMatchId)
      } catch (error) {
        console.error('Error getting new match:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeMatch()
  }, [matchId, getOrCreateMatch, checkoutMatch, setMatchId, queryClient, isLoading])

  const handleSubmitRating = async () => {
    if (!matchId) return

    setIsLoading(true)

    try {
      console.log('Submitting rating for match:', matchId, 'value:', similarityValue)

      // Update the current match with the similarity result
      await updateMatchResult({
        matchId: matchId,
        result: similarityValue,
      })

      // Run the delay and getting a new match concurrently
      const [_, newMatchId] = await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 1000)), // Artificial delay to show loading screen
        getOrCreateMatch(), // Get or create a new match
      ])

      // Reset the slider to default
      setSimilarityValue(5.0)

      console.log('Got new match after rating submission:', newMatchId)

      // Update the stored match ID
      setMatchId(newMatchId)

      // Force a re-render by invalidating the query for the new match
      queryClient.invalidateQueries({ queryKey: ['match'] })
      // Also force refetch the data for the specific new match
      queryClient.invalidateQueries({ queryKey: ['match', newMatchId] })
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading if we're waiting for match data
  if (isMatchLoading || !currentMatch) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-6">
        <header className="flex flex-col items-center gap-8">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-extrabold text-5xl text-transparent leading-loose">
            Trait Similarity Game
          </h1>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-gray-700">
            <p className="text-xl leading-relaxed">
              Compare the two traits below and rate how similar they are on a scale from 0 to 10.
              How you define "similarity" is up to you! Consider the following questions:
            </p>
            <ul className="list-disc pl-5">
              <li>How close are the literal meanings?</li>
              <li>How often do the traits appear in the same context?</li>
              <li>
                If you are looking for an item with one trait, would that item also have the other
                trait?
              </li>
            </ul>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 font-medium text-purple-700 text-sm">
              <span className="mr-2">🏆</span>
              You've rated {Math.floor(Math.random() * 10) + 1} pairs so far!
            </div>
          </div>
        </header>

        <TextComparison text1={currentMatch.text1.text} text2={currentMatch.text2.text} />

        {/* Similarity rating slider */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-center font-bold text-2xl text-transparent">
              How similar are these traits?
            </h2>
            <p className="text-center text-gray-600">
              Move the slider to rate the similarity between the traits above
            </p>
          </div>
          <SimilaritySlider
            value={similarityValue}
            onChange={setSimilarityValue}
            onSubmit={handleSubmitRating}
          />
        </div>

        <footer className="text-center text-gray-500">
          <p>Helping to train AI models with human feedback since 2023</p>
        </footer>
      </div>

      {/* Loading overlay */}
      {isLoading && <LoadingScreen />}
    </div>
  )
}

// Export the wrapped app
export default function SimilarApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <SimilarityGame />
    </QueryClientProvider>
  )
}
