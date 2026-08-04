import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Hover from '../components/Hover'
import SearchInput from '../components/SearchInput'
import Pager from '../components/Pager'
import { Posts } from '../api/resources'
import { tagColor } from '../lib/constants'
import { dateLabel, rgba } from '../lib/format'
import { makePager, pageSlice } from '../lib/pager'

export default function BlogList() {
  const navigate = useNavigate()
  const [allPosts, setAllPosts] = useState([])
  const [search, setSearch] = useState('')
  const [topic, setTopic] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
    Posts.list().then((p) => setAllPosts(p || [])).catch(() => {})
  }, [])

  const cover = (tag) => `linear-gradient(135deg,${tagColor(tag)},${rgba(tagColor(tag), 0.55)})`

  const topics = useMemo(() => ['all'].concat(Array.from(new Set(allPosts.map((p) => p.tag)))), [allPosts])

  const q = search.trim().toLowerCase()
  const filtered = useMemo(() => {
    let list = allPosts
    if (topic !== 'all') list = list.filter((p) => p.tag === topic)
    if (q) list = list.filter((p) => [p.title, p.excerpt, p.tag].some((v) => String(v || '').toLowerCase().includes(q)))
    return list
  }, [allPosts, topic, q])

  const isFiltered = q !== '' || topic !== 'all'
  const pager = makePager(filtered.length, 6, page, setPage)
  const shown = pageSlice(filtered, pager)

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '60px 40px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em', color: 'var(--strong)' }}>The Blog</h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', marginTop: 10 }}>Notes on building for the web — frontend, backend and the journey in between.</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30, flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search articles…" style={{ flex: 1, minWidth: 240, maxWidth: 420 }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {topics.map((t) => {
            const active = topic === t
            return (
              <button key={t} onClick={() => { setTopic(t); setPage(1) }} style={{ padding: '10px 15px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, border: `1px solid ${active ? 'rgba(52,211,153,0.5)' : 'var(--border2)'}`, background: active ? 'rgba(52,211,153,0.16)' : 'var(--fill)', color: active ? '#1FA779' : 'var(--muted2)' }}>{t === 'all' ? 'All' : t}</button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p style={{ padding: 60, textAlign: 'center', color: 'var(--muted3)', fontSize: 16 }}>{isFiltered ? 'No articles match your search or filter.' : 'There are no blogs yet — come back soon!'}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(330px,1fr))', gap: 22 }}>
          {shown.map((p) => (
            <Hover key={p.id} as="div" onClick={() => navigate(`/blog/${p.id}`)} style={{ display: 'flex', flexDirection: 'column', borderRadius: 20, background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s,border-color .2s' }} hover={{ transform: 'translateY(-4px)', borderColor: 'rgba(52,211,153,0.3)' }}>
              <div style={{ height: 140, background: cover(p.tag), position: 'relative', overflow: 'hidden' }}>
                {p.image && <img src={p.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                <span style={{ position: 'absolute', left: 16, top: 14, zIndex: 1, fontSize: 11.5, fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.4)', padding: '4px 11px', borderRadius: 8, backdropFilter: 'blur(4px)' }}>{p.tag}</span>
              </div>
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 20, lineHeight: 1.3, color: 'var(--strong)', marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted)', flex: 1, marginBottom: 18 }}>{p.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 13, color: 'var(--muted2)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: '#E5577A' }}>♥</span> {p.likeCount}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ color: '#38BDF8' }}>💬</span> {p.comments.length}</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--muted3)' }}>{dateLabel(p.date)}</span>
                </div>
              </div>
            </Hover>
          ))}
        </div>
      )}
      <Pager pager={pager} />
    </div>
  )
}
