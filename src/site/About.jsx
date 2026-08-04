import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hover from '../components/Hover'

const chip = { padding: '8px 14px', borderRadius: 100, background: 'var(--fill)', border: '1px solid var(--border2)', fontSize: 13, fontWeight: 600, color: 'var(--text2)' }

export default function About() {
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const contact = () => navigate('/', { state: { scrollTo: 'contact' } })

  return (
    <div style={{ position: 'relative', zIndex: 1, maxWidth: 1240, margin: '0 auto', padding: '60px 40px' }}>
      <div style={{ marginBottom: 42 }}>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em', color: 'var(--strong)' }}>About me</h1>
        <p style={{ fontSize: 17, color: 'var(--muted)', marginTop: 10 }}>From telecom engineering to building for the web.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'start' }}>
        <div style={{ position: 'relative', maxWidth: 360 }}>
          <div style={{ position: 'absolute', inset: -12, borderRadius: 24, background: 'linear-gradient(135deg,rgba(52,211,153,0.25),rgba(56,189,248,0.18))', filter: 'blur(2px)' }} />
          <img src="/assets/portrait.png" alt="Jimmy Mutabazi" style={{ position: 'relative', width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 20, border: '1px solid var(--border2)' }} />
        </div>
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 25, marginBottom: 18, lineHeight: 1.3, color: 'var(--strong)' }}>Hi! I'm Jimmy — an engineer who switched from telecom to building for the web.</h3>
          <p style={{ fontSize: 16.5, lineHeight: 1.72, color: 'var(--muted)', marginBottom: 18 }}>A Rwandan citizen, I studied Electronics &amp; Telecommunication Engineering at the University of Rwanda (Huye &amp; Nyarugenge). I then moved into tech, completing a three-month full-stack program with I4GxZuri (2022 Cohort I) — HTML, CSS &amp; JavaScript on the frontend and Django on the backend.</p>
          <p style={{ fontSize: 16.5, lineHeight: 1.72, color: 'var(--muted)', marginBottom: 24 }}>To sharpen my craft, I joined the Andela Technical Leadership Program (ATLP) — a nine-month journey toward becoming a top-tier web developer. I care about clean code, thoughtful interfaces, and shipping things that genuinely help people.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
            <span style={chip}>📍 Kigali, Rwanda</span>
            <span style={chip}>🎓 University of Rwanda</span>
            <span style={chip}>⚡ Andela ATLP</span>
            <span style={chip}>💻 I4GxZuri Full-Stack</span>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/work')} style={{ padding: '13px 24px', borderRadius: 12, border: 'none', fontSize: 14.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', cursor: 'pointer' }}>See my experience →</button>
            <Hover style={{ padding: '13px 24px', borderRadius: 12, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }} onClick={contact}>Get in touch</Hover>
          </div>
        </div>
      </div>
    </div>
  )
}
