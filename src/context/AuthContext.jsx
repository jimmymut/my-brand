import { createContext, useContext, useEffect, useState } from 'react'
import { api, setToken, getToken } from '../api/client'
import { useToast } from '../components/Toast'

const AuthContext = createContext(null)
const SESSION_KEY = 'jmt_session'

function normalize(user) {
  if (!user) return null
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || user.email
  return {
    ...user,
    name,
    isAdmin: user.title === 'admin' || !!user.isAdmin,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return normalize(JSON.parse(localStorage.getItem(SESSION_KEY))) } catch { return null }
  })
  const [ready, setReady] = useState(false)
  const toast = useToast()

  function persist(u) {
    setUser(u)
    if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u))
    else localStorage.removeItem(SESSION_KEY)
  }

  // Revalidate the session against the backend on boot. A 401 here means the
  // stored token is expired/invalid → the unauthorized handler below clears it.
  useEffect(() => {
    let alive = true
    const tk = getToken()
    if (!tk) { setReady(true); return }
    api.get('/users/profile', true)
      .then((u) => { if (alive) persist(normalize(u)) })
      .catch(() => { /* keep cached user; token may still be valid offline */ })
      .finally(() => { if (alive) setReady(true) })
    return () => { alive = false }
  }, [])

  // Central handling for an expired/invalid token: clear the session (locally,
  // without hitting /logout — the token is already dead) and notify. Guarded so
  // a burst of 401s (several requests at once) only logs out + toasts once.
  useEffect(() => {
    const onUnauthorized = () => {
      if (!getToken() && !localStorage.getItem(SESSION_KEY)) return // already signed out
      setToken(null)
      persist(null)
      toast('Your session expired — please sign in again.', 'error')
    }
    window.addEventListener('jmt:unauthorized', onUnauthorized)
    return () => window.removeEventListener('jmt:unauthorized', onUnauthorized)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    if (res.token) setToken(res.token)
    persist(normalize(res.user))
    return res
  }

  async function register({ firstName, lastName, email, password, confirmPassword }) {
    const res = await api.post('/users', {
      firstName,
      lastName: lastName || firstName,
      email,
      password,
      comfirmPassword: confirmPassword, // backend field name (sic)
    })
    if (res.token) setToken(res.token)
    persist(normalize(res.user))
    return res
  }

  async function logout() {
    try { await api.post('/logout', null, true) } catch {}
    setToken(null)
    persist(null)
  }

  // Google sign-in. If a real authorization `code` is supplied (from Google
  // Identity Services), exchange it with the backend; otherwise fall back to
  // the design's simulated account pick (visitor session, no backend token).
  async function googleSignIn(account, code) {
    if (code) {
      const res = await api.post('/users/auth/google', { code })
      if (res.token) setToken(res.token)
      persist(normalize(res.user))
      return res
    }
    // simulated picker (matches the prototype's labelled demo behaviour)
    persist(normalize({ firstName: account.name, email: account.email, title: 'user', google: true }))
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, googleSignIn, setUser: persist }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
