import type { TraitPairStats } from '../data/matches'
import { Button } from './ui/button'

interface ResultsScreenProps {
  userRating: number
  stats: TraitPairStats | null
  onNextPair: () => void
}

export default function ResultsScreen({ userRating, stats, onNextPair }: ResultsScreenProps) {
  const averageRating = stats?.averageResult ?? 0
  const ratingCount = stats?.count ?? 0

  // Calculate the difference between user rating and average
  const difference = userRating - averageRating
  const formattedDifference = Math.abs(difference).toFixed(3)
  const differenceDirection = difference > 0 ? 'higher' : difference < 0 ? 'lower' : 'the same as'

  // Check if the user is the only rater (count is 0 or 1)
  const isFirstRater = ratingCount <= 1 || Math.abs(userRating - averageRating) < 0.0001

  return (
    <div className="flex flex-col items-center gap-6 sm:gap-10 sm:py-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-2xl text-transparent">
          Your Rating Results
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-600 text-sm">Your Rating</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-4xl text-transparent">
              {userRating.toFixed(3)}
            </span>
          </div>

          {!isFirstRater && (
            <>
              <div className="text-3xl text-gray-400">vs</div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-gray-600 text-sm">Average ({ratingCount} ratings)</span>
                <span className="font-bold text-4xl text-gray-700">{averageRating.toFixed(3)}</span>
              </div>
            </>
          )}
        </div>

        {isFirstRater ? (
          <p className="mt-2 text-gray-600">You're the first person to rate this pair!</p>
        ) : (
          <p className="mt-2 text-gray-600">
            Your rating is <span className="font-medium">{formattedDifference}</span> points{' '}
            <span className="font-medium">{differenceDirection}</span> the average.
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <Button
          onClick={onNextPair}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-bold text-white text-xl shadow-lg transition duration-300 ease-in-out hover:translate-y-[-2px] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70">
          Next Pair
        </Button>
      </div>
    </div>
  )
}
