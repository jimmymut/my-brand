import { useNavigate, useLocation } from 'react-router-dom'
import Hover from '../components/Hover'

const link = { padding: '6px 11px', border: 'none', background: 'none', borderRadius: 8, color: 'var(--muted2)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }
const linkHover = { color: 'var(--text)', background: 'var(--fill)' }

export default function SiteFooter() {
  const navigate = useNavigate()
  const location = useLocation()

  const contact = () => {
    if (location.pathname !== '/') navigate('/', { state: { scrollTo: 'contact' } })
    else {
      const el = document.getElementById('contact')
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' })
    }
  }

  return (
    <footer style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '30px auto 0', padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#34D399,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#04110B', fontSize: 13 }}>JM</div>
        <span style={{ fontSize: 14, color: 'var(--muted2)' }}>© 2026 Jimmy Mutabazi</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Hover style={link} hover={linkHover} onClick={() => navigate('/about')}>About</Hover>
        <Hover style={link} hover={linkHover} onClick={() => navigate('/skills')}>Skills</Hover>
        <Hover style={link} hover={linkHover} onClick={() => navigate('/work')}>Work</Hover>
        <Hover style={link} hover={linkHover} onClick={() => navigate('/blog')}>Blog</Hover>
        <Hover style={link} hover={linkHover} onClick={contact}>Contact</Hover>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: 'var(--muted3)' }}>Built with care in Kigali 🇷🇼</div>
    </footer>
  )
}
