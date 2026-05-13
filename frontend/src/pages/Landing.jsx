import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300">
      
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-yellow-400/10 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            How fast can you <span className="text-yellow-500 dark:text-yellow-400">type?</span>
            <span className="text-gray-400 dark:text-gray-500"> Find out.</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            KeyStrike measures your real typing speed and accuracy in real time.
            Track your progress, beat your personal best, and climb the leaderboard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate("/test")}
              className="bg-yellow-400 text-gray-950 font-bold px-8 py-3.5 rounded-xl text-lg hover:bg-yellow-300 transition hover:-translate-y-0.5"
            >
              Start Typing
            </button>

            {!user && (
              <button
                onClick={() => navigate("/signup")}
                className="border border-gray-400 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold px-8 py-3.5 rounded-xl text-lg hover:border-gray-600 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition hover:-translate-y-0.5"
              >
                Create Account
              </button>
            )}
          </div>

          {/* Typing Preview Card — kept intentionally dark as a terminal aesthetic */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-900/95 border border-gray-800 rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                  Live Typing Test
                </div>
                <div className="w-10" />
              </div>

              <div className="flex flex-wrap justify-center gap-10 px-6 pt-8">
                <div className="text-center">
                  <div className="text-4xl font-mono text-yellow-400">84</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mt-2">WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-mono text-green-400">97%</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mt-2">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-mono text-blue-400">23s</div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 mt-2">Time Left</div>
                </div>
              </div>

              <div className="px-6 md:px-10 pt-8 pb-10 text-left text-xl md:text-2xl font-mono tracking-wide leading-relaxed">
                <span className="text-green-400">the quick brown fox jumps </span>
                <span className="text-red-400 bg-red-500/10 rounded-sm">o</span>
                <span className="text-green-400">ver the lazy </span>
                <span className="text-white border-l-2 border-yellow-400 animate-pulse pl-[2px]">d</span>
                <span className="text-gray-500">
                  og and the cat sat on the mat while the dog barked at the birds
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="px-6 pb-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-2xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="px-6 py-7 text-center border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-800">
            <div className="text-3xl font-mono font-bold text-yellow-500 dark:text-yellow-400">12k+</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-2">Tests Taken</div>
          </div>
          <div className="px-6 py-7 text-center border-b md:border-b-0 md:border-r border-gray-300 dark:border-gray-800">
            <div className="text-3xl font-mono font-bold text-yellow-500 dark:text-yellow-400">148</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-2">Top WPM</div>
          </div>
          <div className="px-6 py-7 text-center md:border-r border-gray-300 dark:border-gray-800">
            <div className="text-3xl font-mono font-bold text-yellow-500 dark:text-yellow-400">3.2k</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-2">Users</div>
          </div>
          <div className="px-6 py-7 text-center">
            <div className="text-3xl font-mono font-bold text-yellow-500 dark:text-yellow-400">98%</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 mt-2">Avg Accuracy</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center hover:border-gray-400 dark:hover:border-gray-700 hover:-translate-y-1 transition shadow-sm dark:shadow-none">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Real-time WPM</h3>
            <p className="text-gray-500 text-sm leading-6">
              Words-per-minute and accuracy are calculated instantly while you type,
              giving fast and smooth feedback.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center hover:border-gray-400 dark:hover:border-gray-700 hover:-translate-y-1 transition shadow-sm dark:shadow-none">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 3v18h18" />
                <path d="M7 14l3-3 3 2 4-5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Progress Dashboard</h3>
            <p className="text-gray-500 text-sm leading-6">
              View your best WPM, average accuracy, and previous test results in one
              clean dashboard.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center hover:border-gray-400 dark:hover:border-gray-700 hover:-translate-y-1 transition shadow-sm dark:shadow-none">
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 4h10v3a5 5 0 0 1-10 0V4z" />
                <path d="M5 6H3a2 2 0 0 0 2 2" />
                <path d="M19 6h2a2 2 0 0 1-2 2" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Leaderboard</h3>
            <p className="text-gray-500 text-sm leading-6">
              Compare your performance with other users and aim for a place in the top rankings.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pt-4 pb-20">
        <div className="max-w-4xl mx-auto rounded-3xl border border-yellow-400/30 dark:border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-gray-200 dark:to-gray-900 p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
            Ready to find your speed?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-7">
            Practice regularly, improve your typing accuracy, and see how far you can climb.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/test")}
              className="bg-yellow-400 text-gray-950 font-bold px-8 py-3 rounded-xl hover:bg-yellow-300 transition"
            >
              Start for Free
            </button>

            <button
              onClick={() => navigate("/leaderboard")}
              className="border border-gray-400 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold px-8 py-3 rounded-xl hover:border-gray-600 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white transition"
            >
              View Leaderboard
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-900 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 KeyStrike. Built with focus and speed.</p>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/kuldeeptiwari91/Keystrike"
              className="hover:text-yellow-500 dark:hover:text-yellow-400 transition"
            >
              GitHub
            </a>
            <a
              href="https://keystrike-typing.vercel.app"
              className="hover:text-yellow-500 dark:hover:text-yellow-400 transition"
            >
              Live Demo
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing