import { useMemo, useState } from 'react'
import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import Pager from '../../components/Pager'
import { fmt } from '../../lib/format'
import { makePager, pageSlice } from '../../lib/pager'

const COLS = '46px 1.7fr 1fr 1.1fr 130px 86px'
const filterBtn = (active) => ({ padding: '9px 16px', borderRadius: 10, border: '1px solid var(--border2)', cursor: 'pointer', fontSize: 13.5, fontWeight: 600, background: active ? 'rgba(52,211,153,0.14)' : 'transparent', color: active ? '#1FA779' : 'var(--muted)' })

export default function TransactionsTab({ d, txFilter, setTxFilter, onEdit, onDelete }) {
  const [txCat, setTxCat] = useState('all')
  const [page, setPage] = useState(1)

  // d.filtered already reflects the All/Income/Expense filter; layer the category filter on top.
  const full = useMemo(
    () => d.filtered.filter((t) => (txCat === 'all' ? true : t.kind === 'expense' && t.raw.category === txCat)),
    [d.filtered, txCat]
  )
  const pager = makePager(full.length, 8, page, setPage)
  const rows = pageSlice(full, pager)

  const reset = (fn) => (v) => { fn(v); setPage(1) }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => reset(setTxFilter)('all')} style={filterBtn(txFilter === 'all')}>All</button>
          <button onClick={() => reset(setTxFilter)('income')} style={filterBtn(txFilter === 'income')}>Income</button>
          <button onClick={() => reset(setTxFilter)('expense')} style={filterBtn(txFilter === 'expense')}>Expenses</button>
          <button onClick={() => reset(setTxFilter)('saving')} style={filterBtn(txFilter === 'saving')}>Saved</button>
          <button onClick={() => reset(setTxFilter)('debt')} style={filterBtn(txFilter === 'debt')}>Debt</button>
          <select value={txCat} onChange={(e) => reset(setTxCat)(e.target.value)} style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
            <option value="all">All categories</option>
            <option value="rent">Rent</option>
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="school">School fees</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--muted2)' }}>{full.length} in {d.periodLabel} · net {(d.net >= 0 ? '+ ' : '− ') + fmt(Math.abs(d.net))}</div>
      </div>

      <div style={{ borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 14, padding: '14px 22px', borderBottom: '1px solid var(--border)', fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted3)', fontWeight: 700 }}>
          <div /><div>Description</div><div>Category</div><div>Date</div><div style={{ textAlign: 'right' }}>Amount</div><div />
        </div>
        {full.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted3)', fontSize: 14 }}>No transactions in {d.periodLabel} — add one or widen the range.</div>
        ) : rows.map((t) => (
          <div key={t.id} style={{ display: 'grid', gridTemplateColumns: COLS, gap: 14, padding: '15px 22px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, background: t.chipBg, color: t.catColor }}>{t.initial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
              <div style={{ fontSize: 11.5, color: t.accountLabel ? 'var(--muted2)' : 'var(--muted4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontStyle: t.accountLabel ? 'normal' : 'italic' }}>{t.accountLabel || 'No account'}</div>
            </div>
            <div><span style={{ fontSize: 12.5, fontWeight: 600, padding: '4px 10px', borderRadius: 7, background: t.chipBg, color: t.catColor }}>{t.catName}</span></div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)' }}>{t.dateStr}</div>
            <div style={{ fontSize: 14.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums', textAlign: 'right', color: t.amountColor }}>{t.amountStr}</div>
            <div className="noprint" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              {t.readOnly ? (
                <span title="Managed in the Debt tab" style={{ fontSize: 11, color: 'var(--muted4)', fontWeight: 600 }}>Debt →</span>
              ) : (
                <>
                  <Hover onClick={() => onEdit(t)} title="Edit" style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'var(--hover)' }}>✎</Hover>
                  <AsyncButton onClick={() => onDelete(t)} title="Delete" style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 14 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Pager pager={pager} compact />
    </div>
  )
}
