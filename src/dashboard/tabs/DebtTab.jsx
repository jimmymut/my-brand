import { useMemo, useState } from 'react'
import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import Pager from '../../components/Pager'
import { makePager, pageSlice } from '../../lib/pager'

const filterBtn = (active) => ({ padding: '9px 16px', borderRadius: 10, border: '1px solid var(--border2)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, background: active ? 'rgba(52,211,153,0.14)' : 'transparent', color: active ? '#1FA779' : 'var(--muted)' })

export default function DebtTab({ d, filter, setFilter, onPay, onEdit, onDelete }) {
  const [page, setPage] = useState(1)
  const pager = makePager(d.filtered.length, 6, page, setPage)
  const shown = pageSlice(d.filtered, pager)
  const emptyText = useMemo(() => (
    filter === 'cleared' ? 'No cleared debts yet.' : filter === 'all' ? 'No debts recorded — add one to start tracking.' : 'Nothing here — try another filter.'
  ), [filter])

  const setF = (f) => { setFilter(f); setPage(1) }

  return (
    <div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18, marginBottom: 22 }}>
        <div style={{ padding: '20px 22px', borderRadius: 16, background: 'linear-gradient(160deg,rgba(251,113,133,0.12),rgba(251,113,133,0.02))', border: '1px solid rgba(251,113,133,0.25)' }}>
          <div style={{ fontSize: 13, color: '#E5577A', fontWeight: 700, marginBottom: 8 }}>You owe</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: '#E5577A', fontVariantNumeric: 'tabular-nums' }}>{d.totalOweStr}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 6 }}>money you borrowed, still to repay</div>
        </div>
        <div style={{ padding: '20px 22px', borderRadius: 16, background: 'linear-gradient(160deg,rgba(52,211,153,0.12),rgba(52,211,153,0.02))', border: '1px solid rgba(52,211,153,0.25)' }}>
          <div style={{ fontSize: 13, color: '#1FA779', fontWeight: 700, marginBottom: 8 }}>You're owed</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: '#1FA779', fontVariantNumeric: 'tabular-nums' }}>{d.totalOwedStr}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 6 }}>money you lent, still to be paid back</div>
        </div>
        <div style={{ padding: '20px 22px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>{d.debtNetLabel}</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: d.debtNetColor, fontVariantNumeric: 'tabular-nums' }}>{d.debtNetStr}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 6 }}>{d.activeCount} active · {d.overdueCount} overdue</div>
        </div>
      </div>

      {/* filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button onClick={() => setF('all')} style={filterBtn(filter === 'all')}>All</button>
        <button onClick={() => setF('borrowed')} style={filterBtn(filter === 'borrowed')}>Borrowed</button>
        <button onClick={() => setF('lent')} style={filterBtn(filter === 'lent')}>Lent</button>
        <button onClick={() => setF('cleared')} style={filterBtn(filter === 'cleared')}>Cleared</button>
      </div>

      {/* debt cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {d.filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted3)', fontSize: 14.5 }}>{emptyText}</div>
        ) : shown.map((it) => (
          <div key={it.id} style={{ padding: '22px 24px', borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, background: it.dirChipBg, color: it.color }}>{it.dirIcon}</div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, color: 'var(--strong)' }}>{it.party}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted3)' }}>{it.dirLabel} · {it.dateStr}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: it.statusBg, color: it.statusFg }}>{it.statusLabel}</span>
                <div className="noprint" style={{ display: 'flex', gap: 6 }}>
                  <Hover onClick={() => onEdit(it.raw)} title="Edit" style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'var(--hover)' }}>✎</Hover>
                  <AsyncButton onClick={() => onDelete(it.id)} title="Delete" style={{ width: 32, height: 32, borderRadius: 9, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 14 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 14 }}>
              <Stat label="Principal" value={it.amountStr} color="var(--strong)" />
              <Stat label="Paid back" value={it.paidStr} color="#1FA779" />
              <Stat label="Remaining" value={it.remainingStr} color={it.color} />
              <div><div style={{ fontSize: 11.5, color: 'var(--muted3)', fontWeight: 600, marginBottom: 2 }}>Due</div><div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text2)' }}>{it.dueStr}</div></div>
            </div>

            <div style={{ height: 8, borderRadius: 100, background: 'var(--fill)', overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ height: '100%', borderRadius: 100, background: it.barBg, width: it.pctStr }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12.5, color: 'var(--muted2)' }}>{it.pctStr} repaid · {it.paymentCount} payments</span>
              {it.cleared
                ? <span style={{ fontSize: 13, fontWeight: 700, color: '#1FA779' }}>✓ Fully cleared</span>
                : <Hover onClick={() => onPay(it)} className="noprint" style={{ padding: '9px 16px', borderRadius: 10, border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.10)', color: '#1FA779', fontSize: 13, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'rgba(52,211,153,0.18)' }}>＋ Record payment</Hover>}
            </div>
          </div>
        ))}
        <Pager pager={pager} />
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 11.5, color: 'var(--muted3)', fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  )
}
