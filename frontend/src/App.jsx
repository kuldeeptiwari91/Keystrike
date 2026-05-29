import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Leaderboard from "./pages/Leaderboard"
import Landing from "./pages/Landing"

function App() {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={!user ? <Landing /> : <Navigate to="/test" />} />
          <Route path="/test" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/test" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/test" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App