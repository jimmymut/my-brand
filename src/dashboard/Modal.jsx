import { useState } from 'react'
import { CATS, BUCKETS, MONTHS, TAGS, PRIORITIES, GOAL_COLORS, goalMonths } from '../lib/constants'
import { fmt, monthFull, dateLabel, today } from '../lib/format'
import AsyncButton from '../components/AsyncButton'

const TITLES = {
  income: (e) => (e ? 'Edit income' : 'Add income'),
  expense: (e) => (e ? 'Edit expense' : 'Add expense'),
  saving: (e) => (e ? 'Edit contribution' : 'Record saving'),
  post: (e) => (e ? 'Edit article' : 'New article'),
  skill: (e) => (e ? 'Edit skill' : 'Add skill'),
  work: (e) => (e ? 'Edit experience' : 'Add experience'),
  budgetItem: (e) => (e ? 'Edit budget item' : 'Add budget item'),
  goal: (e) => (e ? 'Edit goal' : 'New savings goal'),
  goalTarget: () => 'Adjust monthly target',
  debt: (e) => (e ? 'Edit debt' : 'Add a debt'),
  debtPayment: () => 'Record a payment',
}
const ICON_OPTS = [
  ['HTML', '/assets/skill-html.png'], ['CSS', '/assets/skill-css.png'], ['JS', '/assets/skill-js.png'],
  ['Node', '/assets/skill-node.png'], ['Express', '/assets/skill-express.png'], ['Mongo', '/assets/skill-mongo.png'],
  ['Django', '/assets/skill-django.png'], ['Figma', '/assets/skill-figma.png'], ['None', ''],
]

const lbl = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 8 }
const inp = (border) => ({ width: '100%', padding: '13px 15px', borderRadius: 11, background: 'var(--input)', border: `1px solid ${border || 'var(--border2)'}`, color: 'var(--strong)', fontSize: 14.5, outline: 'none' })
const errStyle = { fontSize: 12, color: '#E5577A', marginTop: 6 }

function pillStyle(active) {
  return active
    ? { bg: 'rgba(52,211,153,0.16)', fg: '#1FA779', bd: 'rgba(52,211,153,0.5)' }
    : { bg: 'var(--fill)', fg: 'var(--muted)', bd: 'var(--border2)' }
}
function Pills({ options, value, onPick }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      {options.map((o) => {
        const p = pillStyle(value === o.value)
        return (
          <button key={String(o.value)} onClick={() => onPick(o.value)} style={{ padding: '9px 14px', borderRadius: 10, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, border: `1px solid ${p.bd}`, background: p.bg, color: p.fg }}>{o.name}</button>
        )
      })}
    </div>
  )
}

