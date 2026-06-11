import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"

function Navbar() {
  const { user, logoutUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = () => {
    // log the user out and send them back to the home page
    logoutUser()
    navigate("/")
  }

  return (
    <nav
      className="flex items-center justify-between px-8 py-5"
      style={{ color: "var(--color-sub)" }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 font-bold text-lg tracking-tight select-none"
        style={{ color: "var(--color-main)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4 4h16v2H4zM4 9h10v2H4zM4 14h7v2H4zM14 12l7 6-7 6V12z" />
        </svg>
        keystrike
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6 text-sm">
        <NavLink to="/test">test</NavLink>
        <NavLink to="/leaderboard">leaderboard</NavLink>

        {/* show different links depending on whether the user is logged in or not */}
        {user ? (
          <>
            <NavLink to="/dashboard">{user.username}</NavLink>
            <button
              onClick={handleLogout}
              className="transition-colors duration-150"
              style={{ color: "var(--color-sub)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--color-error)" }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--color-sub)" }}
            >
              logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">login</NavLink>
          </>
        )}

        {/* clicking this button switches between dark and light mode */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="transition-colors duration-150 p-1 rounded"
          style={{ color: "var(--color-sub)" }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--color-main)" }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--color-sub)" }}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </nav>
  )
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="transition-colors duration-150"
      style={{ color: "var(--color-sub)" }}
      onMouseEnter={e => { e.currentTarget.style.color = "var(--color-text)" }}
      onMouseLeave={e => { e.currentTarget.style.color = "var(--color-sub)" }}
    >
      {children}
    </Link>
  )
}

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
    </svg>
  )
}

export default Navbar
