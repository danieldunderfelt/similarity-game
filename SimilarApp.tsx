import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import SimilaritySlider from './components/SimilaritySlider'
import TextComparison from './components/TextComparison'
import { useCreateRandomMatch, useMatch, useUpdateMatchResult } from './data/matches'

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Text Similarity Game
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed">
              Compare the two texts below and rate how similar they are on a scale from 0 to 10.
              Your ratings help train AI models to better understand language similarity.
            </p>
            <div className="flex justify-center mt-8">
              <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <span className="mr-2">🏆</span>
                You've rated {Math.floor(Math.random() * 10) + 1} pairs so far!
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 transform hover:shadow-2xl transition-all duration-300">
          {/* Display the two texts for comparison */}
          <TextComparison text1={currentMatch.text1.text} text2={currentMatch.text2.text} />
        </div>

        {/* Similarity rating slider */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            How similar are these texts?
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Move the slider to rate the similarity between the texts above
          </p>
          <SimilaritySlider
            value={similarityValue}
            onChange={setSimilarityValue}
            onSubmit={handleSubmitRating}
          />
        </div>

        <footer className="text-center text-gray-500 mt-16 mb-8">
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
