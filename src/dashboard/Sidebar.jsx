import { useNavigate } from 'react-router-dom'
import Hover from '../components/Hover'
import ThemeSwitch from '../components/ThemeSwitch'
import { useAuth } from '../context/AuthContext'

const ICONS = {
  overview: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1" y="1" width="7" height="7" rx="1.5" fill="currentColor" /><rect x="10" y="1" width="7" height="7" rx="1.5" fill="currentColor" /><rect x="1" y="10" width="7" height="7" rx="1.5" fill="currentColor" /><rect x="10" y="10" width="7" height="7" rx="1.5" fill="currentColor" /></svg>,
  transactions: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1" y="3" width="16" height="2.4" rx="1.2" fill="currentColor" /><rect x="1" y="8" width="16" height="2.4" rx="1.2" fill="currentColor" /><rect x="1" y="13" width="11" height="2.4" rx="1.2" fill="currentColor" /></svg>,
  savings: <svg width="18" height="18" viewBox="0 0 18 18"><circle cx="9" cy="9" r="7.6" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="9" cy="9" r="3" fill="currentColor" /></svg>,
  budget: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="3.5" width="14" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M2 7.5h14" stroke="currentColor" strokeWidth="1.7" /><rect x="10" y="9.7" width="3.2" height="2.2" rx="1.1" fill="currentColor" /></svg>,
  debt: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 6.5C3 5 4 4 5.5 4h7C14 4 15 5 15 6.5v5c0 1.5-1 2.5-2.5 2.5h-7C4 14 3 13 3 11.5z" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="9" cy="9" r="2" fill="currentColor" /></svg>,
  blog: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="2" width="15" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><rect x="4.5" y="5.5" width="9" height="1.8" rx="0.9" fill="currentColor" /><rect x="4.5" y="9" width="9" height="1.8" rx="0.9" fill="currentColor" /></svg>,
  messages: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="1.5" y="3" width="15" height="11" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M2.5 5L9 9.5L15.5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  skills: <svg width="18" height="18" viewBox="0 0 18 18"><path d="M9 1.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L3.8 6.8l5-.7z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
  work: <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="5" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="M6.5 5V3.8A1.3 1.3 0 0 1 7.8 2.5h2.4A1.3 1.3 0 0 1 11.5 3.8V5" fill="none" stroke="currentColor" strokeWidth="1.7" /></svg>,
}

function NavItem({ id, label, active, onClick, badge }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 14.5, fontWeight: 600, textAlign: 'left', marginBottom: 3, background: active ? 'rgba(52,211,153,0.12)' : 'transparent', color: active ? '#1FA779' : 'var(--muted)' }}>
      {ICONS[id]}
      {label}
      {badge}
    </button>
  )
}

const groupLabel = { fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted4)', fontWeight: 700 }

export default function Sidebar({ tab, setTab, open, onClose, derived, counts, debt }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const reminderCount = derived.reminderCount
  const budgetAlert = derived.budgetOver || derived.budgetNear
  const debtOverdue = (debt && debt.overdueCount) || 0

  return (
    <aside className="dash-sidebar" data-open={open ? 'true' : 'false'} style={{ width: 256, flexShrink: 0, background: 'var(--sidebar)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: '22px 16px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
      <a onClick={() => navigate('/')} title="Go to website" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 8px 22px', cursor: 'pointer' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#34D399,#10B981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk'", fontWeight: 700, color: '#04110B', fontSize: 16, boxShadow: '0 6px 18px rgba(16,185,129,0.35)' }}>JM</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15, lineHeight: 1.1, color: 'var(--strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user ? user.name : 'Jimmy'}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)' }}>{user && user.isAdmin ? 'Owner · Admin' : 'Member'}</div>
        </div>
      </a>

      <div style={{ ...groupLabel, padding: '8px 10px 6px' }}>Finance</div>
      <NavItem id="overview" label="Overview" active={tab === 'overview'} onClick={() => setTab('overview')} />
      <NavItem id="transactions" label="Transactions" active={tab === 'transactions'} onClick={() => setTab('transactions')} />
      <NavItem id="savings" label="Savings & Goals" active={tab === 'savings'} onClick={() => setTab('savings')} badge={reminderCount > 0 && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#FCA5B5', background: 'rgba(251,113,133,0.16)', padding: '2px 7px', borderRadius: 7 }}>{reminderCount}</span>} />
      <NavItem id="budget" label="Budget" active={tab === 'budget'} onClick={() => setTab('budget')} badge={budgetAlert && <span style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: derived.budgetColor }} />} />
      <NavItem id="debt" label="Debt" active={tab === 'debt'} onClick={() => setTab('debt')} badge={debtOverdue > 0 && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#FCA5B5', background: 'rgba(251,113,133,0.16)', padding: '2px 7px', borderRadius: 7 }}>{debtOverdue}</span>} />

      <div style={{ ...groupLabel, padding: '18px 10px 6px' }}>Content</div>
      <NavItem id="blog" label="Blog" active={tab === 'blog'} onClick={() => setTab('blog')} badge={<span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: 'var(--muted3)' }}>{counts.posts}</span>} />
      <NavItem id="messages" label="Messages" active={tab === 'messages'} onClick={() => setTab('messages')} badge={counts.unread > 0 && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#34D399', background: 'rgba(52,211,153,0.16)', padding: '2px 7px', borderRadius: 7 }}>{counts.unread}</span>} />

      <div style={{ ...groupLabel, padding: '18px 10px 6px' }}>Portfolio</div>
      <NavItem id="skills" label="Skills" active={tab === 'skills'} onClick={() => setTab('skills')} badge={<span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: 'var(--muted3)' }}>{counts.skills}</span>} />
      <NavItem id="work" label="Work" active={tab === 'work'} onClick={() => setTab('work')} badge={<span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: 'var(--muted3)' }}>{counts.work}</span>} />

      <div style={{ flex: 1 }} />

      <div style={{ ...groupLabel, letterSpacing: '0.06em', padding: '4px 6px 8px' }}>Appearance</div>
      <div style={{ marginBottom: 14 }}><ThemeSwitch variant="text" /></div>
      <Hover style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 12px', border: '1px solid var(--border2)', borderRadius: 11, background: 'var(--fill)', color: 'var(--text)', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left' }} hover={{ background: 'rgba(251,113,133,0.12)', borderColor: 'rgba(251,113,133,0.4)', color: '#E5577A' }} onClick={() => { logout(); navigate('/') }}>
        <svg width="17" height="17" viewBox="0 0 18 18"><path d="M11 2.5H4.5A1.5 1.5 0 0 0 3 4v10a1.5 1.5 0 0 0 1.5 1.5H11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><path d="M8 9h8M13 6l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Log out
      </Hover>
    </aside>
  )
}
