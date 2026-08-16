import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import { fmt, monthLabel } from '../../lib/format'
import { CURRENT } from '../../lib/constants'

const card = { padding: '20px 22px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }

// group monthly-record cells into [year, months[]] sections, ascending by year
function groupByYear(cells) {
  const map = new Map()
  cells.forEach((m) => {
    const y = String(m.month).slice(0, 4)
    if (!map.has(y)) map.set(y, [])
    map.get(y).push(m)
  })
  return Array.from(map.entries()).sort((a, b) => Number(a[0]) - Number(b[0]))
}

export default function SavingsTab({ d, recordMonth, onSavingCell, onWithdraw, onAddGoal, onEditGoal, onDeleteGoal, onAdjustTarget }) {
  const savedRealMonthPct = Math.round((d.savedRealMonth / d.targetTotal) * 100) + '%'
  return (
    <div>
      <div className="noprint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13.5, color: 'var(--muted2)' }}>{d.buckets.length} goals · {fmt(d.targetTotal)}/mo target</div>
        <button onClick={onAddGoal} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 8px 20px rgba(16,185,129,0.26)' }}><span style={{ fontSize: 17, lineHeight: 1 }}>+</span> New goal</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18, marginBottom: 22 }}>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>Monthly target</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.targetTotal)}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 6 }}>across all goals, every month</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>Saved in {monthLabel(CURRENT)}</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: '#1FA779', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.savedRealMonth)}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 6 }}>{savedRealMonthPct} of this month's target</div>
        </div>
        <div style={{ padding: '20px 22px', borderRadius: 16, background: 'linear-gradient(160deg,rgba(251,113,133,0.12),rgba(251,113,133,0.02))', border: '1px solid rgba(251,113,133,0.25)' }}>
          <div style={{ fontSize: 13, color: '#E5577A', fontWeight: 700, marginBottom: 8 }}>Outstanding debt</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: '#E5577A', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.totalDebt)}</div>
          <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 6 }}>missed months · tap a red month to clear</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(355px,1fr))', gap: 18 }}>
        {d.buckets.map((b) => (
          <div key={b.id} style={{ padding: 24, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: b.softBg }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: b.color }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 16, color: 'var(--strong)' }}>{b.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted3)' }}>{b.sub} · {b.targetStr}/mo</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {b.account && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', background: 'var(--fill)', border: '1px solid var(--border2)', padding: '4px 9px', borderRadius: 8 }}>{b.account}</span>}
                {b.hasDebt && <span style={{ fontSize: 11, fontWeight: 700, color: '#E5577A', background: 'rgba(251,113,133,0.13)', border: '1px solid rgba(251,113,133,0.3)', padding: '4px 9px', borderRadius: 8 }}>Debt {b.debtStr}</span>}
                <span className="noprint" style={{ display: 'flex', gap: 6 }}>
                  {onAdjustTarget && <Hover onClick={() => onAdjustTarget(b)} title="Adjust monthly target (from a chosen month)" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'var(--hover)' }}>◎</Hover>}
                  {b.custom && (
                    <>
                      <Hover onClick={() => onEditGoal(b)} title="Edit goal" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }} hover={{ background: 'var(--hover)' }}>✎</Hover>
                      <AsyncButton onClick={() => onDeleteGoal(b.id)} title="Delete goal" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 22, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{b.balanceStr}</span>
              <span style={{ fontSize: 12.5, color: 'var(--muted3)' }}>{b.hasWithdrawn ? 'current balance' : 'saved in total'}</span>
            </div>
            {b.hasWithdrawn && (
              <div style={{ fontSize: 12, color: 'var(--muted3)', marginBottom: 6 }}>
                <span style={{ color: '#1FA779', fontWeight: 700 }}>{b.depositedStr}</span> in · <span style={{ color: '#E5577A', fontWeight: 700 }}>{b.withdrawnStr}</span> withdrawn
              </div>
            )}
            <div style={{ height: 8, borderRadius: 100, background: 'var(--fill)', overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ height: '100%', borderRadius: 100, background: b.color, width: b.pctStr }} />
            </div>

            <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--muted3)', fontWeight: 700, marginBottom: 9 }}>Monthly record · tap to update</div>
            <div style={{ marginBottom: 18 }}>
              {groupByYear(b.byMonth).map(([year, months]) => (
                <div key={year} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', color: 'var(--muted4)', marginBottom: 5 }}>{year}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 7 }}>
                    {months.map((m) => (
                      <button key={m.month} onClick={() => onSavingCell(b.id, m.month)} title={`${m.label} ${year} · ${m.amountStr}`} className="noprint" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '9px 2px', borderRadius: 9, cursor: 'pointer', background: m.bg, border: `1px solid ${m.bd}` }}>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: m.fg }}>{m.label}</span>
                        <span style={{ fontSize: 11, color: m.fg }}>{m.mark}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="noprint" style={{ display: 'flex', gap: 8 }}>
              <Hover onClick={() => onSavingCell(b.id, recordMonth)} style={{ flex: 1, padding: 11, borderRadius: 11, border: '1px solid rgba(52,211,153,0.3)', background: 'rgba(52,211,153,0.10)', color: '#1FA779', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'rgba(52,211,153,0.18)' }}>Record {monthLabel(recordMonth)} contribution</Hover>
              <Hover onClick={() => onWithdraw(b)} title="Record a withdrawal" style={{ padding: '11px 16px', borderRadius: 11, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', fontSize: 13.5, fontWeight: 700, cursor: 'pointer' }} hover={{ background: 'rgba(251,113,133,0.18)' }}>Withdraw</Hover>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
