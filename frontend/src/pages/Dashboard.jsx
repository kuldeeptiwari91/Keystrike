import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyResults } from "../services/api"
import { useAuth } from "../context/AuthContext"

function Dashboard() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
    getMyResults()
      .then((res) => setResults(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  const bestWpm = results.length ? Math.max(...results.map((r) => r.wpm)) : 0
  const avgWpm = results.length ? Math.round(results.reduce((a, b) => a + b.wpm, 0) / results.length) : 0
  const avgAccuracy = results.length ? Math.round(results.reduce((a, b) => a + b.accuracy, 0) / results.length) : 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-8">
        {user?.username}'s Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <div className="text-4xl font-mono text-yellow-400">{bestWpm}</div>
          <div className="text-sm text-gray-500 mt-2">Best WPM</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <div className="text-4xl font-mono text-blue-400">{avgWpm}</div>
          <div className="text-sm text-gray-500 mt-2">Avg WPM</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <div className="text-4xl font-mono text-green-400">{avgAccuracy}%</div>
          <div className="text-sm text-gray-500 mt-2">Avg Accuracy</div>
        </div>
      </div>

      {/* Results Table */}
      <h3 className="text-lg font-semibold mb-4 text-gray-300">Recent Tests</h3>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : results.length === 0 ? (
        <div className="text-gray-500">No tests yet. Go take a test!</div>
      ) : (
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="text-left px-6 py-3">#</th>
                <th className="text-left px-6 py-3">WPM</th>
                <th className="text-left px-6 py-3">Accuracy</th>
                <th className="text-left px-6 py-3">Time</th>
                <th className="text-left px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={result._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 text-yellow-400 font-mono">{result.wpm}</td>
                  <td className="px-6 py-4 text-green-400 font-mono">{result.accuracy}%</td>
                  <td className="px-6 py-4 text-blue-400 font-mono">{result.timeTaken}s</td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard