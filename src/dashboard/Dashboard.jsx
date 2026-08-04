import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useFinance } from './useFinance'
import { useDebts } from './useDebts'
import { deriveFinance } from './derive'
import { deriveDebts } from './deriveDebts'
import { BUCKETS, CATS, CURRENT, MONTHS } from '../lib/constants'
import { monthLabel, today, uid } from '../lib/format'
import { Posts, Skills, Work, Messages } from '../api/resources'
import { api } from '../api/client'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import Modal from './Modal'
import OverviewTab from './tabs/OverviewTab'
import TransactionsTab from './tabs/TransactionsTab'
import SavingsTab from './tabs/SavingsTab'
import BudgetTab from './tabs/BudgetTab'
import BlogTab from './tabs/BlogTab'
import MessagesTab from './tabs/MessagesTab'
import SkillsTab from './tabs/SkillsTab'
import WorkTab from './tabs/WorkTab'
import DebtTab from './tabs/DebtTab'

export default function Dashboard() {
  const { theme } = useTheme()
  const fin = useFinance()
  const debtStore = useDebts()

  const [tab, setTab] = useState('overview')
  const [range, setRange] = useState('all')
  const [selMonth, setSelMonth] = useState(CURRENT)
  const [txFilter, setTxFilter] = useState('all')
  const [debtFilter, setDebtFilter] = useState('all')
  const [bellOpen, setBellOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modal, setModal] = useState(null) // { kind, edit, initial }

  // content (portfolio + blog + messages) — backend is the source of truth
  const [posts, setPosts] = useState([])
  const [skills, setSkills] = useState([])
  const [work, setWork] = useState([])
  const [messages, setMessages] = useState([])

  useEffect(() => {
    Posts.list().then((p) => setPosts(p || [])).catch(() => {})
    Skills.list().then((s) => setSkills(s || [])).catch(() => {})
    Work.list().then((w) => setWork(w || [])).catch(() => {})
    Messages.list().then((m) => setMessages(m || [])).catch(() => {})
  }, [])

  const derived = useMemo(
    () => deriveFinance({ tx: fin.tx, contribs: fin.contribs, budgetItems: fin.budgetItems }, { range, selMonth, txFilter }),
    [fin.tx, fin.contribs, fin.budgetItems, range, selMonth, txFilter]
  )

  const debtD = useMemo(() => deriveDebts(debtStore.debts, debtFilter), [debtStore.debts, debtFilter])

  const counts = {
    posts: posts.length,
    skills: skills.length,
    work: work.length,
    messages: messages.length,
    unread: messages.filter((m) => !m.read).length,
  }

  const recordMonth = range === 'month' ? selMonth : CURRENT

  /* ----------------------------------------------------------- modal open */
  const openModal = (kind, item, preset) => {
    let initial
    if (item) initial = { ...item, _id: item.id }
    else if (kind === 'income') initial = { amount: '', desc: '', date: today() }
    else if (kind === 'expense') initial = { amount: '', category: 'rent', desc: '', date: today() }
    else if (kind === 'saving') {
      const pre = preset || {}
      const bucketId = pre.bucket || 'ejoheza'
      const bk = BUCKETS.find((b) => b.id === bucketId)
      initial = { amount: '', bucket: bucketId, month: recordMonth, date: today(), kind: 'deposit', account: (bk && bk.account) || '', ...pre }
    }
    else if (kind === 'post') initial = { title: '', excerpt: '', tag: 'Frontend', customTopic: '', image: '' }
    else if (kind === 'skill') initial = { name: '', desc: '', level: 75, icon: '' }
    else if (kind === 'budgetItem') initial = { name: '', amount: '' }
    else if (kind === 'debt') initial = { direction: 'borrowed', name: '', amount: '', date: today(), due: '', desc: '' }
    else if (kind === 'debtPayment') initial = { amount: '', date: today(), ...(preset || {}) }
    else initial = { title: '', desc: '', start: '', end: '', link: '' }

    if (kind === 'post' && item) {
      const pre = ['Career', 'Backend', 'Frontend', 'Journey']
      if (item.tag && pre.indexOf(item.tag) < 0) { initial.customTopic = item.tag; initial.tag = 'Other' }
      else initial.customTopic = ''
    }
    setModal({ kind, edit: !!item, initial })
    setBellOpen(false); setExportOpen(false)
  }

  const openSavingCell = (bucketId, monthKey) => {
    const ex = fin.contribs.find((c) => c.bucket === bucketId && c.month === monthKey)
    if (ex) openModal('saving', ex)
    else { const b = BUCKETS.find((x) => x.id === bucketId); openModal('saving', null, { bucket: bucketId, month: monthKey, amount: String(b ? b.target : '') }) }
  }

  const openDebtPayment = (row) => openModal('debtPayment', null, { debtId: row.id, _party: row.party, _remainingStr: row.remainingStr })

  /* ---------------------------------------------------------- modal save */
  const onSave = async (f) => {
    const k = modal.kind
    const id = f._id
    if (k === 'income' || k === 'expense') {
      fin.saveTx({ id, kind: k, amount: f.amount, category: k === 'expense' ? f.category : null, desc: f.desc || '', date: f.date })
    } else if (k === 'saving') {
      fin.saveContrib({ id, bucket: f.bucket, amount: f.amount, month: f.month, date: f.date, account: f.account || '', kind: f.kind || 'deposit' })
    } else if (k === 'budgetItem') {
      fin.saveBudgetItem({ id, name: f.name, amount: f.amount, spent: f.spent != null ? f.spent : 0 })
    } else if (k === 'post') {
      const rec = { id: id || uid(), title: f.title.trim(), excerpt: f.excerpt.trim(), tag: f.tag || 'Other', image: f.image || '', date: f.date || today(), body: f.body || [], likeCount: f.likeCount || 0, comments: f.comments || [] }
      setPosts((cur) => (id ? cur.map((p) => (p.id === id ? rec : p)) : [rec, ...cur]))
      const reconcile = (doc) => {
        const blog = (doc && (doc.post || doc.blog)) || doc
        const sid = blog && (blog._id || blog.id)
        const url = blog && blog.file && blog.file.url
        if (sid || url) setPosts((cur) => cur.map((p) => (p.id === rec.id ? { ...p, id: sid || p.id, image: url || p.image } : p)))
      }
      try {
        if (f.imageFile instanceof File) {
          // upload the real file (multipart → Cloudinary); avoids huge base64 payloads
          const fd = new FormData()
          fd.append('title', rec.title); fd.append('excerpt', rec.excerpt); fd.append('tag', rec.tag)
          fd.append('date', rec.date); fd.append('body', JSON.stringify(rec.body))
          fd.append('description', rec.body.join('\n\n') || rec.excerpt)
          fd.append('file', f.imageFile)
          reconcile(id ? await api.patchForm(`/blogs/${id}`, fd) : await api.postForm('/blogs', fd))
        } else {
          const payload = { title: rec.title, excerpt: rec.excerpt, tag: rec.tag, body: rec.body, description: rec.body.join('\n\n') || rec.excerpt }
          if (rec.image && !rec.image.startsWith('data:')) payload.file = rec.image // only real URLs, never base64
          reconcile(id ? await api.patch(`/blogs/${id}`, payload, true) : await api.post('/blogs', payload, true))
        }
      } catch {}
    } else if (k === 'skill') {
      const rec = { id: id || uid(), name: f.name.trim(), desc: f.desc || '', level: f.level, icon: f.icon || '' }
      setSkills((cur) => (id ? cur.map((s) => (s.id === id ? rec : s)) : [...cur, rec]))
      const reconcile = (doc) => {
        const sk = (doc && (doc.newSkill || doc.updatedSkill)) || doc
        const sid = sk && (sk._id || sk.id)
        const url = sk && sk.icon
        if (sid || url) setSkills((cur) => cur.map((s) => (s.id === rec.id ? { ...s, id: sid || s.id, icon: url || s.icon } : s)))
      }
      try {
        if (f.iconFile instanceof File) {
          const fd = new FormData()
          fd.append('name', rec.name); fd.append('desc', rec.desc); fd.append('summary', rec.desc); fd.append('level', String(rec.level))
          fd.append('icon', f.iconFile)
          reconcile(id ? await api.patchForm(`/skills/${id}`, fd) : await api.postForm('/skills', fd))
        } else {
          const payload = { name: rec.name, desc: rec.desc, summary: rec.desc, level: rec.level }
          if (rec.icon && !rec.icon.startsWith('data:')) payload.icon = rec.icon
          reconcile(id ? await api.patch(`/skills/${id}`, payload, true) : await api.post('/skills', payload, true))
        }
      } catch {}
    } else if (k === 'work') {
      const rec = { id: id || uid(), title: f.title.trim(), desc: f.desc || '', start: f.start || '', end: f.end || '', link: (f.link || '').trim() }
      setWork((cur) => (id ? cur.map((w) => (w.id === id ? rec : w)) : [...cur, rec]))
      try {
        const payload = { title: rec.title, desc: rec.desc, body: rec.desc, start: rec.start, end: rec.end, link: rec.link }
        if (id) await api.patch(`/works/${id}`, payload, true)
        else { const saved = await api.post('/works', payload, true); const sid = saved && saved.newWork && saved.newWork._id; if (sid) setWork((cur) => cur.map((w) => (w.id === rec.id ? { ...w, id: sid } : w))) }
      } catch {}
    } else if (k === 'debt') {
      debtStore.saveDebt({ id, direction: f.direction || 'borrowed', name: f.name, amount: f.amount, date: f.date, due: f.due || '', desc: f.desc || '' })
    } else if (k === 'debtPayment') {
      debtStore.addPayment(f.debtId, { amount: f.amount, date: f.date })
    }
    setModal(null)
  }

  /* ----------------------------------------------------------- deletions */
  const deletePost = (pid) => { setPosts((c) => c.filter((p) => p.id !== pid)); Posts.remove(pid).catch(() => {}) }
  const deleteSkill = (sid) => { setSkills((c) => c.filter((s) => s.id !== sid)); Skills.remove(sid).catch(() => {}) }
  const deleteWork = (wid) => { setWork((c) => c.filter((w) => w.id !== wid)); Work.remove(wid).catch(() => {}) }
  const deleteMessage = (mid) => { setMessages((c) => c.filter((m) => m.id !== mid)); Messages.remove(mid).catch(() => {}) }
  const toggleRead = (m) => { setMessages((c) => c.map((x) => (x.id === m.id ? { ...x, read: !x.read } : x))); Messages.toggleRead(m.id).catch(() => {}) }

  /* --------------------------------------------------------------- export */
  const download = (name, text) => {
    try {
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = name
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {}
  }
  const csv = (rows) => rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(',')).join('\r\n')
  const exportTx = () => {
    const rows = [['Date', 'Type', 'Category', 'Description', 'Amount (FRw)']]
    derived.scopeTx.slice().sort((a, b) => (a.date < b.date ? -1 : 1)).forEach((t) => {
      const cat = CATS.find((c) => c.id === t.category)
      rows.push([t.date, t.kind, t.kind === 'income' ? 'Income' : cat ? cat.name : '', t.desc || '', Math.round(t.amount)])
    })
    download('transactions-' + derived.periodLabel.replace(/\s+/g, '-').toLowerCase() + '.csv', csv(rows))
    setExportOpen(false)
  }
  const exportSavings = () => {
    const rows = [['Goal', 'Monthly target', 'Total saved', 'Outstanding debt'].concat(MONTHS.map((m) => monthLabel(m)))]
    derived.buckets.forEach((b) => rows.push([b.name, b.target, b.saved, b.debt].concat(b.byMonth.map((m) => m.amount))))
    download('savings-summary.csv', csv(rows))
    setExportOpen(false)
  }
  const printPage = () => { setExportOpen(false); setTimeout(() => { try { window.print() } catch {} }, 60) }

  const onReminderClick = (r) => {
    setBellOpen(false)
    if (r.budget) setTab('budget')
    else openSavingCell(r.bucketId, CURRENT)
  }

  return (
    <div className="scope-dash" data-theme={theme} style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Manrope', sans-serif" }}>
      <Sidebar tab={tab} setTab={(t) => { setTab(t); setBellOpen(false); setExportOpen(false); setSidebarOpen(false); setDebtFilter('all') }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} derived={derived} counts={counts} debt={debtD} />
      <div className="dash-backdrop" data-open={sidebarOpen ? 'true' : 'false'} onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 85, background: 'rgba(0,0,0,0.45)' }} />

      <main className="dash-main" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar
          tab={tab} derived={derived} counts={counts}
          range={range} setRange={setRange} selMonth={selMonth}
          prevPeriod={() => { const i = MONTHS.indexOf(selMonth); if (i > 0) setSelMonth(MONTHS[i - 1]) }}
          nextPeriod={() => { const i = MONTHS.indexOf(selMonth); if (i < MONTHS.length - 1) setSelMonth(MONTHS[i + 1]) }}
          bellOpen={bellOpen} setBellOpen={setBellOpen} exportOpen={exportOpen} setExportOpen={setExportOpen}
          sidebarToggle={() => setSidebarOpen((o) => !o)}
          onAdd={(k) => openModal(k)} onExportTx={exportTx} onExportSavings={exportSavings} onPrint={printPage}
          onReminderClick={onReminderClick} debt={debtD}
        />

        <div style={{ padding: '28px 32px 60px' }}>
          {tab === 'overview' && <OverviewTab d={derived} setTab={setTab} onSavingCell={openSavingCell} />}
          {tab === 'transactions' && <TransactionsTab d={derived} txFilter={txFilter} setTxFilter={setTxFilter} onEdit={(raw) => openModal(raw.kind, raw)} onDelete={fin.removeTx} />}
          {tab === 'savings' && <SavingsTab d={derived} recordMonth={recordMonth} onSavingCell={openSavingCell} onWithdraw={(b) => openModal('saving', null, { bucket: b.id, month: recordMonth, kind: 'withdrawal', amount: '', account: b.account })} />}
          {tab === 'budget' && <BudgetTab d={derived} onAddItem={() => openModal('budgetItem')} onEditItem={(it) => openModal('budgetItem', it)} onDeleteItem={fin.removeBudgetItem} onSpentChange={fin.updateItemSpent} />}
          {tab === 'blog' && <BlogTab posts={posts} onEdit={(p) => openModal('post', p)} onDelete={deletePost} />}
          {tab === 'messages' && <MessagesTab messages={messages} onToggleRead={toggleRead} onDelete={deleteMessage} />}
          {tab === 'skills' && <SkillsTab skills={skills} onEdit={(s) => openModal('skill', s)} onDelete={deleteSkill} />}
          {tab === 'work' && <WorkTab work={work} onEdit={(w) => openModal('work', w)} onDelete={deleteWork} />}
          {tab === 'debt' && <DebtTab d={debtD} filter={debtFilter} setFilter={setDebtFilter} onPay={openDebtPayment} onEdit={(raw) => openModal('debt', raw)} onDelete={debtStore.removeDebt} />}
        </div>
      </main>

      {modal && <Modal kind={modal.kind} edit={modal.edit} initial={modal.initial} onClose={() => setModal(null)} onSave={onSave} />}
    </div>
  )
}
