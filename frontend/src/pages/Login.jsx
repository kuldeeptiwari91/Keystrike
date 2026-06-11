import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../services/api"
import { useAuth } from "../context/AuthContext"

const inputStyle = {
  backgroundColor: "var(--color-input)",
  color:           "var(--color-text)",
  border:          "none",
  borderRadius:    8,
  padding:         "12px 16px",
  fontSize:        14,
  outline:         "none",
  fontFamily:      "inherit",
  width:           "100%",
  boxSizing:       "border-box",
}

function Login() {
  const [form, setForm]       = useState({ email: "", password: "" })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const { loginUser }         = useAuth()
  const navigate              = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await login(form)
      loginUser(res.data.user, res.data.token)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 76px)" }}>
      <div style={{
        width:           "100%",
        maxWidth:        400,
        margin:          "0 1rem",
        backgroundColor: "var(--color-card)",
        border:          "1px solid var(--color-border)",
        borderRadius:    16,
        padding:         "40px 32px",
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 6, color: "var(--color-main)" }}>
          keystrike
        </h1>
        <p style={{ textAlign: "center", marginBottom: 32, color: "var(--color-sub)", fontSize: 14 }}>
          welcome back
        </p>

        {error && (
          <div style={{
            backgroundColor: "rgba(202,71,84,0.1)",
            color:           "var(--color-error)",
            padding:         "10px 16px",
            borderRadius:    8,
            marginBottom:    20,
            fontSize:        13,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            name="email" type="email" placeholder="email"
            value={form.email} onChange={handleChange} required
            style={inputStyle}
            onFocus={e => { e.target.style.boxShadow = "0 0 0 2px var(--color-main)" }}
            onBlur={e  => { e.target.style.boxShadow = "none" }}
          />
          <input
            name="password" type="password" placeholder="password"
            value={form.password} onChange={handleChange} required
            style={inputStyle}
            onFocus={e => { e.target.style.boxShadow = "0 0 0 2px var(--color-main)" }}
            onBlur={e  => { e.target.style.boxShadow = "none" }}
          />
          <button
            type="submit" disabled={loading}
            style={{
              backgroundColor: "var(--color-main)",
              color:           "var(--color-bg)",
              fontWeight:      700,
              padding:         "12px",
              borderRadius:    8,
              border:          "none",
              cursor:          loading ? "not-allowed" : "pointer",
              marginTop:       8,
              fontSize:        14,
              fontFamily:      "inherit",
              opacity:         loading ? 0.7 : 1,
              transition:      "opacity 0.15s",
            }}
          >
            {loading ? "logging in..." : "log in"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "var(--color-sub)" }}>
          don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--color-main)" }}>sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
