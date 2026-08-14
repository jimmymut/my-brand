import { useMemo, useState } from 'react'
import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import SearchInput from '../../components/SearchInput'
import Pager from '../../components/Pager'
import { tagColor } from '../../lib/constants'
import { dateLabel, rgba } from '../../lib/format'
import { makePager, pageSlice } from '../../lib/pager'

export default function BlogTab({ posts, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState('all')
  const [page, setPage] = useState(1)
  const cover = (tag) => `linear-gradient(135deg,${tagColor(tag)},${rgba(tagColor(tag), 0.5)})`

  const topics = useMemo(() => ['all'].concat(Array.from(new Set(posts.map((p) => p.tag)))), [posts])
  const q = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = posts
    if (topic !== 'all') list = list.filter((p) => p.tag === topic)
    if (q) list = list.filter((p) => [p.title, p.excerpt, p.tag].some((v) => String(v || '').toLowerCase().includes(q)))
    return list
  }, [posts, topic, q])
  const isFiltered = q !== '' || topic !== 'all'
  const pager = makePager(filtered.length, 3, page, setPage)
  const shown = pageSlice(filtered, pager)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search articles…" style={{ flex: 1, minWidth: 240, maxWidth: 420 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {topics.map((t) => {
            const active = topic === t
            return <button key={t} onClick={() => { setTopic(t); setPage(1) }} style={{ padding: '10px 15px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, border: `1px solid ${active ? 'rgba(52,211,153,0.5)' : 'var(--border2)'}`, background: active ? 'rgba(52,211,153,0.16)' : 'var(--fill)', color: active ? '#1FA779' : 'var(--muted)' }}>{t === 'all' ? 'All' : t}</button>
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted3)', fontSize: 14.5 }}>{isFiltered ? 'No articles match your search or filter.' : 'No articles yet — write your first with “New post”.'}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 18 }}>
          {shown.map((p) => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ height: 96, background: cover(p.tag), position: 'relative', overflow: 'hidden' }}>
                {p.image && <img src={p.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <span style={{ position: 'absolute', left: 16, top: 14, zIndex: 1, fontSize: 11.5, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.4)', padding: '4px 11px', borderRadius: 8, backdropFilter: 'blur(4px)' }}>{p.tag}</span>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 18, lineHeight: 1.3, color: 'var(--strong)', marginBottom: 9 }}>{p.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)', flex: 1, marginBottom: 16 }}>{p.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12.5, color: 'var(--muted2)', marginBottom: 16 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: '#E5577A' }}>♥</span> {p.likeCount}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: '#38BDF8' }}>💬</span> {p.comments.length}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--muted3)' }}>{dateLabel(p.date)}</span>
                </div>
                <div className="noprint" style={{ display: 'flex', gap: 8 }}>
                  <Hover onClick={() => onEdit(p)} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }}>Edit</Hover>
                  <AsyncButton onClick={() => onDelete(p.id)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'rgba(251,113,133,0.18)' }}>Delete</AsyncButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Pager pager={pager} compact />
    </div>
  )
}
