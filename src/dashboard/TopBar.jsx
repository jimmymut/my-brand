import Hover from '../components/Hover'
import { monthFull } from '../lib/format'
import { CURRENT } from '../lib/constants'

const PAGE = {
  overview: 'Overview', transactions: 'Transactions', savings: 'Savings & Goals', blog: 'Blog',
  messages: 'Messages', skills: 'Skills', work: 'Work & Experience', budget: 'Budget', debt: 'Debt Management',
}

const seg = { display: 'flex', gap: 3, padding: 4, borderRadius: 11, background: 'var(--fill)', border: '1px solid var(--border)' }
const segBtn = (active) => ({ padding: '8px 13px', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, background: active ? 'var(--surface)' : 'transparent', color: active ? 'var(--strong)' : 'var(--muted)' })

export default function TopBar({
  tab, derived, counts, range, setRange, selMonth, prevPeriod, nextPeriod,
  bellOpen, setBellOpen, exportOpen, setExportOpen, sidebarToggle,
  onAdd, onExportTx, onExportSavings, onPrint, onReminderClick, debt,
}) {
  const isFinance = tab === 'overview' || tab === 'transactions' || tab === 'savings'
  const sub = {
    blog: `${counts.posts} articles published`,
    messages: `${counts.unread} unread · ${counts.messages} total`,
    skills: `${counts.skills} skills shown on your site`,
    work: `${counts.work} experiences shown on your site`,
    budget: `${monthFull(CURRENT)} · monthly spending limit`,
    debt: `${(debt && debt.activeCount) || 0} active · ${(debt && debt.overdueCount) || 0} overdue`,
  }[tab] || `${derived.periodLabel} · all amounts in FRw`

  const anyMenu = bellOpen || exportOpen

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: '22px 32px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 30, flexWrap: 'wrap' }}>
      {anyMenu && <div onClick={() => { setBellOpen(false); setExportOpen(false) }} className="noprint" style={{ position: 'fixed', inset: 0, zIndex: 50 }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={sidebarToggle} className="dash-hamburger noprint" style={{ width: 40, height: 40, flexShrink: 0, alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border2)', borderRadius: 11, background: 'var(--fill)', color: 'var(--text)', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="3.5" width="14" height="1.9" rx="0.95" fill="currentColor" /><rect x="2" y="8.05" width="14" height="1.9" rx="0.95" fill="currentColor" /><rect x="2" y="12.6" width="14" height="1.9" rx="0.95" fill="currentColor" /></svg>
        </button>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--strong)' }}>{PAGE[tab]}</h1>
          <div style={{ fontSize: 13.5, color: 'var(--muted2)', marginTop: 3 }}>{sub}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {isFinance && (
          <>
            <div className="noprint" style={seg}>
              <button onClick={() => setRange('month')} style={segBtn(range === 'month')}>Month</button>
              <button onClick={() => setRange('year')} style={segBtn(range === 'year')}>Year</button>
              <button onClick={() => setRange('all')} style={segBtn(range === 'all')}>All</button>
            </div>
            {range === 'month' && (
              <div className="noprint" style={{ display: 'flex', alignItems: 'center', gap: 2, padding: 3, borderRadius: 11, background: 'var(--fill)', border: '1px solid var(--border)' }}>
                <Hover onClick={prevPeriod} style={{ width: 32, height: 32, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 700, background: 'transparent', color: 'var(--muted)' }} hover={{ background: 'var(--hover)' }}>‹</Hover>
                <span style={{ minWidth: 96, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{monthFull(selMonth)}</span>
                <Hover onClick={nextPeriod} style={{ width: 32, height: 32, border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 15, fontWeight: 700, background: 'transparent', color: 'var(--muted)' }} hover={{ background: 'var(--hover)' }}>›</Hover>
              </div>
            )}
          </>
        )}

        {/* bell */}
        <div className="noprint" style={{ position: 'relative' }}>
          <Hover onClick={() => { setBellOpen(!bellOpen); setExportOpen(false) }} style={{ position: 'relative', width: 40, height: 40, border: '1px solid var(--border2)', borderRadius: 11, cursor: 'pointer', background: 'var(--fill)', color: 'var(--text)', fontSize: 16 }} hover={{ background: 'var(--hover)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" style={{ verticalAlign: 'middle' }}><path d="M9 2a4 4 0 0 0-4 4c0 4-1.5 5-1.5 5h11S13 10 13 6a4 4 0 0 0-4-4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M7.3 14a1.8 1.8 0 0 0 3.4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            {derived.bellReminders.length > 0 && <span style={{ position: 'absolute', top: 6, right: 7, width: 8, height: 8, borderRadius: '50%', background: '#FB7185', border: '2px solid var(--bg)' }} />}
          </Hover>
          {bellOpen && (
            <div style={{ position: 'absolute', right: 0, top: 48, width: 320, background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 16, boxShadow: '0 24px 60px var(--shadow)', padding: 16, zIndex: 60 }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, marginBottom: 4, color: 'var(--strong)' }}>Savings reminders</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted2)', marginBottom: 14 }}>{derived.bellSummary}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {derived.bellReminders.length === 0 ? (
                  <div style={{ padding: 16, textAlign: 'center', fontSize: 13, color: 'var(--muted3)' }}>🎉 All caught up for this month.</div>
                ) : derived.bellReminders.map((r, i) => (
                  <Hover key={i} onClick={() => onReminderClick(r)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: 10, borderRadius: 11, border: '1px solid var(--border)', background: 'var(--fill)', cursor: 'pointer', textAlign: 'left' }} hover={{ background: 'var(--hover)' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: r.color }} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.name}</span>
                      <span style={{ display: 'block', fontSize: 11.5, color: r.tone }}>{r.note}</span>
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)' }}>Record →</span>
                  </Hover>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* export (finance only) */}
        {isFinance && (
          <div className="noprint" style={{ position: 'relative' }}>
            <Hover onClick={() => { setExportOpen(!exportOpen); setBellOpen(false) }} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 40, padding: '0 15px', border: '1px solid var(--border2)', borderRadius: 11, cursor: 'pointer', background: 'var(--fill)', color: 'var(--text)', fontSize: 13.5, fontWeight: 700 }} hover={{ background: 'var(--hover)' }}>
              <svg width="16" height="16" viewBox="0 0 18 18"><path d="M9 2v9M5.5 7.5L9 11l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /><path d="M3 13.5h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              Export
            </Hover>
            {exportOpen && (
              <div style={{ position: 'absolute', right: 0, top: 48, width: 248, background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 14, boxShadow: '0 24px 60px var(--shadow)', padding: 8, zIndex: 60 }}>
                <Hover onClick={onExportTx} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 12px', border: 'none', borderRadius: 9, background: 'transparent', color: 'var(--text)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }}>Transactions (CSV) · {derived.periodLabel}</Hover>
                <Hover onClick={onExportSavings} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 12px', border: 'none', borderRadius: 9, background: 'transparent', color: 'var(--text)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }}>Savings summary (CSV)</Hover>
                <Hover onClick={onPrint} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 12px', border: 'none', borderRadius: 9, background: 'transparent', color: 'var(--text)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }} hover={{ background: 'var(--hover)' }}>Print / Save as PDF</Hover>
              </div>
            )}
          </div>
        )}

        {/* actions */}
        {isFinance && (
          <div className="noprint" style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onAdd('income')} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 40, padding: '0 15px', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 8px 20px rgba(16,185,129,0.26)' }}><span style={{ fontSize: 17, lineHeight: 1 }}>+</span> Income</button>
            <button onClick={() => onAdd('expense')} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 40, padding: '0 15px', border: '1px solid rgba(251,113,133,0.4)', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#E5577A', background: 'rgba(251,113,133,0.12)' }}><span style={{ fontSize: 17, lineHeight: 1 }}>−</span> Expense</button>
            <button onClick={() => onAdd('saving')} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 40, padding: '0 15px', border: '1px solid var(--border2)', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: 'var(--text)', background: 'var(--fill)' }}>◎ Save</button>
          </div>
        )}
        {tab === 'budget' && <button onClick={() => onAdd('budgetItem')} className="noprint" style={addBtn}>+ Add budget item</button>}
        {tab === 'debt' && <button onClick={() => onAdd('debt')} className="noprint" style={addBtn}>+ Add a debt</button>}
        {tab === 'blog' && <button onClick={() => onAdd('post')} className="noprint" style={addBtn}>+ New post</button>}
        {tab === 'skills' && <button onClick={() => onAdd('skill')} className="noprint" style={addBtn}>+ Add skill</button>}
        {tab === 'work' && <button onClick={() => onAdd('work')} className="noprint" style={addBtn}>+ Add experience</button>}
      </div>
    </header>
  )
}

const addBtn = { display: 'flex', alignItems: 'center', gap: 7, height: 40, padding: '0 17px', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 8px 20px rgba(16,185,129,0.26)' }
