// Pure debt computations ported from the dashboard prototype's renderVals().
import { fmt, dateLabel, rgba, today } from '../lib/format'

export function deriveDebts(debts, filter = 'all') {
  const now = today()
  const rows = (debts || []).map((d) => {
    const paid = (d.payments || []).reduce((a, p) => a + (p.amount || 0), 0)
    const remaining = Math.max(0, (d.amount || 0) - paid)
    const cleared = remaining <= 0
    const overdue = !cleared && d.due && d.due < now
    const pct = d.amount > 0 ? Math.min(100, Math.round((paid / d.amount) * 100)) : 0
    const borrowed = d.direction === 'borrowed'
    const color = borrowed ? '#E5577A' : '#1FA779'
    return {
      id: d.id,
      direction: d.direction,
      borrowed,
      party: d.name,
      note: d.desc || '',
      amount: d.amount,
      amountStr: fmt(d.amount || 0),
      paid, paidStr: fmt(paid),
      remaining, remainingStr: fmt(remaining),
      cleared, notCleared: !cleared, overdue,
      pct, pctStr: pct + '%',
      color, barBg: cleared ? '#1FA779' : color,
      dirLabel: borrowed ? 'You borrowed' : 'You lent',
      dirIcon: borrowed ? '↓' : '↑',
      dirChipBg: rgba(color, 0.14),
      dateStr: dateLabel(d.date),
      hasDue: !!d.due,
      dueStr: d.due ? dateLabel(d.due) : 'No due date',
      statusLabel: cleared ? 'Cleared' : overdue ? 'Overdue' : 'Active',
      statusBg: cleared ? 'rgba(52,211,153,0.14)' : overdue ? 'rgba(251,113,133,0.14)' : 'var(--fill)',
      statusFg: cleared ? '#1FA779' : overdue ? '#E5577A' : 'var(--muted)',
      paymentCount: (d.payments || []).length,
      raw: d,
    }
  })
  const totalOwe = rows.filter((d) => d.borrowed && !d.cleared).reduce((a, d) => a + d.remaining, 0)
  const totalOwed = rows.filter((d) => !d.borrowed && !d.cleared).reduce((a, d) => a + d.remaining, 0)
  const debtNet = totalOwed - totalOwe
  const overdueCount = rows.filter((d) => d.overdue).length
  const activeCount = rows.filter((d) => !d.cleared).length
  const filtered = rows.filter((d) =>
    filter === 'all' ? true : filter === 'cleared' ? d.cleared : filter === 'borrowed' ? d.borrowed : !d.borrowed
  )
  return {
    rows, filtered,
    totalOwe, totalOweStr: fmt(totalOwe),
    totalOwed, totalOwedStr: fmt(totalOwed),
    debtNet,
    debtNetStr: (debtNet >= 0 ? '+ ' : '− ') + fmt(Math.abs(debtNet)),
    debtNetLabel: debtNet >= 0 ? 'Net: owed to you' : 'Net: you owe',
    debtNetColor: debtNet >= 0 ? '#1FA779' : '#E5577A',
    overdueCount, activeCount,
  }
}
