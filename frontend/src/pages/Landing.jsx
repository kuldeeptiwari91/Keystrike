import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight">
          How fast can you <span className="text-yellow-400">type?</span>
        </h1>
        <p className="text-gray-400 text-xl max-w-xl mb-10">
          KeyStrike measures your real typing speed and accuracy. Track your progress, beat your best, and climb the leaderboard.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/test")}
            className="bg-yellow-400 text-gray-950 font-bold px-8 py-3 rounded-xl text-lg hover:bg-yellow-300 transition"
          >
            Start Typing
          </button>
          {!user && (
            <button
              onClick={() => navigate("/register")}
              className="border border-gray-600 text-gray-300 font-bold px-8 py-3 rounded-xl text-lg hover:border-gray-400 hover:text-white transition"
            >
              Create Account
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-6 pb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-lg font-bold mb-2">Real-time WPM</h3>
          <p className="text-gray-500 text-sm">
            Instant words-per-minute and accuracy calculated as you type.
          </p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-bold mb-2">Track Progress</h3>
          <p className="text-gray-500 text-sm">
            Personal dashboard showing your best, average WPM and full test history.
          </p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg font-bold mb-2">Leaderboard</h3>
          <p className="text-gray-500 text-sm">
            Compete with others and see where you rank among the fastest typists.
          </p>
        </div>
      </section>

    </div>
  )
}

export default Landing