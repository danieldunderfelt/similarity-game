export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
      <div className="max-w-md rounded-2xl bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto mb-6 h-20 w-20 animate-spin rounded-full border-gradient-to-r border-gray-500 border-t-8 border-r-2 border-b-8 border-l-2 from-blue-600 to-purple-600" />
        <h3 className="mb-2 font-bold text-2xl text-gray-800">Loading next pair...</h3>
        <p className="mt-2 text-gray-600 text-lg">
          Please wait while we prepare the next pair for you
        </p>

        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div className="h-full animate-loading-bar rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>
      </div>
    </div>
  )
}

// Add this to your global CSS or create a new style tag in your component
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes loading-bar {
    0% { width: 0% }
    50% { width: 70% }
    100% { width: 100% }
  }
  .animate-loading-bar {
    animation: loading-bar 1.5s infinite ease-in-out;
  }
`
document.head.appendChild(styleTag)
