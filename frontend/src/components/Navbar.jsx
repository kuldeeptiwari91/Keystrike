import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { user, logoutUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate("/")
  }

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
      <Link to="/" className="text-xl font-bold text-yellow-400 tracking-wide">
        KeyStrike
      </Link>

      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
        <Link to="/leaderboard" className="text-gray-400 hover:text-white transition">Leaderboard</Link>

        {user ? (
          <>
            <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">Hi, {user.username}</span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-400 hover:text-white transition">Login</Link>
            <Link
              to="/signup"
              className="bg-yellow-400 text-gray-950 font-bold px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar