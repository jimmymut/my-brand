import Hover from '../../components/Hover'
import { BarChart, Donut } from '../Charts'
import { fmt, monthFull, monthLabel } from '../../lib/format'
import { CURRENT } from '../../lib/constants'

const card = { padding: 22, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }
const panel = { padding: 24, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }

export default function OverviewTab({ d, setTab, onSavingCell }) {
  return (
    <div>
      {/* reminder banner */}
      {d.hasReminder && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 16, background: 'linear-gradient(120deg,rgba(251,113,133,0.13),rgba(251,191,36,0.07))', border: '1px solid rgba(251,113,133,0.28)', marginBottom: 22 }}>
          <div style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: 'rgba(251,113,133,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E5577A' }}>
            <svg width="20" height="20" viewBox="0 0 18 18"><path d="M9 2a4 4 0 0 0-4 4c0 4-1.5 5-1.5 5h11S13 10 13 6a4 4 0 0 0-4-4z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M7.3 14a1.8 1.8 0 0 0 3.4 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--strong)' }}>Savings reminder · {monthFull(CURRENT)}</div>
            <div style={{ fontSize: 13.5, color: 'var(--muted2)', marginTop: 2 }}>{d.reminderSummary}</div>
          </div>
          <button onClick={() => setTab('savings')} className="noprint" style={{ padding: '11px 18px', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#FBBF24,#F59E0B)' }}>Review goals →</button>
        </div>
      )}

      {/* budget summary */}
      <Hover as="div" onClick={() => setTab('budget')} style={{ marginBottom: 22, padding: '20px 22px', borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'pointer' }} hover={{ borderColor: 'rgba(52,211,153,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 16, color: 'var(--strong)' }}>{monthLabel(CURRENT)} budget</span>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 7, background: `rgba(${d.budgetColor === '#E5577A' ? '251,113,133' : d.budgetColor === '#D08700' ? '251,191,36' : '52,211,153'},0.14)`, color: d.budgetColor }}>{d.budgetOver ? 'Over budget' : d.budgetNear ? 'Almost there' : 'On track'}</span>
          </div>
          <span style={{ fontSize: 13.5, color: 'var(--muted2)', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.budgetSpent)} of {fmt(d.budget)} · {d.budgetOver ? 'over by ' + fmt(d.budgetSpent - d.budget) : fmt(Math.max(0, d.budgetRemaining)) + ' left'}</span>
        </div>
        <div style={{ height: 12, borderRadius: 100, background: 'var(--fill)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 100, background: d.budgetColor, width: `${Math.min(100, d.budgetPctInt)}%` }} />
        </div>
      </Hover>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(214px,1fr))', gap: 18, marginBottom: 22 }}>
        <div style={{ position: 'relative', overflow: 'hidden', padding: 22, borderRadius: 18, background: 'linear-gradient(160deg,rgba(52,211,153,0.16),rgba(16,185,129,0.04))', border: '1px solid rgba(52,211,153,0.22)' }}>
          <div style={{ fontSize: 13, color: '#3BA883', fontWeight: 700, marginBottom: 10 }}>Available balance</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 29, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{fmt(d.balance)}</div>
          {d.usesAccounts ? (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11.5, color: 'var(--muted2)' }}>
              <div style={{ color: 'var(--muted3)' }}>spendable across {d.accounts.length} wallet{d.accounts.length === 1 ? '' : 's'}</div>
              {d.accountsInfo.savingsTotal > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span>+ savings set aside</span><span style={{ color: '#1E9BD7', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmt(d.accountsInfo.savingsTotal)}</span></div>}
            </div>
          ) : (
            <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 3, fontSize: 11.5, color: 'var(--muted2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span>Income</span><span style={{ color: '#1FA779', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>+ {fmt(d.totalIncome)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span>Expenses</span><span style={{ color: '#E5577A', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>− {fmt(d.totalExpense)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}><span>Saved (set aside)</span><span style={{ color: '#1E9BD7', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>− {fmt(d.totalSaved)}</span></div>
            </div>
          )}
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>Income · {d.periodShort}</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 25, color: '#1FA779', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.periodIncome)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 8 }}>{d.incomeCount} entries</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>Expenses · {d.periodShort}</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 25, color: '#E5577A', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.periodExpense)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 8 }}>{d.expenseCount} entries</div>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>Saved · {d.periodShort}</div>
            {d.hasDebt && <span style={{ fontSize: 11, fontWeight: 700, color: '#E5577A', background: 'rgba(251,113,133,0.14)', border: '1px solid rgba(251,113,133,0.3)', padding: '3px 8px', borderRadius: 7 }}>Debt {fmt(d.totalDebt)}</span>}
          </div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 25, color: '#1E9BD7', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.savedInScope)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 8 }}>{fmt(d.totalSaved)} all time</div>
        </div>
      </div>

      {/* charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 18, marginBottom: 22 }}>
        <div style={panel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, color: 'var(--strong)' }}>Cash flow</h3>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--muted)' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#34D399' }} />Income</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--muted)' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: '#FB7185' }} />Expense</span>
            </div>
          </div>
          <BarChart monthData={d.monthData.slice(-6)} />
        </div>
        <div style={panel}>
          <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, marginBottom: 18, color: 'var(--strong)' }}>Spending · {d.periodShort}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <Donut catData={d.catData} total={d.periodExpense} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {d.catData.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--muted3)' }}>No spending in this period.</div>
              ) : d.catData.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, flexShrink: 0, background: c.color }} />
                  <span style={{ fontSize: 13, color: 'var(--text2)', flex: 1 }}>{c.name}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--muted2)', fontVariantNumeric: 'tabular-nums' }}>{fmt(c.value)} · {c.pctStr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* savings + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 18 }}>
        <div style={panel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, color: 'var(--strong)' }}>Savings goals · {monthLabel(CURRENT)}</h3>
            <button onClick={() => setTab('savings')} className="noprint" style={{ border: 'none', background: 'none', color: '#1FA779', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {d.buckets.map((b) => (
              <div key={b.id}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: b.color }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{b.name}</span>
                    {b.hasDebt && <span style={{ fontSize: 10.5, fontWeight: 700, color: '#E5577A', background: 'rgba(251,113,133,0.13)', padding: '2px 7px', borderRadius: 6 }}>owes {b.debtStr}</span>}
                  </div>
                  <span style={{ fontSize: 12.5, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{b.thisMonthStr} / {b.targetStr}</span>
                </div>
                <div style={{ height: 8, borderRadius: 100, background: 'var(--fill)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 100, background: b.color, width: b.pctStr }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, color: 'var(--strong)' }}>Recent activity</h3>
            <button onClick={() => setTab('transactions')} className="noprint" style={{ border: 'none', background: 'none', color: '#1FA779', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>See all →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {d.recent.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--muted3)', fontSize: 13.5 }}>No activity in this period.</div>
            ) : d.recent.map((t) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '10px 6px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: t.chipBg, color: t.catColor }}>{t.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted3)' }}>{t.catName}{t.accountLabel ? ' · ' + t.accountLabel : ''} · {t.dateStr}</div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: t.amountColor }}>{t.amountStr}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
