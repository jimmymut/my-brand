import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
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
  if (!ready) return null
  if (!user) return <Navigate to="/login" replace />
  if (!user.isAdmin) return <Navigate to="/" replace />
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