export default function Modal({ kind, edit, initial, onClose, onSave, onRemove, bucketOptions, monthDeposits = [], onRemoveContrib }) {
  const goalOpts = bucketOptions && bucketOptions.length ? bucketOptions : BUCKETS.map((b) => ({ value: b.id, name: b.short, account: b.account }))
  const [f, setF] = useState(() => ({ ...initial }))
  const [err, setErr] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const onInput = (k) => (e) => set(k, e.target.value)

  // Await the backend before closing; on failure onSave returns false and the
  // modal stays open (a toast explains) — nothing is shown as saved unless it was.
  const commit = async (payload) => {
    setSaving(true)
    const ok = await onSave(payload)
    if (ok === false) setSaving(false) // otherwise the modal unmounts on success
  }

  const readImage = (key, e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const r = new FileReader()
    r.onload = () => set(key, r.result) // data URL — preview only
    r.readAsDataURL(file)
    set(key + 'File', file)             // raw File — uploaded via multipart on save
  }

  const submit = () => {
    const e = {}
    if (kind === 'budgetItem') {
      const amt = parseFloat(String(f.amount == null ? '' : f.amount).replace(/[^0-9.]/g, ''))
      if (!String(f.name || '').trim()) e.name = 'Name is required'
      if (!amt || amt < 0) e.amount = 'Enter a valid cost'
      if (Object.keys(e).length) return setErr(e)
      return commit({ ...f, name: f.name.trim(), amount: amt })
    }
    if (kind === 'post') {
      if (!String(f.title || '').trim()) e.title = 'Title is required'
      if (!String(f.excerpt || '').trim()) e.excerpt = 'Excerpt is required'
      if (f.tag === 'Other' && !String(f.customTopic || '').trim()) e.customTopic = 'Please specify the topic'
      if (Object.keys(e).length) return setErr(e)
      return commit({ ...f, tag: f.tag === 'Other' ? f.customTopic.trim() : f.tag })
    }
    if (kind === 'skill') {
      if (!String(f.name || '').trim()) return setErr({ name: 'Skill name is required' })
      return commit({ ...f, level: Math.max(0, Math.min(100, parseInt(f.level, 10) || 0)) })
    }
    if (kind === 'work') {
      if (!String(f.title || '').trim()) return setErr({ title: 'Title is required' })
      return commit({ ...f })
    }
    if (kind === 'goal') {
      const amt = parseFloat(String(f.target == null ? '' : f.target).replace(/[^0-9.]/g, ''))
      if (!String(f.name || '').trim()) e.name = 'Goal name is required'
      if (!amt || amt <= 0) e.amount = 'Enter a monthly target'
      if (!f.startMonth) e.startMonth = 'Choose a start month'
      if (Object.keys(e).length) return setErr(e)
      return commit({ ...f, name: f.name.trim(), target: amt })
    }
    if (kind === 'goalTarget') {
      const amt = parseFloat(String(f.target == null ? '' : f.target).replace(/[^0-9.]/g, ''))
      if (!amt || amt <= 0) e.target = 'Enter a monthly target'
      if (!f.month) e.month = 'Choose the month it takes effect'
      if (Object.keys(e).length) return setErr(e)
      return commit({ ...f, target: amt })
    }
    if (kind === 'debt') {
      const amt = parseFloat(String(f.amount == null ? '' : f.amount).replace(/[^0-9.]/g, ''))
      if (!String(f.name || '').trim()) e.name = (f.direction === 'lent' ? 'Borrower' : 'Lender') + ' name is required'
      if (!amt || amt <= 0) e.amount = 'Enter a valid amount'
      if (Object.keys(e).length) return setErr(e)
      return commit({ ...f, name: f.name.trim(), amount: amt, direction: f.direction || 'borrowed' })
    }
    if (kind === 'debtPayment') {
      const amt = parseFloat(String(f.amount == null ? '' : f.amount).replace(/[^0-9.]/g, ''))
      if (!amt || amt <= 0) return setErr({ amount: 'Enter a valid amount' })
      return commit({ ...f, amount: amt })
    }
    // finance
    const amt = parseFloat(String(f.amount == null ? '' : f.amount).replace(/[^0-9.]/g, ''))
    if (!amt || amt <= 0) e.amount = 'Enter an amount greater than 0'
    if (kind === 'expense' && f.category === 'other' && !String(f.desc || '').trim()) e.desc = 'Description is required for the “Other” category'
    if (kind === 'saving' && !f.bucket) e.bucket = 'Choose a goal'
    if (Object.keys(e).length) return setErr(e)
    commit({ ...f, amount: amt })
  }

  const saveLabel = kind === 'goalTarget' ? 'Update target' : edit ? 'Save changes' : kind === 'post' ? 'Publish' : kind === 'skill' || kind === 'work' ? 'Add' : kind === 'budgetItem' ? 'Add item' : kind === 'goal' ? 'Create goal' : kind === 'debt' ? 'Add debt' : kind === 'debtPayment' ? 'Record payment' : 'Add entry'
  const isFinance = kind === 'income' || kind === 'expense' || kind === 'saving'
  const isOther = kind === 'expense' && f.category === 'other'
  const selGoal = goalOpts.find((o) => o.value === f.bucket)
  const goalMonthOpts = goalMonths(selGoal && selGoal.startMonth)
  // partial-saving progress for the chosen month (top-up toward the monthly target)
  const isDeposit = kind === 'saving' && (f.kind || 'deposit') === 'deposit'
  // only trust the passed month context while the goal & month still match the tapped cell
  const ctxMatches = f._ctxBucket === f.bucket && f._ctxMonth === f.month
  // deposits already recorded for this goal + month (live — updates as you remove them)
  const monthEntries = ctxMatches ? monthDeposits : []
  const savedSoFar = monthEntries.reduce((a, c) => a + (Number(c.amount) || 0), 0)
  const monthTarget = Number(f._target) || 0
  const typedAmt = parseFloat(String(f.amount == null ? '' : f.amount).replace(/[^0-9.]/g, '')) || 0
  const showMonthProgress = isDeposit && monthTarget > 0 && ctxMatches
  const remainingAfter = Math.max(0, monthTarget - savedSoFar - typedAmt)
  const monthPct = monthTarget > 0 ? Math.min(100, Math.round((savedSoFar + typedAmt) / monthTarget * 100)) : 0
  const debtDir = f.direction || 'borrowed'
  const dirStyle = (active, c) => ({ flex: 1, padding: 12, borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, border: `1px solid ${active ? (c === 'red' ? 'rgba(251,113,133,0.4)' : 'rgba(52,211,153,0.4)') : 'var(--border2)'}`, background: active ? (c === 'red' ? 'rgba(251,113,133,0.14)' : 'rgba(52,211,153,0.14)') : 'var(--fill)', color: active ? (c === 'red' ? '#E5577A' : '#1FA779') : 'var(--muted)' })

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--overlay)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, overflow: 'auto' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 460, maxWidth: '100%', maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 20, boxShadow: '0 30px 80px var(--shadow)', animation: 'pop .22s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 28px 16px', flexShrink: 0 }}>
          <h2 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 20, color: 'var(--strong)' }}>{TITLES[kind](edit)}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
        <div style={{ overflowY: 'auto', padding: '4px 28px 4px', flex: '1 1 auto' }}>

        {isFinance && (
          <>
            <label style={lbl}>Amount (FRw)</label>
            <input type="number" value={f.amount == null ? '' : f.amount} onChange={onInput('amount')} placeholder="0" style={{ ...inp(err.amount && 'rgba(251,113,133,0.6)'), fontSize: 17, fontWeight: 700, fontFamily: "'JetBrains Mono'" }} />
            {err.amount && <div style={errStyle}>{err.amount}</div>}
            {showMonthProgress && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted3)', marginBottom: 6 }}>
                  <span>{fmt(savedSoFar)} of {fmt(monthTarget)} saved this month</span>
                  <span style={{ fontWeight: 700, color: remainingAfter > 0 ? 'var(--muted2)' : '#1FA779' }}>{remainingAfter > 0 ? fmt(remainingAfter) + ' to go' : 'target reached ✓'}</span>
                </div>
                <div style={{ height: 6, borderRadius: 100, background: 'var(--fill)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 100, width: monthPct + '%', background: remainingAfter > 0 ? 'linear-gradient(90deg,#34D399,#10B981)' : '#1FA779', transition: 'width .15s' }} />
                </div>
              </div>
            )}
            {isDeposit && ctxMatches && monthEntries.length > 0 && (
              <div style={{ marginTop: 12, border: '1px solid var(--border2)', borderRadius: 11, overflow: 'hidden' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted3)', padding: '8px 12px', background: 'var(--fill)' }}>Already recorded this month</div>
                {monthEntries.map((c) => (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 12px', borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--strong)', fontFamily: "'JetBrains Mono'" }}>{fmt(c.amount)}</span>
                      {c.date && <span style={{ fontSize: 11, color: 'var(--muted3)' }}>{dateLabel(c.date)}</span>}
                    </div>
                    {onRemoveContrib && (
                      <AsyncButton onClick={() => onRemoveContrib(c.id)} title="Remove this entry" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div style={{ height: 16 }} />

            {kind === 'expense' && (
              <>
                <label style={lbl}>Category</label>
                <Pills options={CATS.map((c) => ({ value: c.id, name: c.name }))} value={f.category} onPick={(v) => set('category', v)} />
              </>
            )}

            {kind === 'saving' && (
              <>
                <label style={lbl}>Type</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  <button onClick={() => set('kind', 'deposit')} style={dirStyle((f.kind || 'deposit') === 'deposit', 'green')}>↑ Deposit</button>
                  <button onClick={() => set('kind', 'withdrawal')} style={dirStyle(f.kind === 'withdrawal', 'red')}>↓ Withdraw</button>
                </div>
                <label style={lbl}>Savings goal</label>
                <Pills options={goalOpts.map((o) => ({ value: o.value, name: o.name }))} value={f.bucket} onPick={(v) => { const bk = goalOpts.find((o) => o.value === v); set('bucket', v); if (bk && bk.account) set('account', bk.account) }} />
                <label style={lbl}>For month</label>
                <div style={{ maxHeight: 150, overflowY: 'auto', marginBottom: 16, paddingRight: 2 }}>
                  <Pills options={goalMonthOpts.map((m) => ({ value: m, name: monthFull(m) }))} value={f.month} onPick={(v) => set('month', v)} />
                </div>
                <label style={lbl}>Account / where it's held</label>
                <input type="text" value={f.account || ''} onChange={onInput('account')} placeholder="e.g. Ejo Heza, BK" style={{ ...inp(), marginBottom: 16 }} />
              </>
            )}

            {(kind === 'income' || kind === 'expense') && (
              <>
                <label style={lbl}>Description {isOther ? '(required)' : '(optional)'}</label>
                <input type="text" value={f.desc || ''} onChange={onInput('desc')} placeholder={kind === 'income' ? 'e.g. Freelance project' : 'What was it for?'} style={inp(err.desc && 'rgba(251,113,133,0.6)')} />
                {err.desc && <div style={errStyle}>{err.desc}</div>}
                <div style={{ height: 16 }} />
              </>
            )}

            <label style={lbl}>Date</label>
            <input type="date" value={f.date || today()} onChange={onInput('date')} style={{ ...inp(), marginBottom: 24 }} />
          </>
        )}

        {kind === 'post' && (
          <>
            <label style={lbl}>Title</label>
            <input type="text" value={f.title || ''} onChange={onInput('title')} placeholder="Article title" style={{ ...inp(err.title && 'rgba(251,113,133,0.6)'), fontSize: 15, fontWeight: 600 }} />
            {err.title && <div style={errStyle}>{err.title}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Excerpt</label>
            <textarea value={f.excerpt || ''} onChange={onInput('excerpt')} placeholder="A short summary of the article…" style={{ ...inp(err.excerpt && 'rgba(251,113,133,0.6)'), minHeight: 96, resize: 'vertical', fontSize: 14, lineHeight: 1.55 }} />
            {err.excerpt && <div style={errStyle}>{err.excerpt}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Topic</label>
            <Pills options={TAGS.map((t) => ({ value: t.id, name: t.id }))} value={f.tag} onPick={(v) => set('tag', v)} />
            {f.tag === 'Other' && (
              <>
                <input type="text" value={f.customTopic || ''} onChange={onInput('customTopic')} placeholder="Specify the topic" style={{ ...inp(err.customTopic && 'rgba(251,113,133,0.6)'), fontSize: 14, marginBottom: 6 }} />
                {err.customTopic && <div style={{ ...errStyle, marginBottom: 6 }}>{err.customTopic}</div>}
              </>
            )}
            <div style={{ height: 16 }} />
            <label style={lbl}>Cover image (optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {f.image && <div style={{ width: 72, height: 48, borderRadius: 10, overflow: 'hidden', background: 'var(--fill)', border: '1px solid var(--border)', flexShrink: 0 }}><img src={f.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 15px', borderRadius: 10, border: '1px dashed var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <UploadIcon /> Upload image
                <input type="file" accept="image/*" onChange={(e) => readImage('image', e)} style={{ display: 'none' }} />
              </label>
            </div>
          </>
        )}

        {kind === 'skill' && (
          <>
            <label style={lbl}>Skill name</label>
            <input type="text" value={f.name || ''} onChange={onInput('name')} placeholder="e.g. TypeScript" style={{ ...inp(err.name && 'rgba(251,113,133,0.6)'), fontSize: 15, fontWeight: 600 }} />
            {err.name && <div style={errStyle}>{err.name}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Proficiency · {(f.level == null ? 75 : f.level) | 0}%</label>
            <input type="range" min="0" max="100" step="1" value={f.level == null ? 75 : f.level} onChange={onInput('level')} style={{ width: '100%', accentColor: '#34D399', marginBottom: 16 }} />
            <label style={lbl}>Description</label>
            <input type="text" value={f.desc || ''} onChange={onInput('desc')} placeholder="One line about this skill" style={{ ...inp(), marginBottom: 16 }} />
            <label style={lbl}>Icon</label>
            <Pills options={ICON_OPTS.map(([n, v]) => ({ value: v, name: n }))} value={f.icon || ''} onPick={(v) => set('icon', v)} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {f.icon && <div style={{ width: 44, height: 44, borderRadius: 11, background: 'var(--fill)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><img src={f.icon} alt="icon" style={{ width: 28, height: 28, objectFit: 'contain' }} /></div>}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 15px', borderRadius: 10, border: '1px dashed var(--border2)', background: 'var(--fill)', color: 'var(--text)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                <UploadIcon /> Upload custom icon
                <input type="file" accept="image/*" onChange={(e) => readImage('icon', e)} style={{ display: 'none' }} />
              </label>
            </div>
          </>
        )}

        {kind === 'work' && (
          <>
            <label style={lbl}>Title</label>
            <input type="text" value={f.title || ''} onChange={onInput('title')} placeholder="e.g. Senior Developer at …" style={{ ...inp(err.title && 'rgba(251,113,133,0.6)'), fontSize: 15, fontWeight: 600 }} />
            {err.title && <div style={errStyle}>{err.title}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Link (optional)</label>
            <input type="url" value={f.link || ''} onChange={onInput('link')} placeholder="https://… project or company" style={{ ...inp(), marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Start</label>
                <input type="month" value={f.start || ''} onChange={onInput('start')} style={inp()} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={lbl}>End</label>
                <input type="month" value={f.end || ''} onChange={onInput('end')} style={inp()} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted3)', marginBottom: 16 }}>Leave “End” empty if this is ongoing.</div>
            <label style={lbl}>Description</label>
            <textarea value={f.desc || ''} onChange={onInput('desc')} placeholder="What did you do?" style={{ ...inp(), minHeight: 96, resize: 'vertical', fontSize: 14, lineHeight: 1.55, marginBottom: 24 }} />
          </>
        )}

        {kind === 'budgetItem' && (
          <>
            <label style={lbl}>Item name</label>
            <input type="text" value={f.name || ''} onChange={onInput('name')} placeholder="e.g. Rent, Internet, School trip" style={{ ...inp(err.name && 'rgba(251,113,133,0.6)'), fontSize: 15, fontWeight: 600 }} />
            {err.name && <div style={errStyle}>{err.name}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Predicted cost (FRw)</label>
            <input type="number" value={f.amount == null ? '' : f.amount} onChange={onInput('amount')} placeholder="0" style={{ ...inp(err.amount && 'rgba(251,113,133,0.6)'), fontSize: 17, fontWeight: 700, fontFamily: "'JetBrains Mono'", marginBottom: 6 }} />
            {err.amount && <div style={{ ...errStyle, marginBottom: 6 }}>{err.amount}</div>}
            <div style={{ height: 18 }} />
            <label style={lbl}>Priority</label>
            <Pills options={PRIORITIES.map((p) => ({ value: p.id, name: p.label }))} value={f.priority || 'low'} onPick={(v) => set('priority', v)} />
          </>
        )}

        {kind === 'goal' && (
          <>
            <label style={lbl}>Goal name</label>
            <input type="text" value={f.name || ''} onChange={onInput('name')} placeholder="e.g. New car, House deposit" style={{ ...inp(err.name && 'rgba(251,113,133,0.6)'), fontSize: 15, fontWeight: 600 }} />
            {err.name && <div style={errStyle}>{err.name}</div>}
            <div style={{ height: 16 }} />
            {!edit ? (
              <>
                <label style={lbl}>Monthly target (FRw)</label>
                <input type="number" value={f.target == null ? '' : f.target} onChange={onInput('target')} placeholder="0" style={{ ...inp(err.amount && 'rgba(251,113,133,0.6)'), fontSize: 17, fontWeight: 700, fontFamily: "'JetBrains Mono'" }} />
                {err.amount && <div style={errStyle}>{err.amount}</div>}
              </>
            ) : (
              <div style={{ padding: '12px 14px', borderRadius: 11, background: 'var(--fill)', border: '1px solid var(--border)', fontSize: 12.5, color: 'var(--muted2)' }}>
                Current target: <b style={{ color: 'var(--strong)' }}>{fmt(Number(f.target) || 0)}/mo</b>. To change it, use <b>Adjust target</b> on the goal card — that keeps past months on their old target and applies the new one going forward.
              </div>
            )}
            <div style={{ height: 16 }} />
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Starts counting from</label>
                <input type="month" value={f.startMonth || ''} onChange={onInput('startMonth')} style={inp(err.startMonth && 'rgba(251,113,133,0.6)')} />
                {err.startMonth && <div style={errStyle}>{err.startMonth}</div>}
              </div>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Account (optional)</label>
                <input type="text" value={f.account || ''} onChange={onInput('account')} placeholder="e.g. BK, Ejo Heza" style={inp()} />
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted3)', marginBottom: 16 }}>Debt starts accruing from the start month — earlier months aren't counted.</div>
            <label style={lbl}>Colour</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {GOAL_COLORS.map((c) => (
                <button key={c} onClick={() => set('color', c)} title={c} style={{ width: 30, height: 30, borderRadius: 8, cursor: 'pointer', background: c, border: (f.color || GOAL_COLORS[0]) === c ? '3px solid var(--strong)' : '1px solid var(--border2)' }} />
              ))}
            </div>
          </>
        )}

        {kind === 'goalTarget' && (
          <>
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--fill)', border: '1px solid var(--border)', marginBottom: 18 }}>
              <div style={{ fontSize: 13, color: 'var(--muted2)' }}>Changing the monthly target for</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--strong)', marginTop: 2 }}>{f._goalName || 'Goal'}</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 4 }}>Currently {fmt(Number(f._curTarget) || 0)}/mo</div>
            </div>
            <label style={lbl}>New monthly target (FRw)</label>
            <input type="number" value={f.target == null ? '' : f.target} onChange={onInput('target')} placeholder="0" style={{ ...inp(err.target && 'rgba(251,113,133,0.6)'), fontSize: 17, fontWeight: 700, fontFamily: "'JetBrains Mono'" }} />
            {err.target && <div style={errStyle}>{err.target}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Effective from</label>
            <input type="month" value={f.month || ''} min={f._startMonth || undefined} onChange={onInput('month')} style={inp(err.month && 'rgba(251,113,133,0.6)')} />
            {err.month && <div style={errStyle}>{err.month}</div>}
            <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 10, marginBottom: 24 }}>
              {f.month ? <>Months before <b>{monthFull(f.month)}</b> keep their current target. The new target applies from <b>{monthFull(f.month)}</b> onward.</> : 'Earlier months keep their current target.'}
            </div>
          </>
        )}

        {kind === 'debt' && (
          <>
            <label style={lbl}>Type</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <button onClick={() => set('direction', 'borrowed')} style={dirStyle(debtDir === 'borrowed', 'red')}>↓ I borrowed</button>
              <button onClick={() => set('direction', 'lent')} style={dirStyle(debtDir === 'lent', 'green')}>↑ I lent</button>
            </div>
            <label style={lbl}>{debtDir === 'lent' ? 'Borrower name' : 'Lender name'}</label>
            <input type="text" value={f.name || ''} onChange={onInput('name')} placeholder={debtDir === 'lent' ? 'Who owes you?' : 'Who did you borrow from?'} style={{ ...inp(err.name && 'rgba(251,113,133,0.6)'), fontSize: 15, fontWeight: 600 }} />
            {err.name && <div style={errStyle}>{err.name}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Amount (FRw)</label>
            <input type="number" value={f.amount == null ? '' : f.amount} onChange={onInput('amount')} placeholder="0" style={{ ...inp(err.amount && 'rgba(251,113,133,0.6)'), fontSize: 17, fontWeight: 700, fontFamily: "'JetBrains Mono'" }} />
            {err.amount && <div style={errStyle}>{err.amount}</div>}
            <div style={{ height: 16 }} />
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Date taken</label>
                <input type="date" value={f.date || today()} onChange={onInput('date')} style={inp()} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Due date (optional)</label>
                <input type="date" value={f.due || ''} onChange={onInput('due')} style={inp()} />
              </div>
            </div>
            <label style={lbl}>Note (optional)</label>
            <input type="text" value={f.desc || ''} onChange={onInput('desc')} placeholder="What was it for?" style={{ ...inp(), marginBottom: 24 }} />
          </>
        )}

        {kind === 'debtPayment' && (
          <>
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'var(--fill)', border: '1px solid var(--border)', marginBottom: 18 }}>
              <div style={{ fontSize: 13, color: 'var(--muted2)' }}>Recording a payment for</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--strong)', marginTop: 2 }}>{f._party || ''}</div>
              {f._remainingStr && <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 4 }}>{f._remainingStr} remaining</div>}
            </div>
            <label style={lbl}>Payment amount (FRw)</label>
            <input type="number" value={f.amount == null ? '' : f.amount} onChange={onInput('amount')} placeholder="0" style={{ ...inp(err.amount && 'rgba(251,113,133,0.6)'), fontSize: 17, fontWeight: 700, fontFamily: "'JetBrains Mono'" }} />
            {err.amount && <div style={errStyle}>{err.amount}</div>}
            <div style={{ height: 16 }} />
            <label style={lbl}>Date paid</label>
            <input type="date" value={f.date || today()} onChange={onInput('date')} style={{ ...inp(), marginBottom: 24 }} />
          </>
        )}

        </div>
        <div style={{ display: 'flex', gap: 12, padding: '16px 28px 24px', flexShrink: 0, borderTop: '1px solid var(--border)' }}>
          {kind === 'saving' && edit && onRemove && (
            <button onClick={onRemove} disabled={saving} title="Clear this month" style={{ padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(251,113,133,0.35)', background: 'rgba(251,113,133,0.10)', color: '#E5577A', fontSize: 14.5, fontWeight: 700, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>Remove</button>
          )}
          <button onClick={onClose} disabled={saving} style={{ flex: 1, padding: 13, borderRadius: 12, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--text2)', fontSize: 14.5, fontWeight: 700, cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.6 : 1 }}>Cancel</button>
          <button onClick={submit} disabled={saving} style={{ flex: 1.4, padding: 13, borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#34D399,#10B981)', color: '#04110B', fontSize: 14.5, fontWeight: 700, cursor: saving ? 'default' : 'pointer', boxShadow: '0 8px 20px rgba(16,185,129,0.3)', opacity: saving ? 0.75 : 1 }}>{saving ? 'Saving…' : saveLabel}</button>
        </div>
      </div>
    </div>
  )
}

function UploadIcon() {
  return <svg width="15" height="15" viewBox="0 0 18 18"><path d="M9 12V3M5.5 6.5L9 3l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13.5h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
}
