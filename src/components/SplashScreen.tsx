import { Button } from './ui/button'

interface SplashScreenProps {
  onStart: () => void
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-blue-50 px-6 py-12">
      <div className="flex max-w-3xl flex-col items-center gap-10 text-center">
        <header className="flex flex-col items-center gap-8">
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-extrabold text-5xl text-transparent leading-loose">
            Trait Similarity Game
          </h1>

          <div className="space-y-6 text-gray-700">
            <p className="text-xl leading-relaxed">
              Welcome to the Trait Similarity Game, where your input helps train AI models with
              human feedback.
            </p>

            <div className="space-y-6">
              <h2 className="font-bold text-gray-800 text-xl">How to Play:</h2>
              <p className="text-lg">
                You'll be shown two traits and asked to rate how similar they are on a scale from 0
                to 10.
              </p>

              <div className="space-y-4 text-center">
                <p>When rating similarity, consider:</p>
                <ul className="list-inside list-disc space-y-2 pl-5">
                  <li>How close are the literal meanings?</li>
                  <li>How often do the traits appear in the same context?</li>
                  <li>If an item has one trait, how likely is it to have the other?</li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        <Button
          onClick={onStart}
          type="button"
          className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-bold text-white text-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl">
          Start Game
        </Button>
      </div>
    </div>
  )
}
