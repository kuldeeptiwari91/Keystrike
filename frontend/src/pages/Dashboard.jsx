import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyResults } from "../services/api"
import { useAuth } from "../context/AuthContext"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

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

      {/* Visual Progression Chart */}
      {!loading && <ProgressionChart results={results} />}

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

function ProgressionChart({ results }) {
  // We want to limit the chart to the last 10 tests, sorted chronologically (oldest to newest)
  const chartData = [...results].slice(0, 10).reverse().map(d => ({
    ...d,
    date: new Date(d.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
  }))

  if (chartData.length < 2) {
    return (
      <div style={{
        backgroundColor: "var(--color-card)",
        border:          "1px solid var(--color-border)",
        borderRadius:    12,
        padding:         "32px 24px",
        textAlign:       "center",
        color:           "var(--color-sub)",
        fontSize:        14,
        marginBottom:    40,
      }}>
        📈 Take at least 2 tests to unlock your progression chart!
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 40 }}>
      <h3 style={{
        fontSize:      14,
        fontWeight:    600,
        marginBottom:  16,
        color:         "var(--color-sub)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}>
        WPM Progression (Last 10 Tests)
      </h3>

      <div style={{
        backgroundColor: "var(--color-card)",
        border:          "1px solid var(--color-border)",
        borderRadius:    12,
        padding:         "24px 20px 12px 12px",
        position:        "relative",
      }}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-main)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--color-main)" stopOpacity={0.00} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--color-sub)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={10}
              fontFamily="JetBrains Mono, Roboto Mono, monospace"
            />
            <YAxis
              stroke="var(--color-sub)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dx={-5}
              domain={[
                (dataMin) => Math.max(0, Math.floor(dataMin - 5)),
                (dataMax) => Math.floor(dataMax + 5)
              ]}
              fontFamily="JetBrains Mono, Roboto Mono, monospace"
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--color-sub)", strokeWidth: 1.5, strokeDasharray: "2 2", opacity: 0.5 }}
            />
            <Area
              type="monotone"
              dataKey="wpm"
              stroke="var(--color-main)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#chartGradient)"
              activeDot={{ r: 7, fill: "var(--color-main)", stroke: "var(--color-card)", strokeWidth: 2 }}
              dot={{ r: 4, fill: "var(--color-card)", stroke: "var(--color-main)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div style={{
        backgroundColor: "var(--color-input)",
        border:          "1px solid var(--color-border)",
        borderRadius:    "8px",
        padding:         "8px 12px",
        boxShadow:       "0 4px 12px rgba(0, 0, 0, 0.15)",
        fontSize:        "12px",
        lineHeight:      "1.4",
        color:           "var(--color-text)",
        fontFamily:      "JetBrains Mono, Roboto Mono, monospace",
        minWidth:        "120px",
      }}>
        <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "4px", marginBottom: "4px", color: "var(--color-sub)", fontSize: "10px", fontWeight: "bold" }}>
          TEST RESULT
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ color: "var(--color-sub)" }}>wpm:</span>
          <span style={{ color: "var(--color-main)", fontWeight: "bold" }}>{data.wpm}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ color: "var(--color-sub)" }}>accuracy:</span>
          <span style={{ color: "var(--color-text)" }}>{data.accuracy}%</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
          <span style={{ color: "var(--color-sub)" }}>time:</span>
          <span style={{ color: "var(--color-sub)" }}>{data.timeTaken}s</span>
        </div>
      </div>
    )
  }
  return null
}

export default Dashboard
