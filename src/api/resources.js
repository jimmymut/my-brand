// Maps the backend's responses into the shapes the design components expect,
// and back again for writes. Tolerant of fields the backend may not send.
import { api } from './client'

/* ----------------------------------------------------------------- POSTS */
export function mapPost(b) {
  if (!b) return null
  const body = Array.isArray(b.body)
    ? b.body
    : b.description
    ? String(b.description).split(/\n{2,}/).map((s) => s.trim()).filter(Boolean)
    : []
  const likeCount = Array.isArray(b.likes) ? b.likes.length : b.likes || 0
  const comments = (b.comments || []).map(mapComment)
  return {
    id: b._id || b.id,
    title: b.title || '',
    excerpt: b.excerpt || (body[0] ? body[0].slice(0, 140) : ''),
    tag: b.tag || 'Other',
    date: (b.date || b.createdAt || '').slice(0, 10),
    body,
    image: (b.file && b.file.url) || b.image || '',
    likeCount,
    comments,
    raw: b,
  }
}

export function mapComment(c) {
  if (!c) return null
  const user = c.user && typeof c.user === 'object'
    ? [c.user.firstName, c.user.lastName].filter(Boolean).join(' ') || c.user.email
    : c.user || 'User'
  return {
    id: c._id || c.id,
    user,
    text: c.comment || c.text || '',
    date: (c.commentedAt || c.date || c.createdAt || '').slice(0, 10),
  }
}

export const Posts = {
  list: () => api.get('/blogs').then((r) => (Array.isArray(r) ? r : r.blogs || []).map(mapPost)),
  get: (id) => api.get(`/blogs/${id}`).then((r) => mapPost(r.blog || r)),
  comments: (id) => api.get(`/blogs/${id}/comments`).then((r) => (r.comments || []).map(mapComment)),
  addComment: (id, comment) => api.post(`/blogs/${id}/comments`, { comment }, true),
  toggleLike: (id) => api.put(`/blogs/${id}/likes`, null, true),
  likes: (id) => api.get(`/blogs/${id}/likes`).then((r) => r.likes),
  remove: (id) => api.del(`/blogs/${id}`, true),
}

/* ---------------------------------------------------------------- SKILLS */
export function mapSkill(s) {
  return {
    id: s._id || s.id,
    name: s.name || '',
    icon: s.icon || '',
    desc: s.desc || s.summary || '',
    level: s.level != null ? s.level : 0,
    raw: s,
  }
}
export const Skills = {
  list: () => api.get('/skills').then((r) => (r.skills || r || []).map(mapSkill)),
  remove: (id) => api.del(`/skills/${id}`, true),
}

/* ------------------------------------------------------------------ WORK */
export function mapWork(w) {
  return {
    id: w._id || w.id,
    title: w.title || '',
    desc: w.desc || w.body || '',
    start: w.start || '',
    end: w.end || '',
    link: w.link || '',
    raw: w,
  }
}
export const Work = {
  list: () => api.get('/works').then((r) => (r.works || r || []).map(mapWork)),
  remove: (id) => api.del(`/works/${id}`, true),
}

/* -------------------------------------------------------------- MESSAGES */
export function mapMessage(m) {
  return {
    id: m._id || m.id,
    name: m.name || '',
    email: m.email || '',
    phone: m.phone || '',
    message: m.message || '',
    date: (m.date || m.createdAt || '').slice(0, 10),
    read: !!m.read,
    raw: m,
  }
}
export const Messages = {
  list: () => api.get('/messages', true).then((r) => (Array.isArray(r) ? r : r.messages || []).map(mapMessage)),
  send: ({ name, email, phone, message }) =>
    api.post('/messages', { contName: name, contEmail: email, phone, message }),
  toggleRead: (id) => api.patch(`/messages/${id}/read`, null, true),
  remove: (id) => api.del(`/messages/${id}`, true),
}

/* ------------------------------------------------------ ACCOUNT / AUTH */
export const Account = {
  // Google OAuth: exchange the authorization code from Google for a session.
  googleLogin: (code) => api.post('/users/auth/google', { code }),
  // Password reset (real 6-digit OTP flow): request emails a code + returns an OTP token.
  requestOtp: (email) => api.post('/users/request-otp', { email }),
  // Reset uses the OTP token as the bearer credential.
  resetPassword: (token, otp, password) => api.patchToken('/users/reset-password', { otp, password }, token),
  // Inline 6-digit registration verification (uses the session token from register).
  verifyOtp: (otp) => api.post('/users/verify-otp', { otp }, true),
  // Re-send the registration verification email (also re-issues the code).
  resendVerification: () => api.get('/users/resend-verification', true),
}

/* --------------------------------------------------------------- FINANCE */
export const Finance = {
  state: () => api.get('/finance', true),
  addTx: (tx) => api.post('/finance/transactions', tx, true),
  updateTx: (id, tx) => api.patch(`/finance/transactions/${id}`, tx, true),
  removeTx: (id) => api.del(`/finance/transactions/${id}`, true),
  saveContrib: (c) => api.post('/finance/contributions', c, true),
  updateContrib: (id, c) => api.patch(`/finance/contributions/${id}`, c, true),
  removeContrib: (id) => api.del(`/finance/contributions/${id}`, true),
  budgetItems: () => api.get('/finance/budget-items', true),
  addBudgetItem: (it) => api.post('/finance/budget-items', it, true),
  updateBudgetItem: (id, it) => api.patch(`/finance/budget-items/${id}`, it, true),
  removeBudgetItem: (id) => api.del(`/finance/budget-items/${id}`, true),
  debts: () => api.get('/finance/debts', true),
  addDebt: (d) => api.post('/finance/debts', d, true),
  updateDebt: (id, d) => api.patch(`/finance/debts/${id}`, d, true),
  removeDebt: (id) => api.del(`/finance/debts/${id}`, true),
  addDebtPayment: (id, payment) => api.post(`/finance/debts/${id}/payments`, payment, true),
}
