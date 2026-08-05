import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Hover from '../components/Hover'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { Posts } from '../api/resources'
import { tagColor } from '../lib/constants'
import { dateLabel, rgba, initial } from '../lib/format'

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const [post, setPost] = useState(null)
  const [liked, setLiked] = useState(false)
  const [draft, setDraft] = useState('')
  const [cErr, setCErr] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    Posts.get(id).then((p) => { if (p) setPost(p) }).catch(() => {})
  }, [id])

  if (!post) {
    return (
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '46px 40px 80px' }}>
        <p style={{ color: 'var(--muted3)' }}>Post not found.</p>
      </div>
    )
  }

  const cover = `linear-gradient(135deg,${tagColor(post.tag)},${rgba(tagColor(post.tag), 0.5)})`

  // confirm-first: only reflect the like/comment after the backend accepts it
  const toggleLike = async () => {
    if (!user) return navigate('/login')
    try {
      const res = await Posts.toggleLike(id)
      setLiked((v) => !v)
      if (res && typeof res.likes === 'number') setPost((p) => ({ ...p, likeCount: res.likes }))
      else setPost((p) => ({ ...p, likeCount: p.likeCount + (liked ? -1 : 1) }))
    } catch (e) {
      if (!(e && e.status === 401)) toast('Could not update your like. Please try again.', 'error')
    }
  }

  const addComment = async () => {
    if (!user) return navigate('/login')
    const text = draft.trim()
    if (text.length < 2) return setCErr('Please write a comment first')
    setCErr(''); setPosting(true)
    try {
      await Posts.addComment(id, text)
      const comments = await Posts.comments(id) // pull the saved comment (real id + author)
      setPost((p) => ({ ...p, comments }))
      setDraft('')
    } catch (e) {
      setCErr(e && e.status === 401 ? 'Your session expired — please log in again.' : 'Could not post your comment. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto', padding: '46px 40px 80px' }}>
      <Hover style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 26, padding: '9px 15px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }} hover={{ background: 'var(--hover)', color: 'var(--text)' }} onClick={() => navigate('/blog')}>← All posts</Hover>

      <div style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, color: '#fff', background: cover, padding: '5px 13px', borderRadius: 8, marginBottom: 16 }}>{post.tag}</div>
      <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 40, lineHeight: 1.12, letterSpacing: '-0.02em', color: 'var(--strong)', marginBottom: 14 }}>{post.title}</h1>
      <div style={{ fontSize: 13.5, color: 'var(--muted3)', marginBottom: 26 }}>Published {dateLabel(post.date)} · by Jimmy Mutabazi</div>
      <div style={{ height: 220, borderRadius: 20, background: cover, marginBottom: 30, position: 'relative', overflow: 'hidden' }}>
        {post.image && <img src={post.image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ fontSize: 17, lineHeight: 1.78, color: 'var(--text2)' }}>
        {post.body.map((para, i) => <p key={i} style={{ marginBottom: 20 }}>{para}</p>)}
      </div>

      {/* like + comment counts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '30px 0', padding: '18px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={toggleLike} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 18px', borderRadius: 12, cursor: 'pointer', fontSize: 14.5, fontWeight: 700, border: `1px solid ${liked ? 'rgba(251,113,133,0.4)' : 'var(--border2)'}`, background: liked ? 'rgba(251,113,133,0.14)' : 'var(--fill)', color: liked ? '#E5577A' : 'var(--muted)' }}>
          <span style={{ fontSize: 16 }}>{liked ? '♥' : '♡'}</span> {post.likeCount}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14.5, color: 'var(--muted2)', fontWeight: 600 }}><span style={{ color: '#38BDF8' }}>💬</span> {post.comments.length} comments</div>
      </div>

      {/* comments */}
      <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 21, color: 'var(--strong)', marginBottom: 18 }}>Comments</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 26 }}>
        {post.comments.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted3)', fontSize: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>No comments yet — be the first to share your thoughts.</div>
        ) : (
          post.comments.map((c) => (
            <div key={c.id} style={{ padding: '16px 18px', borderRadius: 14, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: `linear-gradient(135deg,#34D399,${rgba('#34D399', 0.55)})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>{initial(c.user)}</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.user}</span>
                <span style={{ fontSize: 12, color: 'var(--muted3)', marginLeft: 'auto' }}>{dateLabel(c.date)}</span>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--text2)' }}>{c.text}</p>
            </div>
          ))
        )}
      </div>

      {/* add comment */}
      {user ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your comment…" style={{ width: '100%', minHeight: 90, resize: 'vertical', padding: 14, borderRadius: 14, background: 'var(--input)', border: `1px solid ${cErr ? 'rgba(251,113,133,0.6)' : 'var(--border2)'}`, fontSize: 14.5, lineHeight: 1.5, outline: 'none', color: 'var(--strong)' }} />
          {cErr && <div style={{ fontSize: 12.5, color: '#E5577A' }}>{cErr}</div>}
          <button onClick={addComment} disabled={posting} style={{ alignSelf: 'flex-start', padding: '12px 22px', borderRadius: 12, border: 'none', fontSize: 14.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', cursor: posting ? 'default' : 'pointer', opacity: posting ? 0.75 : 1 }}>{posting ? 'Posting…' : 'Post comment'}</button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '20px 22px', borderRadius: 14, background: 'var(--fill)', border: '1px solid var(--border2)' }}>
          <span style={{ fontSize: 14.5, color: 'var(--muted)' }}>Please log in to like this post or add a comment.</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/login')} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--surface)', color: 'var(--text)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Log in</button>
            <button onClick={() => navigate('/register')} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Sign up</button>
          </div>
        </div>
      )}
    </div>
  )
}
