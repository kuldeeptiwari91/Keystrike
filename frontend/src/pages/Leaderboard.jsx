import { useEffect, useState } from "react"
import { getLeaderboard } from "../services/api"

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard()
      .then((res) => setLeaders(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  const medals = ["🥇", "🥈", "🥉"]

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Leaderboard</h2>
      <p className="text-gray-500 mb-8 text-sm">Top 10 fastest typists on KeyStrike</p>

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : leaders.length === 0 ? (
        <div className="text-gray-500">No results yet. Be the first!</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <th className="text-left px-6 py-3">Rank</th>
                <th className="text-left px-6 py-3">Username</th>
                <th className="text-left px-6 py-3">Best WPM</th>
                <th className="text-left px-6 py-3">Best Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr
                  key={leader._id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 text-lg">{medals[index] || `#${index + 1}`}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{leader.username}</td>
                  <td className="px-6 py-4 text-yellow-500 dark:text-yellow-400 font-mono">{leader.bestWpm}</td>
                  <td className="px-6 py-4 text-green-500 dark:text-green-400 font-mono">{leader.bestAccuracy}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Leaderboard