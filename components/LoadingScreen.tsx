export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-blue-500 border-t-4 border-b-4" />
        <h3 className="font-semibold text-gray-700 text-xl">Loading next comparison...</h3>
        <p className="mt-2 text-gray-500">Please wait while we prepare the next texts</p>
      </div>
    </div>
  )
}
