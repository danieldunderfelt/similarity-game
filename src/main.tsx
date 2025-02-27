import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import SimilarApp from './SimilarApp'
import SplashScreen from './components/SplashScreen'

// Match storage key (should match the one in SimilarApp.tsx)
const CURRENT_MATCH_KEY = 'similarity_game_current_match'

function App() {
  const [showGame, setShowGame] = useState(false)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    // Check if we have an existing match in localStorage
    const hasExistingMatch = localStorage.getItem(CURRENT_MATCH_KEY) !== null

    // If there's an existing match, skip the splash screen
    if (hasExistingMatch) {
      setShowGame(true)
    }

    setInitializing(false)
  }, [])

  const handleStartGame = () => {
    setShowGame(true)
  }

  // Show nothing while we're checking localStorage to avoid flashing screens
  if (initializing) {
    return null
  }

  return showGame ? <SimilarApp /> : <SplashScreen onStart={handleStartGame} />
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
