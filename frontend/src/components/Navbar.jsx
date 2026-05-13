import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

function Navbar() {
  const { user, logoutUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate("/")
  }

  return (
    <nav className="bg-gray-900 dark:bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-yellow-400 font-extrabold text-xl tracking-tight">
        KeyStrike
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/test" className="text-gray-300 hover:text-white transition text-sm font-medium">
          Test
        </Link>
        <Link to="/leaderboard" className="text-gray-300 hover:text-white transition text-sm font-medium">
          Leaderboard
        </Link>
        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition text-sm font-medium">
              {user.username}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-red-400 transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Login
            </Link>
            <Link to="/signup" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Register
            </Link>
          </>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="text-lg text-gray-400 hover:text-yellow-400 transition"
          title="Toggle theme"
          aria-label="Toggle dark/light mode"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  )
}

export default Navbar