import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hover from '../components/Hover'
import { Skills, Work, Messages } from '../api/resources'
import { workRange, workDuration, initial } from '../lib/format'

const sectionWrap = { maxWidth: 1240, margin: '0 auto', padding: '64px 40px', scrollMarginTop: 80 }

function SectionHead({ num, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 38 }}>
      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 13, color: '#1FA779' }}>{num}</span>
      <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 34, letterSpacing: '-0.02em', color: 'var(--strong)' }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
    </div>
  )
}

export default function Home() {
  const location = useLocation()
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [work, setWork] = useState([])

  useEffect(() => {
    Skills.list().then((s) => setSkills(s || [])).catch(() => {})
    Work.list().then((w) => setWork(w || [])).catch(() => {})
  }, [])

  // Scroll to a section when navigated here with intent.
  useEffect(() => {
    const id = location.state && location.state.scrollTo
    if (id) {
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' })
      }, 60)
    }
  }, [location.state])

  return (
    <>
      {/* HERO */}
      <header style={{ maxWidth: 1240, margin: '0 auto', padding: '80px 40px 66px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(360px,1fr))', gap: 56, alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '7px 14px', borderRadius: 100, border: '1px solid rgba(52,211,153,0.28)', background: 'rgba(52,211,153,0.08)', fontFamily: "'JetBrains Mono'", fontSize: 12.5, fontWeight: 500, color: '#1FA779', marginBottom: 26 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 10px #34D399' }} />
            Full-Stack Developer · Kigali, Rwanda
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 70, lineHeight: 0.98, letterSpacing: '-0.03em', marginBottom: 24, color: 'var(--strong)' }}>
            Coding is fun —<br />
            <span style={{ background: 'linear-gradient(120deg,#34D399,#38BDF8)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>building is better.</span>
          </h1>
          <p style={{ fontSize: 18.5, lineHeight: 1.62, color: 'var(--muted)', maxWidth: 540, marginBottom: 36 }}>
            I'm Jimmy Mutabazi, a full-stack engineer from Rwanda. I design and ship clean web applications across the stack — from pixel-tight React frontends to Node &amp; Django backends.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <button onClick={() => { const el = document.getElementById('work'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' }) }} style={{ padding: '14px 26px', borderRadius: 12, border: 'none', fontSize: 15.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 10px 28px rgba(16,185,129,0.32)', cursor: 'pointer' }}>View my work</button>
            <button onClick={() => navigate('/blog')} style={{ padding: '14px 26px', borderRadius: 12, fontSize: 15.5, fontWeight: 700, color: 'var(--text)', background: 'var(--fill)', border: '1px solid var(--border2)', cursor: 'pointer' }}>Read the blog</button>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'relative', height: 380, borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border2)', boxShadow: '0 30px 70px var(--shadow)', background: '#0A0E17' }}>
            {['code.jpg', 'code2.jpg', 'code3.jpg'].map((img, i) => (
              <img key={img} src={`/assets/${img}`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.05) brightness(0.85)', animation: 'heroSlide 21s ease-in-out infinite both', animationDelay: `${i * 7}s` }} />
            ))}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(10,14,23,0.1),rgba(10,14,23,0.7))' }} />
            <div style={{ position: 'absolute', left: 18, top: 16, display: 'flex', gap: 7 }}>
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FB7185' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#FBBF24' }} />
              <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#34D399' }} />
            </div>
            <div style={{ position: 'absolute', left: 20, bottom: 18, fontFamily: "'JetBrains Mono'", fontSize: 13, color: '#CBD5E1' }}>
              <span style={{ color: '#7E8A9C' }}>const</span> <span style={{ color: '#34D399' }}>dev</span> = <span style={{ color: '#FBBF24' }}>'Jimmy'</span>;
            </div>
          </div>
          <div style={{ position: 'absolute', right: -18, bottom: -22, animation: 'floaty 5s ease-in-out infinite', padding: '16px 20px', borderRadius: 16, background: 'var(--surface2)', border: '1px solid var(--border2)', boxShadow: '0 18px 40px var(--shadow)' }}>
            <div style={{ fontSize: 12, color: 'var(--muted3)', fontFamily: "'JetBrains Mono'" }}>currently</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--strong)', marginTop: 3 }}>Andela ATLP →</div>
          </div>
        </div>
      </header>

      {/* ABOUT */}
      <section id="about" style={sectionWrap}>
        <SectionHead num="01" title="About me" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 48, alignItems: 'center' }}>
          <div style={{ position: 'relative', maxWidth: 330 }}>
            <div style={{ position: 'absolute', inset: -12, borderRadius: 24, background: 'linear-gradient(135deg,rgba(52,211,153,0.25),rgba(56,189,248,0.18))', filter: 'blur(2px)' }} />
            <img src="/assets/portrait.png" alt="Jimmy Mutabazi" style={{ position: 'relative', width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 20, border: '1px solid var(--border2)' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 25, marginBottom: 18, lineHeight: 1.3, color: 'var(--strong)' }}>Hi! I'm Jimmy — an engineer who switched from telecom to building for the web.</h3>
            <p style={{ fontSize: 16.5, lineHeight: 1.72, color: 'var(--muted)', marginBottom: 18 }}>A Rwandan citizen, I studied Electronics &amp; Telecommunication Engineering at the University of Rwanda (Huye &amp; Nyarugenge). I then moved into tech, completing a three-month full-stack program with I4GxZuri (2022 Cohort I) — HTML, CSS &amp; JavaScript on the frontend and Django on the backend.</p>
            <p style={{ fontSize: 16.5, lineHeight: 1.72, color: 'var(--muted)' }}>To sharpen my craft, I joined the Andela Technical Leadership Program (ATLP) — a nine-month journey toward becoming a top-tier web developer.</p>
            <Hover style={{ marginTop: 22, padding: '12px 22px', borderRadius: 11, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }} onClick={() => navigate('/about')}>More about me →</Hover>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={sectionWrap}>
        <SectionHead num="02" title="Skills & tools" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18 }}>
          {skills.slice(0, 6).map((s) => (
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <Hover style={{ padding: '12px 24px', borderRadius: 11, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }} onClick={() => navigate('/skills')}>View all skills →</Hover>
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={sectionWrap}>
        <SectionHead num="03" title="What I've done so far" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {work.slice(0, 3).map((w, i) => (
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
          <Hover style={{ padding: '12px 24px', borderRadius: 11, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 14.5, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }} onClick={() => navigate('/work')}>View all experience →</Hover>
        </div>
      </section>

      {/* CONTACT */}
      <ContactSection />
    </>
  )
}

function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', msg: '' })
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const send = async () => {
    if (!form.name.trim()) return setErr('Please enter your name')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) return setErr('Enter a valid email')
    if (!form.msg.trim()) return setErr('Please write a message')
    try {
      await Messages.send({ name: form.name.trim(), email: form.email.trim(), phone: form.phone || '+250000000000', message: form.msg.trim() })
    } catch { /* still acknowledge to the visitor */ }
    setSent(true); setErr('')
  }

  const input = (extra) => ({ padding: '12px 14px', borderRadius: 11, background: 'var(--input)', border: '1px solid var(--border2)', fontSize: 14, outline: 'none', color: 'var(--strong)', ...extra })

  return (
    <section id="contact" style={{ maxWidth: 1240, margin: '0 auto', padding: '64px 40px 30px', scrollMarginTop: 80 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 40, alignItems: 'center', borderRadius: 28, border: '1px solid var(--border2)', background: 'linear-gradient(135deg,rgba(52,211,153,0.10),rgba(56,189,248,0.05))', padding: 48 }}>
        <div>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 40, letterSpacing: '-0.025em', marginBottom: 14, color: 'var(--strong)' }}>Let's build something together.</h2>
          <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 420 }}>Have a project, a role, or an idea? Send a message and it'll land straight in my inbox.</p>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: 26, boxShadow: '0 18px 40px var(--shadow)' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✓</div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--strong)', marginBottom: 6 }}>Message sent!</div>
              <div style={{ fontSize: 14, color: 'var(--muted2)' }}>Thanks {form.name} — I'll get back to you soon.</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <input value={form.name} onChange={set('name')} placeholder="Your name" style={input({ flex: 1, minWidth: 0, border: `1px solid ${err && !form.name ? 'rgba(251,113,133,0.6)' : 'var(--border2)'}` })} />
                <input value={form.phone} onChange={set('phone')} placeholder="Phone (optional)" style={input({ flex: 1, minWidth: 0 })} />
              </div>
              <input value={form.email} onChange={set('email')} placeholder="Email" style={input({ width: '100%', marginBottom: 12 })} />
              <textarea value={form.msg} onChange={set('msg')} placeholder="Your message…" style={input({ width: '100%', minHeight: 96, resize: 'vertical', lineHeight: 1.5, marginBottom: 6 })} />
              {err && <div style={{ fontSize: 12.5, color: '#E5577A', marginBottom: 10 }}>{err}</div>}
              <button onClick={send} style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', cursor: 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>Send message</button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
