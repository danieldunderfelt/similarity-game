import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import LoadingScreen from '../components/LoadingScreen'
import SimilaritySlider from '../components/SimilaritySlider'
import TextComparison from '../components/TextComparison'
import { useCreateRandomMatch, useMatch, useUpdateMatchResult } from '../data/matches'
import './App.css'

// Create a client
const queryClient = new QueryClient()

// Wrap the app content with QueryClientProvider
function SimilarityGame() {
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null)
  const [similarityValue, setSimilarityValue] = useState(5.0)
  const [isLoading, setIsLoading] = useState(false)

  // Query and mutation hooks
  const { mutateAsync: createRandomMatch } = useCreateRandomMatch()
  const { data: currentMatch, isLoading: isMatchLoading } = useMatch(currentMatchId)
  const { mutateAsync: updateMatchResult } = useUpdateMatchResult()

  // Initialize by creating a random match
  useEffect(() => {
    if (!currentMatchId) {
      createFirstMatch()
    }
  }, [currentMatchId])

  const createFirstMatch = async () => {
    try {
      const matchId = await createRandomMatch()
      setCurrentMatchId(matchId)
    } catch (error) {
      console.error('Error creating initial match:', error)
    }
  }

  const handleSubmitRating = async () => {
    if (!currentMatchId) return

    setIsLoading(true)

    try {
      // Update the current match with the similarity result
      await updateMatchResult({
        matchId: currentMatchId,
        result: similarityValue,
      })

      // Artificial delay to show loading screen
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Create a new match
      const newMatchId = await createRandomMatch()

      // Reset the slider to default
      setSimilarityValue(5.0)

      // Set the new match as current
      setCurrentMatchId(newMatchId)
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
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 font-bold text-3xl text-gray-800">Text Similarity Game</h1>
          <p className="mx-auto max-w-2xl text-gray-600">
            Compare the two texts below and rate how similar they are on a scale from 0 to 10. Your
            ratings help train AI models to better understand language similarity.
          </p>
        </header>

        {/* Display the two texts for comparison */}
        <TextComparison text1={currentMatch.text1.text} text2={currentMatch.text2.text} />

        {/* Similarity rating slider */}
        <div className="mt-8">
          <h2 className="mb-4 text-center font-semibold text-gray-700 text-xl">
            How similar are these texts?
          </h2>
          <SimilaritySlider
            value={similarityValue}
            onChange={setSimilarityValue}
            onSubmit={handleSubmitRating}
          />
        </div>
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
