import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeSwitch from '../components/ThemeSwitch'
import Hover from '../components/Hover'
import { initial } from '../lib/format'

const navBtn = {
  padding: '9px 14px', border: 'none', background: 'none', borderRadius: 9,
  fontSize: 14.5, fontWeight: 600, color: 'var(--muted2)', cursor: 'pointer',
}
const navHover = { color: 'var(--text)', background: 'var(--fill)' }

export default function SiteNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const path = location.pathname
  const onBlog = path.startsWith('/blog')

  const go = (to) => { setProfileOpen(false); navigate(to) }
  const navColor = (to) => (path === to ? '#1FA779' : 'var(--muted2)')

  // Contact still scrolls to the section on the home page.
  const contact = () => {
    setProfileOpen(false)
    if (path !== '/') navigate('/', { state: { scrollTo: 'contact' } })
    else {
      const el = document.getElementById('contact')
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' })
    }
  }

  return (
    <nav
      style={{
        position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 18, padding: '14px 32px',
        backdropFilter: 'blur(14px)', background: 'var(--navbg)', borderBottom: '1px solid var(--border)', flexWrap: 'wrap',
      }}
    >
      <Link to="/" onClick={() => setProfileOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <div style={{ width: 38, height: 38, borderRadius: 11, background: 'linear-gradient(135deg,#34D399,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#04110B', fontSize: 16, boxShadow: '0 6px 18px rgba(16,185,129,0.35)' }}>JM</div>
        <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em', color: 'var(--strong)' }}>Jimmy Mutabazi</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
        <Hover style={{ ...navBtn, color: navColor('/about') }} hover={navHover} onClick={() => go('/about')}>About</Hover>
        <Hover style={{ ...navBtn, color: navColor('/skills') }} hover={navHover} onClick={() => go('/skills')}>Skills</Hover>
        <Hover style={{ ...navBtn, color: navColor('/work') }} hover={navHover} onClick={() => go('/work')}>Work</Hover>
        <Hover style={{ ...navBtn, color: onBlog ? '#1FA779' : 'var(--muted2)' }} hover={navHover} onClick={() => go('/blog')}>Blog</Hover>
        <Hover style={navBtn} hover={navHover} onClick={contact}>Contact</Hover>

        <ThemeSwitch variant="icon" />

        {!user && (
          <>
            <Hover style={{ ...navBtn, marginLeft: 8 }} hover={{ color: 'var(--text)' }} onClick={() => navigate('/login')}>Log in</Hover>
            <button onClick={() => navigate('/register')} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', fontSize: 14.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 8px 22px rgba(16,185,129,0.30)', cursor: 'pointer' }}>Sign up</button>
          </>
        )}

        {user && (
          <div style={{ position: 'relative', marginLeft: 8 }}>
            <button onClick={() => setProfileOpen((o) => !o)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '5px 11px 5px 5px', borderRadius: 100, background: 'var(--fill)', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#34D399,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#04110B' }}>{initial(user.name)}</span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{user.name}</span>
              <span style={{ fontSize: 11, color: 'var(--muted2)' }}>▾</span>
            </button>
            {profileOpen && (
              <div style={{ position: 'absolute', right: 0, top: 50, width: 212, background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 14, boxShadow: '0 24px 60px var(--shadow)', padding: 8, zIndex: 60 }}>
                <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--strong)' }}>{user.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted3)' }}>{user.isAdmin ? 'Owner · Admin' : 'Member'}</div>
                </div>
                {user.isAdmin && (
                  <Hover as="a" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, color: '#1FA779', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }} onClick={() => { setProfileOpen(false); navigate('/dashboard') }}>Open Dashboard <span>→</span></Hover>
                )}
                <Hover style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', padding: '10px 12px', border: 'none', borderRadius: 9, background: 'none', color: 'var(--text)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }} hover={{ background: 'rgba(251,113,133,0.12)', color: '#E5577A' }} onClick={() => { setProfileOpen(false); logout() }}>
                  <svg width="16" height="16" viewBox="0 0 18 18"><path d="M11 2.5H4.5A1.5 1.5 0 0 0 3 4v10a1.5 1.5 0 0 0 1.5 1.5H11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M8 9h8M13 6l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Log out
                </Hover>
              </div>
            )}
          </div>
        )}
        {profileOpen && <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />}
      </div>
    </nav>
  )
}
