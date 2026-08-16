import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { api } from './api/client'
import SiteLayout from './site/SiteLayout'
import Home from './site/Home'
import About from './site/About'
import SkillsPage from './site/SkillsPage'
import WorkPage from './site/WorkPage'
import BlogList from './site/BlogList'
import PostDetail from './site/PostDetail'
import Auth from './site/Auth'
import Dashboard from './dashboard/Dashboard'

function RequireAdmin({ children }) {
  const { user, ready } = useAuth()
  const [verified, setVerified] = useState(null) // null = confirming with server, true, false

  // The cached session is only optimistic. Before rendering the dashboard,
  // confirm the CURRENT token really belongs to an admin — this closes the
  // stale/expired-session hole (a 401 also triggers a global logout).
  useEffect(() => {
    let alive = true
    setVerified(null)
    if (!user || !user.isAdmin) return
    api.get('/users/profile', true)
      .then((u) => { if (alive) setVerified(!!u && u.title === 'admin') })
      .catch(() => { if (alive) setVerified(false) })
    return () => { alive = false }
  }, [user])

  if (!ready) return null
  if (!user) return <Navigate to="/login" replace />
  if (!user.isAdmin || verified === false) return <Navigate to="/" replace />
  if (verified === null) return null // waiting for the server's confirmation
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:id" element={<PostDetail />} />
      </Route>
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route
        path="/dashboard/*"
        element={
          <RequireAdmin>
            <Dashboard />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
