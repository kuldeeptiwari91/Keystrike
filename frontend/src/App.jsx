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
  // grab the logged-in user so we know who is currently signed in
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>
        <Navbar />
        <Routes>
          {/* if logged in, skip the landing page and send them straight to the test */}
          <Route path="/"           element={!user ? <Landing />  : <Navigate to="/test" />} />
          <Route path="/test"       element={<Home />} />
          {/* if user is already logged in, don't let them visit login or signup again */}
          <Route path="/login"      element={!user ? <Login />    : <Navigate to="/test" />} />
          <Route path="/signup"     element={!user ? <Signup />   : <Navigate to="/test" />} />
          <Route path="/dashboard"  element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
