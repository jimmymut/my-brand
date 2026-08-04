import { useMemo, useState } from 'react'
import Hover from '../../components/Hover'
import SearchInput from '../../components/SearchInput'
import Pager from '../../components/Pager'
import { workRange, workDuration } from '../../lib/format'
import { makePager } from '../../lib/pager'

export default function WorkTab({ work, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const q = search.trim().toLowerCase()
  const filtered = useMemo(
    () => (q ? work.filter((w) => [w.title, w.desc].some((v) => String(v || '').toLowerCase().includes(q))) : work),
    [work, q]
  )
  const pager = makePager(filtered.length, 4, page, setPage)
  const shown = filtered.map((w, i) => ({ w, i })).slice(pager.from, pager.from + pager.size)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search experience…" style={{ maxWidth: 420 }} />
      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted3)', fontSize: 14.5 }}>{q ? 'No experience matches your search.' : 'No experience entries yet — add one with “Add experience”.'}</div>
      ) : shown.map(({ w, i }) => (
        <div key={w.id} style={{ display: 'grid', gridTemplateColumns: '54px 1fr auto', gap: 20, alignItems: 'start', padding: 24, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 26, color: '#1FA779', lineHeight: 1 }}>{('0' + (i + 1)).slice(-2)}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
              <h4 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 18, color: 'var(--strong)' }}>{w.title}</h4>
              <span style={{ padding: '4px 11px', borderRadius: 7, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', fontFamily: "'JetBrains Mono'", fontSize: 11.5, color: '#1E9BD7' }}>{w.start ? workDuration(w.start, w.end) : '—'}</span>
              {w.start && !w.end && <span style={{ padding: '4px 10px', borderRadius: 7, background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.3)', fontSize: 11, fontWeight: 700, color: '#1FA779' }}>Ongoing</span>}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginBottom: 8, fontFamily: "'JetBrains Mono'" }}>{w.start ? workRange(w.start, w.end) : ''}</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)' }}>{w.desc}</p>
            {w.link && (
              <div style={{ marginTop: 10 }}>
                <a href={w.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#1E9BD7', textDecoration: 'none' }}>Visit <span style={{ fontSize: 14 }}>↗</span></a>
              </div>
            )}
          </div>
          <div className="noprint" style={{ display: 'flex', gap: 8 }}>
            <Hover onClick={() => onEdit(w)} style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }}>Edit</Hover>
            <Hover onClick={() => onDelete(w.id)} style={{ width: 38, padding: '9px 0', borderRadius: 10, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', fontSize: 14, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</Hover>
          </div>
        </div>
      ))}
      <Pager pager={pager} compact />
    </div>
  )
}
