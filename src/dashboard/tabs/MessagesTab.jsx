import { useMemo, useState } from 'react'
import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import SearchInput from '../../components/SearchInput'
import Pager from '../../components/Pager'
import { dateLabel } from '../../lib/format'
import { makePager, pageSlice } from '../../lib/pager'

const COLS = '1.1fr 1.4fr 2.4fr 130px 78px'
const filterBtn = (active) => ({ padding: '9px 15px', borderRadius: 10, border: '1px solid var(--border2)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, background: active ? 'rgba(52,211,153,0.14)' : 'transparent', color: active ? '#1FA779' : 'var(--muted)' })

export default function MessagesTab({ messages, onToggleRead, onDelete }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | unread | read
  const [page, setPage] = useState(1)

  const q = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = messages.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
    if (q) list = list.filter((m) => [m.name, m.email, m.message, m.phone].some((v) => String(v || '').toLowerCase().includes(q)))
    if (filter === 'unread') list = list.filter((m) => !m.read)
    else if (filter === 'read') list = list.filter((m) => m.read)
    return list
  }, [messages, q, filter])
  const pager = makePager(filtered.length, 3, page, setPage)
  const rows = pageSlice(filtered, pager)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name, email or message…" style={{ flex: 1, minWidth: 240, maxWidth: 420 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => { setFilter('all'); setPage(1) }} style={filterBtn(filter === 'all')}>All</button>
          <button onClick={() => { setFilter('unread'); setPage(1) }} style={filterBtn(filter === 'unread')}>Unread</button>
          <button onClick={() => { setFilter('read'); setPage(1) }} style={filterBtn(filter === 'read')}>Read</button>
        </div>
      </div>

      <div style={{ borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--border)', fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted3)', fontWeight: 700 }}>
          <div>From</div><div>Email</div><div>Message</div><div>Date</div><div />
        </div>
        {filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted3)', fontSize: 14 }}>No messages match.</div>
        ) : rows.map((m) => (
          <div key={m.id} style={{ display: 'grid', gridTemplateColumns: COLS, gap: 14, padding: '16px 22px', borderBottom: '1px solid var(--border)', alignItems: 'center', background: m.read ? 'transparent' : 'rgba(52,211,153,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              {!m.read && <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: '#34D399' }} />}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted3)' }}>{m.phone}</div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</div>
            <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.5 }}>{m.message}</div>
            <div style={{ fontSize: 13, color: 'var(--muted2)' }}>{dateLabel(m.date)}</div>
            <div className="noprint" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <AsyncButton onClick={() => onToggleRead(m)} title={m.read ? 'Mark unread' : 'Mark read'} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'var(--hover)' }}>{m.read ? '○' : '●'}</AsyncButton>
              <AsyncButton onClick={() => onDelete(m.id)} title="Delete" style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 14 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
            </div>
          </div>
        ))}
      </div>
      <Pager pager={pager} compact />
    </div>
  )
}
