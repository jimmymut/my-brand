import { useTheme } from '../context/ThemeContext'

// Segmented theme control. variant="icon" → the nav's A / sun / moon pills.
export default function ThemeSwitch({ variant = 'icon' }) {
  const { theme, setTheme } = useTheme()

  if (variant === 'text') {
    const btn = (val, label) => {
      const active = theme === val
      return (
        <button
          key={val}
          onClick={() => setTheme(val)}
          style={{
            flex: 1, padding: '8px 4px', border: 'none', borderRadius: 9, cursor: 'pointer',
            fontSize: 12.5, fontWeight: 700,
            background: active ? 'var(--surface)' : 'transparent',
            color: active ? 'var(--strong)' : 'var(--muted)',
          }}
        >
          {label}
        </button>
      )
    }
    return (
      <div style={{ display: 'flex', gap: 5, padding: 4, borderRadius: 12, background: 'var(--fill)', border: '1px solid var(--border)' }}>
        {btn('system', 'Auto')}
        {btn('light', 'Light')}
        {btn('dark', 'Dark')}
      </div>
    )
  }

  const pill = (val) => ({
    width: 30, height: 28, border: 'none', borderRadius: 7, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
    background: theme === val ? 'var(--surface)' : 'transparent',
    color: theme === val ? 'var(--strong)' : 'var(--muted2)',
  })

  return (
    <div style={{ display: 'flex', gap: 3, marginLeft: 8, padding: 3, borderRadius: 10, background: 'var(--fill)', border: '1px solid var(--border)' }}>
      <button onClick={() => setTheme('system')} title="System" style={pill('system')}>A</button>
      <button onClick={() => setTheme('light')} title="Light" style={pill('light')}>
        <svg width="15" height="15" viewBox="0 0 18 18"><circle cx="9" cy="9" r="3.6" fill="currentColor" /><g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.8 3.8l1.4 1.4M12.8 12.8l1.4 1.4M14.2 3.8l-1.4 1.4M5.2 12.8l-1.4 1.4" /></g></svg>
      </button>
      <button onClick={() => setTheme('dark')} title="Dark" style={pill('dark')}>
        <svg width="15" height="15" viewBox="0 0 18 18"><path d="M14.5 10.5A6 6 0 0 1 7.5 3.5a6 6 0 1 0 7 7z" fill="currentColor" /></svg>
      </button>
    </div>
  )
}
