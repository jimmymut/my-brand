import { useMemo, useState } from 'react'
import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import SearchInput from '../../components/SearchInput'
import Pager from '../../components/Pager'
import { initial } from '../../lib/format'
import { makePager, pageSlice } from '../../lib/pager'

export default function SkillsTab({ skills, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const q = search.trim().toLowerCase()
  const filtered = useMemo(
    () => (q ? skills.filter((s) => [s.name, s.desc].some((v) => String(v || '').toLowerCase().includes(q))) : skills),
    [skills, q]
  )
  const pager = makePager(filtered.length, 6, page, setPage)
  const shown = pageSlice(filtered, pager)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search skills…" style={{ flex: 1, minWidth: 240, maxWidth: 420 }} />
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted3)', fontSize: 14.5 }}>{q ? 'No skills match your search.' : 'No skills yet — add one with “Add skill”.'}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18 }}>
          {shown.map((s) => (
            <div key={s.id} style={{ padding: 22, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 13, background: 'var(--fill)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {s.icon ? <img src={s.icon} alt={s.name} style={{ width: 28, height: 28, objectFit: 'contain' }} /> : <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: '#1FA779' }}>{initial(s.name)}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, color: 'var(--strong)' }}>{s.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{s.level}% proficiency</div>
                </div>
              </div>
              <div style={{ height: 7, borderRadius: 100, background: 'var(--fill)', overflow: 'hidden', marginBottom: 14 }}>
                <div style={{ height: '100%', borderRadius: 100, background: 'linear-gradient(90deg,#34D399,#10B981)', width: `${s.level}%` }} />
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted)', marginBottom: 16, minHeight: 38 }}>{s.desc}</p>
              <div className="noprint" style={{ display: 'flex', gap: 8 }}>
                <Hover onClick={() => onEdit(s)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }}>Edit</Hover>
                <AsyncButton onClick={() => onDelete(s.id)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'rgba(251,113,133,0.18)' }}>Delete</AsyncButton>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pager pager={pager} compact />
    </div>
  )
}
