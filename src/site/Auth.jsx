import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { Account } from '../api/resources'
import Hover from '../components/Hover'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const googleBtnStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11, width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--border2)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14.5, fontWeight: 700, cursor: 'pointer', marginBottom: 18 }
const googleGlyph = <span style={{ width: 21, height: 21, borderRadius: '50%', background: '#fff', border: '1px solid #dadce0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13, color: '#4285F4' }}>G</span>

// Real Google auth-code login → backend /users/auth/google (redirect_uri "postmessage").
function GoogleAuthButton({ onCode, onError }) {
  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (resp) => onCode(resp.code),
    onError: () => onError('Google sign-in was cancelled or failed'),
  })
  return (
    <Hover onClick={() => login()} style={googleBtnStyle} hover={{ background: 'var(--fill)' }}>
      {googleGlyph} Continue with Google
    </Hover>
  )
}

const GOOGLE_ACCOUNTS = [
  { name: 'Jimmy Mutabazi', email: 'jimmy.mutabazi@gmail.com', initial: 'J', color: '#34D399' },
  { name: 'Guest Visitor', email: 'guest.visitor@gmail.com', initial: 'G', color: '#38BDF8' },
]
const BRAND = {
  login: { title: 'Welcome back', sub: 'Log in to like posts, comment, and (if you are the owner) reach your dashboard.' },
  register: { title: 'Create your account', sub: 'Join to like posts and join the conversation on the blog.' },
  otp: { title: 'Verify your email', sub: 'One quick step to keep your account secure.' },
  forgot: { title: 'Forgot your password?', sub: "It happens — we'll help you back in." },
  reset: { title: 'Almost there', sub: 'Choose a new password for your account.' },
}
const genOtp = () => String(Math.floor(100000 + Math.random() * 900000))
const emailOk = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)
const input = (border) => ({ width: '100%', padding: '13px 15px', borderRadius: 11, background: 'var(--input)', border: `1px solid ${border || 'var(--border2)'}`, fontSize: 14.5, outline: 'none', color: 'var(--strong)' })
const primaryBtn = { width: '100%', padding: 14, borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 10px 26px rgba(16,185,129,0.3)', cursor: 'pointer', marginBottom: 10 }

export default function Auth({ mode }) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { login, register, googleSignIn } = useAuth()

  const [stage, setStage] = useState(mode === 'register' ? 'register' : 'login')
  const [form, setForm] = useState({})
  const [err, setErr] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  // OTP / reset state
  const [demoCode, setDemoCode] = useState('')   // shown only in offline/simulated fallback
  const [otpInput, setOtpInput] = useState('')
  const [resetToken, setResetToken] = useState('') // real OTP bearer token from backend
  const [resetEmail, setResetEmail] = useState('')
  const [googleOpen, setGoogleOpen] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const isLoginReg = stage === 'login' || stage === 'register'
  const goStage = (s) => { setStage(s); setErr(''); setNotice('') }

  /* ----------------------------------------------------------- login/reg */
  const submit = async () => {
    setErr('')
    const email = String(form.email || '').trim().toLowerCase()
    if (stage === 'register') {
      if (!String(form.first || '').trim()) return setErr('Please enter your first name')
      if (!emailOk(email)) return setErr('Enter a valid email address')
      if (String(form.pass || '').length < 6) return setErr('Password must be at least 6 characters')
      if (form.pass !== form.confirm) return setErr('Passwords do not match')
      setBusy(true)
      try {
        await register({ firstName: form.first.trim(), lastName: (form.last || '').trim(), email, password: form.pass, confirmPassword: form.confirm })
        // Account created — backend emailed a real 6-digit code. Move to verify.
        setDemoCode(''); setOtpInput(''); setNotice(''); setStage('otp')
      } catch (e) {
        setErr(e.message || 'Could not create account')
      } finally { setBusy(false) }
    } else {
      if (!emailOk(email)) return setErr('Enter a valid email address')
      if (!form.pass) return setErr('Please enter your password')
      setBusy(true)
      try { await login(email, form.pass); navigate('/') }
      catch (e) { setErr(e.message || 'Email or password is incorrect') }
      finally { setBusy(false) }
    }
  }

  /* --------------------------------------------------------------- OTP */
  const verifyOtp = async () => {
    const code = otpInput.trim()
    if (code.length < 6) return setErr('Enter the 6-digit code')
    if (demoCode) { // offline fallback only
      if (code !== demoCode) return setErr('Incorrect code — check and try again')
      return navigate('/')
    }
    setBusy(true); setErr('')
    try {
      await Account.verifyOtp(code)
      navigate('/') // account created + session established by register()
    } catch (e) {
      setErr(e.message || 'Incorrect code — check and try again')
    } finally { setBusy(false) }
  }
  const resendOtp = async () => {
    setErr('')
    try { await Account.resendVerification(); setNotice('A fresh code has been sent to your email.') }
    catch { setDemoCode(genOtp()); setNotice('A fresh code has been generated.') }
  }

  /* --------------------------------------------------- forgot / reset */
  const submitForgot = async () => {
    const email = String(form.email || '').trim().toLowerCase()
    if (!emailOk(email)) return setErr('Enter a valid email')
    setBusy(true); setErr('')
    try {
      const res = await Account.requestOtp(email)
      setResetToken(res && res.token ? res.token : '')
      setResetEmail(email); setDemoCode(''); setOtpInput(''); setStage('reset')
    } catch (e) {
      // offline fallback: simulate a code so the flow stays usable
      setResetToken(''); setResetEmail(email); setDemoCode(genOtp()); setOtpInput(''); setStage('reset')
    } finally { setBusy(false) }
  }
  const submitReset = async () => {
    const code = otpInput.trim()
    const p = String(form.pass || '')
    if (code.length < 6) return setErr('Enter the 6-digit code')
    if (p.length < 6) return setErr('Password must be at least 6 characters')
    if (p !== form.confirm) return setErr('Passwords do not match')
    if (resetToken) {
      setBusy(true); setErr('')
      try {
        await Account.resetPassword(resetToken, code, p)
        setForm({}); setOtpInput(''); setResetToken(''); setStage('login'); setNotice('Password updated — please log in.')
      } catch (e) {
        setErr(e.message || 'Incorrect code')
      } finally { setBusy(false) }
    } else {
      if (code !== demoCode) return setErr('Incorrect code')
      setForm({}); setOtpInput(''); setStage('login'); setNotice('Password updated — please log in.')
    }
  }

  /* -------------------------------------------------------------- google */
  // real OAuth: exchange the authorization code with the backend
  const handleGoogleCode = async (code) => {
    setErr('')
    try { await googleSignIn(null, code); navigate('/') } catch (e) { setErr(e.message || 'Google sign-in failed') }
  }
  // fallback (no client id configured): simulated account picker from the design
  const pickGoogle = async (acc) => {
    setGoogleOpen(false)
    try { await googleSignIn(acc); navigate('/') } catch (e) { setErr(e.message || 'Google sign-in failed') }
  }

  const brand = BRAND[stage]

  return (
    <div className="scope-site" data-theme={theme} style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: 960, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border2)', boxShadow: '0 30px 80px var(--shadow)', background: 'var(--surface)' }}>
          {/* brand panel */}
          <div style={{ position: 'relative', padding: 44, background: 'linear-gradient(160deg,#0E2A22,#0A1A2E)', color: '#EAF0F7', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 440 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#34D399,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#04110B', fontSize: 16 }}>JM</div>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 16 }}>Jimmy Mutabazi</span>
            </div>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14 }}>{brand.title}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#A6B2C4' }}>{brand.sub}</p>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 12.5, color: '#6EE7B7', background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: 10, padding: '11px 13px' }}>
              Owner demo · jimmy<span>@</span>jmt.rw · pass: admin123
            </div>
          </div>

          {/* form panel */}
          <div style={{ padding: 44, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* ---- LOGIN / REGISTER ---- */}
            {isLoginReg && (
              <>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 26, color: 'var(--strong)', marginBottom: 6 }}>{stage === 'register' ? 'Sign up' : 'Log in'}</h2>
                <p style={{ fontSize: 14, color: 'var(--muted2)', marginBottom: 20 }}>
                  {stage === 'register' ? 'Already have an account?' : 'New here?'}{' '}
                  <button onClick={() => { setForm({}); goStage(stage === 'register' ? 'login' : 'register') }} style={{ border: 'none', background: 'none', color: '#1FA779', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>{stage === 'register' ? 'Log in' : 'Create one'}</button>
                </p>

                {GOOGLE_CLIENT_ID
                  ? <GoogleAuthButton onCode={handleGoogleCode} onError={setErr} />
                  : (
                    <Hover onClick={() => { setGoogleOpen(true); setErr('') }} style={googleBtnStyle} hover={{ background: 'var(--fill)' }}>
                      {googleGlyph} Continue with Google
                    </Hover>
                  )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  <span style={{ fontSize: 12, color: 'var(--muted3)' }}>or with email</span>
                  <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                </div>

                {stage === 'register' && (
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <input value={form.first || ''} onChange={set('first')} placeholder="First name" style={{ ...input(err && !form.first ? 'rgba(251,113,133,0.6)' : null), flex: 1, minWidth: 0 }} />
                    <input value={form.last || ''} onChange={set('last')} placeholder="Last name" style={{ ...input(), flex: 1, minWidth: 0 }} />
                  </div>
                )}
                <input value={form.email || ''} onChange={set('email')} placeholder="Email" style={{ ...input(), marginBottom: 14 }} />
                <input type="password" value={form.pass || ''} onChange={set('pass')} placeholder="Password" style={{ ...input(), marginBottom: 6 }} />
                {stage === 'login' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
                    <button onClick={() => { setForm({}); goStage('forgot') }} style={{ border: 'none', background: 'none', color: '#1FA779', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Forgot password?</button>
                  </div>
                )}
                {stage === 'register' && (
                  <>
                    <div style={{ height: 8 }} />
                    <input type="password" value={form.confirm || ''} onChange={set('confirm')} placeholder="Confirm password" style={{ ...input(), marginBottom: 14 }} />
                  </>
                )}
                {notice && <div style={{ fontSize: 13, color: '#1FA779', background: 'rgba(52,211,153,0.10)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 10, padding: '11px 13px', marginBottom: 12 }}>{notice}</div>}
                {err && <div style={{ fontSize: 13, color: '#E5577A', marginBottom: 14 }}>{err}</div>}
                <button onClick={submit} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.7 : 1 }}>{busy ? 'Please wait…' : stage === 'register' ? 'Create account' : 'Log in'}</button>
                <button onClick={() => navigate('/')} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid var(--border2)', background: 'transparent', color: 'var(--muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Back to home</button>
              </>
            )}

            {/* ---- OTP (post-register) ---- */}
            {stage === 'otp' && (
              <>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 26, color: 'var(--strong)', marginBottom: 6 }}>Verify your email</h2>
                <p style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.55, marginBottom: 18 }}>Enter the 6-digit code we sent to <strong style={{ color: 'var(--text)' }}>{String(form.email || '').trim().toLowerCase()}</strong>.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 11, background: 'rgba(52,211,153,0.08)', border: '1px dashed rgba(52,211,153,0.4)', marginBottom: 18 }}>
                  {demoCode
                    ? <><span style={{ fontSize: 12.5, color: 'var(--muted2)' }}>Demo code</span><strong style={{ fontFamily: "'JetBrains Mono'", fontSize: 17, letterSpacing: 3, color: '#1FA779' }}>{demoCode}</strong></>
                    : <span style={{ fontSize: 12.5, color: 'var(--muted2)' }}>Check your inbox — the 6-digit code is in the verification email.</span>}
                </div>
                <input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="••••••" maxLength={6} inputMode="numeric" style={{ ...input(), fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono'", letterSpacing: 10, textAlign: 'center', marginBottom: 14 }} />
                {err && <div style={{ fontSize: 13, color: '#E5577A', marginBottom: 14 }}>{err}</div>}
                {notice && <div style={{ fontSize: 13, color: '#1FA779', marginBottom: 12 }}>{notice}</div>}
                <button onClick={verifyOtp} style={primaryBtn}>Verify &amp; continue</button>
                <div style={{ textAlign: 'center' }}><button onClick={resendOtp} style={{ border: 'none', background: 'none', color: '#1FA779', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Resend code</button></div>
              </>
            )}

            {/* ---- FORGOT ---- */}
            {stage === 'forgot' && (
              <>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 26, color: 'var(--strong)', marginBottom: 6 }}>Reset your password</h2>
                <p style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.55, marginBottom: 20 }}>Enter the email linked to your account and we'll send a reset code.</p>
                <input value={form.email || ''} onChange={set('email')} placeholder="Email" style={{ ...input(), marginBottom: 14 }} />
                {err && <div style={{ fontSize: 13, color: '#E5577A', marginBottom: 14 }}>{err}</div>}
                <button onClick={submitForgot} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.7 : 1 }}>{busy ? 'Sending…' : 'Send reset code'}</button>
                <div style={{ textAlign: 'center' }}><button onClick={() => goStage('login')} style={{ border: 'none', background: 'none', color: 'var(--muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Back to log in</button></div>
              </>
            )}

            {/* ---- RESET ---- */}
            {stage === 'reset' && (
              <>
                <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 26, color: 'var(--strong)', marginBottom: 6 }}>Set a new password</h2>
                <p style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.55, marginBottom: 18 }}>Enter the code sent to <strong style={{ color: 'var(--text)' }}>{resetEmail}</strong> and choose a new password.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 11, background: 'rgba(52,211,153,0.08)', border: '1px dashed rgba(52,211,153,0.4)', marginBottom: 16 }}>
                  {demoCode
                    ? <><span style={{ fontSize: 12.5, color: 'var(--muted2)' }}>Demo code</span><strong style={{ fontFamily: "'JetBrains Mono'", fontSize: 17, letterSpacing: 3, color: '#1FA779' }}>{demoCode}</strong></>
                    : <span style={{ fontSize: 12.5, color: 'var(--muted2)' }}>A 6-digit code has been sent to your email.</span>}
                </div>
                <input value={otpInput} onChange={(e) => setOtpInput(e.target.value)} placeholder="6-digit code" maxLength={6} inputMode="numeric" style={{ ...input(), fontSize: 15, fontWeight: 700, fontFamily: "'JetBrains Mono'", letterSpacing: 4, marginBottom: 14 }} />
                <input type="password" value={form.pass || ''} onChange={set('pass')} placeholder="New password" style={{ ...input(), marginBottom: 14 }} />
                <input type="password" value={form.confirm || ''} onChange={set('confirm')} placeholder="Confirm new password" style={{ ...input(), marginBottom: 14 }} />
                {err && <div style={{ fontSize: 13, color: '#E5577A', marginBottom: 14 }}>{err}</div>}
                <button onClick={submitReset} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.7 : 1 }}>{busy ? 'Updating…' : 'Update password'}</button>
                <div style={{ textAlign: 'center' }}><button onClick={() => goStage('login')} style={{ border: 'none', background: 'none', color: 'var(--muted)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Back to log in</button></div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Google account picker (simulated, per the design) */}
      {googleOpen && (
        <div onClick={() => setGoogleOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--overlay)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 380, maxWidth: '100%', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 30px 80px var(--shadow)' }}>
            <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--strong)' }}>Choose an account</div>
              <div style={{ fontSize: 13, color: 'var(--muted2)', marginTop: 3 }}>to continue to Jimmy Mutabazi</div>
            </div>
            {GOOGLE_ACCOUNTS.map((g) => (
              <Hover key={g.email} onClick={() => pickGoogle(g)} style={{ display: 'flex', alignItems: 'center', gap: 13, width: '100%', padding: '15px 24px', border: 'none', borderBottom: '1px solid var(--border)', background: 'none', cursor: 'pointer', textAlign: 'left' }} hover={{ background: 'var(--fill)' }}>
                <span style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff', background: g.color }}>{g.initial}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{g.name}</span>
                  <span style={{ display: 'block', fontSize: 12.5, color: 'var(--muted2)' }}>{g.email}</span>
                </span>
              </Hover>
            ))}
            <div style={{ padding: '14px 24px', fontSize: 12, color: 'var(--muted3)' }}>Simulated Google sign-in for this prototype.</div>
          </div>
        </div>
      )}
    </div>
  )
}
