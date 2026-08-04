// Renders a pager bar (Showing X–Y of Z + numbered tokens). `compact` uses the
// dashboard's slightly smaller 34px buttons; default uses the site's 38px ones.
export default function Pager({ pager, compact = false }) {
  if (!pager.multiPage) return null
  const sz = compact ? 34 : 38
  const fs = compact ? 13.5 : 14
  const arrow = compact ? 15 : 16
  return (
    <div className="noprint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginTop: compact ? 22 : 28, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13.5, color: 'var(--muted2)' }}>Showing {pager.fromLabel}–{pager.toLabel} of {pager.total}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 6 : 7 }}>
        <button onClick={pager.onPrev} style={{ minWidth: sz, height: sz, padding: '0 12px', borderRadius: compact ? 9 : 10, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', cursor: 'pointer', fontSize: arrow, fontWeight: 700 }}>‹</button>
        {pager.tokens.map((t, i) => (
          <button key={i} onClick={t.onClick} style={{ minWidth: sz, height: sz, borderRadius: compact ? 9 : 10, border: `1px solid ${t.bd}`, background: t.bg, color: t.fg, cursor: t.cursor, fontSize: fs, fontWeight: 700 }}>{t.label}</button>
        ))}
        <button onClick={pager.onNext} style={{ minWidth: sz, height: sz, padding: '0 12px', borderRadius: compact ? 9 : 10, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', cursor: 'pointer', fontSize: arrow, fontWeight: 700 }}>›</button>
      </div>
    </div>
  )
}
