// Thin fetch wrapper around the existing Express backend.
// Base URL comes from VITE_API_BASE_URL (falls back to the dev server port).

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4500'

export function getToken() {
  return localStorage.getItem('jmt_token') || ''
}
export function setToken(t) {
  if (t) localStorage.setItem('jmt_token', t)
  else localStorage.removeItem('jmt_token')
}

async function request(path, { method = 'GET', body, auth = false, isForm = false, token } = {}) {
  const headers = {}
  if (!isForm) headers['Content-Type'] = 'application/json'
  if (token) {
    headers['Authorization'] = `Bearer ${token}` // explicit (e.g. OTP reset token)
  } else if (auth) {
    const tk = getToken()
    if (tk) headers['Authorization'] = `Bearer ${tk}`
  }
  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: isForm ? body : body != null ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    const err = new Error('Network error — is the backend running?')
    err.network = true
    throw err
  }

  let data = null
  const text = await res.text()
  if (text) {
    try { data = JSON.parse(text) } catch { data = text }
  }
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Request failed (${res.status})`
    const err = new Error(typeof msg === 'string' ? msg : 'Request failed')
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  get: (p, auth = false) => request(p, { auth }),
  post: (p, body, auth = false) => request(p, { method: 'POST', body, auth }),
  put: (p, body, auth = false) => request(p, { method: 'PUT', body, auth }),
  patch: (p, body, auth = false) => request(p, { method: 'PATCH', body, auth }),
  del: (p, auth = false) => request(p, { method: 'DELETE', auth }),
  postForm: (p, formData, auth = true) => request(p, { method: 'POST', body: formData, auth, isForm: true }),
  patchForm: (p, formData, auth = true) => request(p, { method: 'PATCH', body: formData, auth, isForm: true }),
  patchToken: (p, body, token) => request(p, { method: 'PATCH', body, token }),
}

export { BASE }
