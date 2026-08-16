import { useEffect, useState } from 'react'
import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import { fmt, monthLabel, monthFull } from '../../lib/format'
import { CURRENT } from '../../lib/constants'

const card = { padding: '20px 22px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }
const ROWS = '1fr 110px 120px 110px 70px'

// "Spent" cell: type locally, save ONCE on blur/Enter — avoids a PATCH per
// keystroke (which raced and sometimes persisted a stale value).
function SpentCell({ item, onCommit }) {
  const [val, setVal] = useState(String(item.spent ?? 0))
  const [editing, setEditing] = useState(false)
  useEffect(() => { if (!editing) setVal(String(item.spent ?? 0)) }, [item.spent, editing])

  const commit = () => {
    setEditing(false)
    const next = parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0
    if (next !== (item.spent || 0)) onCommit(item.id, next)
  }
  return (
    <input
      type="number"
      value={val}
      onFocus={() => setEditing(true)}
      onChange={(e) => setVal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
      placeholder="0"
      style={{ width: '100%', textAlign: 'right', padding: '8px 10px', borderRadius: 9, background: 'var(--input)', border: '1px solid var(--border2)', color: 'var(--strong)', fontSize: 13.5, fontWeight: 700, fontFamily: "'JetBrains Mono'", outline: 'none' }}
    />
  )
}

export default function BudgetTab({ d, month = CURRENT, canPrev, canNext, onPrevMonth, onNextMonth, sourceMonths = [], onCopyFrom, onAddItem, onEditItem, onDeleteItem, onSpentChange, onReorder }) {
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const isFuture = month > CURRENT
  const isPast = month < CURRENT
  const navBtn = (enabled) => ({ width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--surface)', color: enabled ? 'var(--text)' : 'var(--muted4)', cursor: enabled ? 'pointer' : 'default', fontSize: 17, lineHeight: 1, opacity: enabled ? 1 : 0.5 })

  const drop = (targetId) => {
    if (dragId && dragId !== targetId) {
      const ids = d.items.map((i) => i.id)
      const from = ids.indexOf(dragId)
      const to = ids.indexOf(targetId)
      if (from > -1 && to > -1) {
        ids.splice(to, 0, ids.splice(from, 1)[0])
        onReorder(ids)
      }
    }
    setDragId(null); setOverId(null)
  }

  return (
    <div>
      {/* month navigator — plan any month, including future ones */}
      <div className="noprint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onPrevMonth} disabled={!canPrev} title="Previous month" style={navBtn(canPrev)}>‹</button>
          <div style={{ textAlign: 'center', minWidth: 150 }}>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 16, color: 'var(--strong)' }}>{monthFull(month)}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: isFuture ? '#38BDF8' : (isPast ? 'var(--muted3)' : '#1FA779') }}>{isFuture ? 'Planning ahead' : (isPast ? 'Past month' : 'This month')}</div>
          </div>
          <button onClick={onNextMonth} disabled={!canNext} title="Next month" style={navBtn(canNext)}>›</button>
        </div>
        {sourceMonths.length > 0 && (
          <select
            value=""
            onChange={(e) => { const m = e.target.value; if (m && onCopyFrom) onCopyFrom(m) }}
            title="Copy an existing month's plan into this month"
            style={{ padding: '9px 14px', borderRadius: 10, border: '1px solid var(--border2)', background: 'var(--surface)', color: 'var(--text)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', outline: 'none' }}
          >
            <option value="" disabled>Copy from…</option>
            {sourceMonths.map((m) => <option key={m} value={m}>{monthFull(m)}</option>)}
          </select>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 18, marginBottom: 22 }}>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>Planned total · {monthLabel(month)}</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.budget)}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 6 }}>the sum of your budget plan</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 8 }}>Spent so far</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: d.budgetColor, fontVariantNumeric: 'tabular-nums' }}>{fmt(d.budgetSpent)}</div>
          <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 6 }}>{d.budgetPctInt}% of the limit</div>
        </div>
        <div style={{ padding: '20px 22px', borderRadius: 16, background: d.budgetOver ? 'linear-gradient(160deg,rgba(251,113,133,0.12),rgba(251,113,133,0.02))' : 'linear-gradient(160deg,rgba(52,211,153,0.12),rgba(52,211,153,0.02))', border: `1px solid ${d.budgetOver ? 'rgba(251,113,133,0.25)' : 'rgba(52,211,153,0.25)'}` }}>
          <div style={{ fontSize: 13, color: d.budgetColor, fontWeight: 700, marginBottom: 8 }}>{d.budgetOver ? 'Over budget' : 'Remaining'}</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: d.budgetColor, fontVariantNumeric: 'tabular-nums' }}>{fmt(Math.abs(d.budgetRemaining))}</div>
          <div style={{ fontSize: 12, color: 'var(--muted2)', marginTop: 6 }}>{isFuture ? 'planned for ' + monthLabel(month) : (isPast ? monthLabel(month) + ' summary' : 'resets at the start of next month')}</div>
        </div>
      </div>

      {/* budget plan table */}
      <div style={{ padding: 24, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, color: 'var(--strong)' }}>Budget plan · {monthFull(month)}</h3>
            <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 3 }}>What you plan to spend &amp; set aside in {monthLabel(month)}</div>
          </div>
          <button onClick={onAddItem} className="noprint" style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)' }}><span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add item</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 560, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: ROWS, gap: 12, padding: '8px 6px 10px', fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--muted3)', fontWeight: 700 }}>
              <div>Item</div><div style={{ textAlign: 'right' }}>Planned</div><div style={{ textAlign: 'right' }}>Spent</div><div style={{ textAlign: 'right' }}>Remaining</div><div />
            </div>
            {d.items.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted3)', fontSize: 13.5 }}>No items yet — add what you plan to spend.</div>}
            {d.items.map((it) => (
              <div
                key={it.id}
                onDragOver={(e) => { e.preventDefault(); if (overId !== it.id) setOverId(it.id) }}
                onDrop={() => drop(it.id)}
                style={{ display: 'grid', gridTemplateColumns: ROWS, gap: 12, alignItems: 'center', padding: '9px 6px', borderTop: overId === it.id && dragId ? '2px solid #34D399' : '1px solid var(--border)', opacity: dragId === it.id ? 0.4 : 1, background: overId === it.id && dragId && dragId !== it.id ? 'var(--fill)' : 'transparent' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span
                    className="noprint"
                    draggable
                    onDragStart={() => setDragId(it.id)}
                    onDragEnd={() => { setDragId(null); setOverId(null) }}
                    title="Drag to reorder"
                    style={{ cursor: 'grab', color: 'var(--muted3)', fontSize: 14, lineHeight: 1, flexShrink: 0, userSelect: 'none' }}
                  >⠿</span>
                  <span title={`${it.priorityLabel} priority`} style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: it.priorityColor }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</span>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: it.priorityColor, background: 'var(--fill)', border: '1px solid var(--border2)', padding: '1px 7px', borderRadius: 6, flexShrink: 0 }}>{it.priorityLabel}</span>
                </span>
                <span style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{it.valueStr}</span>
                <SpentCell item={it} onCommit={onSpentChange} />
                <span style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: it.remainingColor }}>{it.remainingStr}</span>
                <div className="noprint" style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <Hover onClick={() => onEditItem(it)} title="Edit" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }} hover={{ background: 'var(--hover)' }}>✎</Hover>
                  <AsyncButton onClick={() => onDeleteItem(it.id)} title="Delete" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
                </div>
              </div>
            ))}
            <div style={{ display: 'grid', gridTemplateColumns: ROWS, gap: 12, alignItems: 'center', padding: '14px 6px 2px', borderTop: '2px solid var(--border2)', marginTop: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--strong)' }}>Total</span>
              <span style={{ textAlign: 'right', fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 700, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(d.plannedTotal)}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 700, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums', paddingRight: 10 }}>{fmt(d.spentTotal)}</span>
              <span style={{ textAlign: 'right', fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: d.remainingTotal < 0 ? '#E5577A' : '#1FA779' }}>{fmt(d.remainingTotal)}</span>
              <span />
            </div>
          </div>
        </div>
      </div>

      {/* recorded spending reference */}
      <div style={{ padding: 24, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <h3 style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 17, color: 'var(--strong)' }}>Recorded spending · {monthLabel(month)} · for reference</h3>
        </div>
        <div style={{ display: 'flex', height: 16, borderRadius: 100, overflow: 'hidden', background: 'var(--fill)', marginBottom: 20 }}>
          {d.budgetSegs.map((s, i) => <div key={i} title={s.name} style={{ height: '100%', width: s.widthStr, background: s.color }} />)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {d.budgetSegs.length === 0 ? (
            <div style={{ fontSize: 13.5, color: 'var(--muted3)' }}>Nothing recorded this month yet.</div>
          ) : d.budgetSegs.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, flexShrink: 0, background: s.color }} />
              <span style={{ fontSize: 13.5, color: 'var(--text2)', flex: 1 }}>{s.name}</span>
              <span style={{ fontSize: 13, color: 'var(--muted2)', fontVariantNumeric: 'tabular-nums' }}>{s.valueStr} · {s.pctStr}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
