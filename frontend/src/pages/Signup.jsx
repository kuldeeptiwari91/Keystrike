import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { signup } from "../services/api"
import { useAuth } from "../context/AuthContext"

function Signup() {
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await signup(form)
      loginUser(res.data.user, res.data.token)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
      <div className="w-full max-w-md px-8 py-10 bg-white dark:bg-gray-900 rounded-2xl shadow-md dark:shadow-none border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">KeyStrike</h1>
        <p className="text-gray-500 text-center mb-8">Create your account</p>

        {error && (
          <div className="bg-red-500/10 text-red-500 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 text-gray-950 font-bold py-3 rounded-lg hover:bg-yellow-300 transition mt-2"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-500 dark:text-yellow-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup