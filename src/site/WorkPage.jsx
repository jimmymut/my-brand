import { useEffect, useMemo, useState } from 'react'
import Hover from '../components/Hover'
import SearchInput from '../components/SearchInput'
import Pager from '../components/Pager'
import { Work } from '../api/resources'
import { makePager } from '../lib/pager'
import { workRange, workDuration } from '../lib/format'

export default function WorkPage() {
  const [work, setWork] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
    Work.list().then((w) => setWork(w || [])).catch(() => {})
  }, [])

  const q = search.trim().toLowerCase()
  const filtered = useMemo(
    () => (q ? work.filter((w) => [w.title, w.desc].some((v) => String(v || '').toLowerCase().includes(q))) : work),
    [work, q]
  )
  const pager = makePager(filtered.length, 5, page, setPage)
  // number reflects original index; slice the filtered set for the page
  const shown = filtered.map((w, i) => ({ w, i })).slice(pager.from, pager.from + pager.size)

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '60px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 30 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em', color: 'var(--strong)' }}>Experience</h1>
          <p style={{ fontSize: 17, color: 'var(--muted)', marginTop: 10 }}>Programs, internships and roles that shaped how I build.</p>
        </div>
        <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search experience…" style={{ width: 280, maxWidth: '100%' }} />
      </div>
      {filtered.length === 0 ? (
        <p style={{ padding: 60, textAlign: 'center', color: 'var(--muted3)', fontSize: 16 }}>No experience matches your search.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {shown.map(({ w, i }) => (
            <Hover key={w.id} as="div" style={{ display: 'grid', gridTemplateColumns: '62px 1fr', gap: 24, padding: 26, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color .2s' }} hover={{ borderColor: 'rgba(56,189,248,0.30)' }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 30, color: '#1FA779', lineHeight: 1 }}>{('0' + (i + 1)).slice(-2)}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 7 }}>
                  <h4 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 19, color: 'var(--strong)' }}>{w.title}</h4>
                  <span style={{ padding: '4px 11px', borderRadius: 7, background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)', fontFamily: "'JetBrains Mono'", fontSize: 11.5, color: '#1E9BD7' }}>{w.start ? workDuration(w.start, w.end) : ''}</span>
                  {w.start && !w.end && <span style={{ padding: '4px 10px', borderRadius: 7, background: 'rgba(52,211,153,0.14)', border: '1px solid rgba(52,211,153,0.3)', fontSize: 11, fontWeight: 700, color: '#1FA779' }}>Present</span>}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginBottom: 9, fontFamily: "'JetBrains Mono'" }}>{w.start ? workRange(w.start, w.end) : ''}</div>
                <p style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--muted)' }}>{w.desc}</p>
                {w.link && (
                  <div style={{ marginTop: 11 }}>
                    <a href={w.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 700, color: '#1E9BD7', textDecoration: 'none' }}>Visit project <span>↗</span></a>
                  </div>
                )}
              </div>
            </Hover>
          ))}
        </div>
      )}
      <Pager pager={pager} />
    </div>
  )
}
