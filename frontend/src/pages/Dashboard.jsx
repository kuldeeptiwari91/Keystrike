import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyResults } from "../services/api"
import { useAuth } from "../context/AuthContext"

function Dashboard() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const { user }              = useAuth()
  const navigate              = useNavigate()

  useEffect(() => {
    if (!user) { navigate("/login"); return }
    getMyResults()
      .then(res => setResults(res.data))
      .catch(err => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  const bestWpm     = results.length ? Math.max(...results.map(r => r.wpm)) : 0
  const avgWpm      = results.length ? Math.round(results.reduce((a, b) => a + b.wpm, 0) / results.length) : 0
  const avgAccuracy = results.length ? Math.round(results.reduce((a, b) => a + b.accuracy, 0) / results.length) : 0

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px" }}>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 32, color: "var(--color-text)" }}>
        {user?.username}'s dashboard
      </h2>

      {/* Summary stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
        <StatCard label="best wpm"     value={bestWpm} />
        <StatCard label="avg wpm"      value={avgWpm} />
        <StatCard label="avg accuracy" value={`${avgAccuracy}%`} />
      </div>

      {/* Recent tests table */}
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "var(--color-sub)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        recent tests
      </h3>

      {loading ? (
        <p style={{ color: "var(--color-sub)" }}>loading...</p>
      ) : results.length === 0 ? (
        <p style={{ color: "var(--color-sub)" }}>no tests yet — go take one!</p>
      ) : (
        <div style={{
          backgroundColor: "var(--color-card)",
          border:          "1px solid var(--color-border)",
          borderRadius:    12,
          overflow:        "hidden",
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                {["#", "wpm", "accuracy", "time", "date"].map(col => (
                  <th key={col} style={{ textAlign: "left", padding: "12px 20px", fontWeight: 500, color: "var(--color-sub)" }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result, i) => (
                <tr
                  key={result._id}
                  style={{ borderBottom: i < results.length - 1 ? "1px solid var(--color-border)" : "none" }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(100,102,105,0.08)" }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
                >
                  <td style={{ padding: "14px 20px", color: "var(--color-sub)" }}>{i + 1}</td>
                  <td style={{ padding: "14px 20px", color: "var(--color-main)", fontWeight: 600 }}>{result.wpm}</td>
                  <td style={{ padding: "14px 20px", color: "var(--color-text)" }}>{result.accuracy}%</td>
                  <td style={{ padding: "14px 20px", color: "var(--color-sub)" }}>{result.timeTaken}s</td>
                  <td style={{ padding: "14px 20px", color: "var(--color-sub)" }}>
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

function StatCard({ label, value }) {
  return (
    <div style={{
      backgroundColor: "var(--color-card)",
      border:          "1px solid var(--color-border)",
      borderRadius:    12,
      padding:         "24px 16px",
      textAlign:       "center",
    }}>
      <div style={{ fontSize: 40, fontWeight: 700, color: "var(--color-main)", marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--color-sub)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </div>
    </div>
  )
}

export default Dashboard
