export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75 9.75 9.75 0 019.75-9.75z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">You're Offline</h1>
        <p className="text-gray-600 mb-6">No internet connection detected. Some features may be limited.</p>
        <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">Available Offline Features:</h2>
          <ul className="text-left space-y-2 text-sm text-gray-600">
            <li>• View downloaded trail maps</li>
            <li>• Access cached weather data</li>
            <li>• View previously loaded hazard reports</li>
            <li>• Use GPS for location tracking</li>
            <li>• Create offline hazard reports (will sync when online)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
