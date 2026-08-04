import { useEffect, useMemo, useState } from 'react'
import Hover from '../components/Hover'
import SearchInput from '../components/SearchInput'
import Pager from '../components/Pager'
import { Skills } from '../api/resources'
import { makePager, pageSlice } from '../lib/pager'
import { initial } from '../lib/format'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
    Skills.list().then((s) => setSkills(s || [])).catch(() => {})
  }, [])

  const q = search.trim().toLowerCase()
  const filtered = useMemo(
    () => (q ? skills.filter((s) => [s.name, s.desc].some((v) => String(v || '').toLowerCase().includes(q))) : skills),
    [skills, q]
  )
  const pager = makePager(filtered.length, 9, page, setPage)
  const shown = pageSlice(filtered, pager)

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '60px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 30 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em', color: 'var(--strong)' }}>Skills &amp; tools</h1>
          <p style={{ fontSize: 17, color: 'var(--muted)', marginTop: 10 }}>The technologies I reach for, and how confident I am with each.</p>
        </div>
        <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search skills…" style={{ width: 280, maxWidth: '100%' }} />
      </div>
      {filtered.length === 0 ? (
        <p style={{ padding: 60, textAlign: 'center', color: 'var(--muted3)', fontSize: 16 }}>No skills match your search.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {shown.map((s) => (
            <Hover key={s.id} as="div" style={{ padding: 22, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', transition: 'transform .2s, border-color .2s' }} hover={{ transform: 'translateY(-4px)', borderColor: 'rgba(52,211,153,0.35)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 13, background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                {s.icon ? <img src={s.icon} alt={s.name} style={{ width: 30, height: 30, objectFit: 'contain' }} /> : <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: '#1FA779' }}>{initial(s.name)}</span>}
              </div>
              <h4 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 18, marginBottom: 7, color: 'var(--strong)' }}>{s.name}</h4>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted2)', marginBottom: 15 }}>{s.desc}</p>
              <div style={{ height: 6, borderRadius: 100, background: 'var(--fill)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 100, background: 'linear-gradient(90deg,#34D399,#10B981)', width: `${s.level}%` }} />
              </div>
            </Hover>
          ))}
        </div>
      )}
      <Pager pager={pager} />
    </div>
  )
}
