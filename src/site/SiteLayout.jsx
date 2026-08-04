import { Outlet } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import SiteNav from './SiteNav'
import SiteFooter from './SiteFooter'

export default function SiteLayout() {
  const { theme } = useTheme()
  return (
    <div
      className="scope-site"
      data-theme={theme}
      style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* grid backdrop */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage:
            'linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
          WebkitMaskImage: 'radial-gradient(900px 600px at 70% 0%,#000,transparent 80%)',
          maskImage: 'radial-gradient(900px 600px at 70% 0%,#000,transparent 80%)',
          pointerEvents: 'none',
        }}
      />
      <SiteNav />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  )
}
