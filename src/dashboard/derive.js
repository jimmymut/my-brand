// Pure finance computations ported from the dashboard prototype's renderVals().
import { BUCKETS, CATS, CURRENT, YEAR, MONTHS } from '../lib/constants'
import { fmt, monthLabel, monthFull, dateLabel, rgba } from '../lib/format'

const STATUS = {
  met: { bg: 'rgba(52,211,153,0.16)', fg: '#1FA779', bd: 'rgba(52,211,153,0.4)', mark: '✓' },
  partial: { bg: 'rgba(251,191,36,0.16)', fg: '#C98A00', bd: 'rgba(251,191,36,0.45)', mark: '½' },
  missed: { bg: 'rgba(251,113,133,0.14)', fg: '#E5577A', bd: 'rgba(251,113,133,0.42)', mark: '✕' },
  due: { bg: 'var(--fill)', fg: 'var(--muted3)', bd: 'var(--border2)', mark: '·' },
}

export function deriveFinance({ tx, contribs, budgetItems }, { range, selMonth, txFilter }) {
  const inScope = (d) => {
    if (range === 'all') return true
    if (range === 'year') return d.slice(0, 4) === YEAR
    return d.slice(0, 7) === selMonth
  }
  const scopeTx = tx.filter((t) => inScope(t.date))
  const isWithdrawal = (c) => c.kind === 'withdrawal'
  const signed = (c) => (isWithdrawal(c) ? -c.amount : c.amount) // net effect on money set aside
  const totalIncome = tx.filter((t) => t.kind === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = tx.filter((t) => t.kind === 'expense').reduce((a, t) => a + t.amount, 0)
  const totalSaved = contribs.reduce((a, c) => a + signed(c), 0) // net (deposits − withdrawals)
  const balance = totalIncome - totalExpense - totalSaved
  const periodIncome = scopeTx.filter((t) => t.kind === 'income').reduce((a, t) => a + t.amount, 0)
  const periodExpense = scopeTx.filter((t) => t.kind === 'expense').reduce((a, t) => a + t.amount, 0)
  const savedInScope = contribs.filter((c) => inScope(c.date)).reduce((a, c) => a + signed(c), 0)

  const monthData = MONTHS.map((mk) => ({
    month: mk, label: monthLabel(mk),
    income: tx.filter((t) => t.kind === 'income' && t.date.slice(0, 7) === mk).reduce((a, t) => a + t.amount, 0),
    expense: tx.filter((t) => t.kind === 'expense' && t.date.slice(0, 7) === mk).reduce((a, t) => a + t.amount, 0),
    active: range === 'month' && mk === selMonth,
    dim: range === 'month' && mk !== selMonth,
  }))

  let catData = CATS.map((c) => ({ ...c, value: scopeTx.filter((t) => t.kind === 'expense' && t.category === c.id).reduce((a, t) => a + t.amount, 0) })).filter((c) => c.value > 0)
  catData.sort((a, b) => b.value - a.value)
  catData.forEach((c) => { c.pct = periodExpense ? Math.round(c.value / periodExpense * 100) : 0; c.pctStr = c.pct + '%' })

  const buckets = BUCKETS.map((b) => {
    // monthly target tracking is deposits-only — a withdrawal must not mark a month unmet
    const byMonth = MONTHS.map((mk) => {
      const amt = contribs.filter((c) => c.bucket === b.id && c.month === mk && !isWithdrawal(c)).reduce((a, c) => a + c.amount, 0)
      let st
      if (mk === CURRENT) st = amt >= b.target ? 'met' : (amt > 0 ? 'partial' : 'due')
      else st = amt >= b.target ? 'met' : (amt > 0 ? 'partial' : 'missed')
      const x = STATUS[st]
      return { month: mk, label: monthLabel(mk), amount: amt, amountStr: fmt(amt), status: st, mark: x.mark, bg: x.bg, fg: x.fg, bd: x.bd }
    })
    const deposited = byMonth.reduce((a, m) => a + m.amount, 0)
    const withdrawn = contribs.filter((c) => c.bucket === b.id && isWithdrawal(c)).reduce((a, c) => a + c.amount, 0)
    const saved = deposited - withdrawn // balance currently held
    const debt = byMonth.filter((m) => m.month !== CURRENT).reduce((a, m) => a + Math.max(0, b.target - m.amount), 0)
    const thisMonth = byMonth.find((m) => m.month === CURRENT).amount
    const pct = Math.min(100, Math.round(thisMonth / b.target * 100))
    // most recent account this goal was saved into, else the bucket default
    const lastWithAccount = contribs.filter((c) => c.bucket === b.id && c.account).slice(-1)[0]
    const account = (lastWithAccount && lastWithAccount.account) || b.account || ''
    return {
      ...b, account, byMonth,
      deposited, depositedStr: fmt(deposited), withdrawn, withdrawnStr: fmt(withdrawn), hasWithdrawn: withdrawn > 0,
      saved, savedStr: fmt(saved), balance: saved, balanceStr: fmt(saved),
      debt, debtStr: fmt(debt), hasDebt: debt > 0,
      thisMonth, thisMonthStr: fmt(thisMonth), targetStr: fmt(b.target), pct, pctStr: pct + '%',
      softBg: rgba(b.color, 0.14),
    }
  })
  const totalDebt = buckets.reduce((a, b) => a + b.debt, 0)
  const targetTotal = buckets.reduce((a, b) => a + b.target, 0)
  const savedRealMonth = buckets.reduce((a, b) => a + b.thisMonth, 0)

  // budget (driven by the budget-plan items)
  const items = (budgetItems || []).map((it) => {
    const sp = it.spent || 0
    const rem = (it.amount || 0) - sp
    return { id: it.id, name: it.name, amount: it.amount, valueStr: fmt(it.amount), spent: sp, spentVal: sp, spentStr: fmt(sp), remaining: rem, remainingStr: fmt(rem), remainingColor: rem < 0 ? '#E5577A' : 'var(--text2)' }
  })
  const plannedTotal = items.reduce((a, it) => a + (it.amount || 0), 0)
  const spentTotal = items.reduce((a, it) => a + (it.spent || 0), 0)
  const remainingTotal = plannedTotal - spentTotal
  const budget = plannedTotal
  const budgetSpent = spentTotal
  const budgetRemaining = budget - budgetSpent
  const budgetPctInt = budget > 0 ? Math.round(budgetSpent / budget * 100) : 0
  const budgetOver = budget > 0 && budgetSpent > budget
  const budgetNear = budget > 0 && !budgetOver && budgetSpent / budget >= 0.8
  const budgetColor = budgetOver ? '#E5577A' : (budgetNear ? '#D08700' : '#1FA779')

  let budgetSegs = CATS.map((c) => ({ name: c.name, color: c.color, value: tx.filter((t) => t.kind === 'expense' && t.category === c.id && t.date.slice(0, 7) === CURRENT).reduce((a, t) => a + t.amount, 0) })).filter((s) => s.value > 0)
  if (savedRealMonth > 0) budgetSegs.push({ name: 'Savings set aside', color: '#38BDF8', value: savedRealMonth })
  budgetSegs.forEach((s) => { s.valueStr = fmt(s.value); s.pctStr = budget > 0 ? Math.round(s.value / budget * 100) + '%' : '—'; s.widthStr = budget > 0 ? Math.min(100, s.value / budget * 100) + '%' : '0%' })

  // reminders (real current month)
  const dueB = buckets.filter((b) => b.thisMonth < b.target)
  const dueTotal = dueB.reduce((a, b) => a + (b.target - b.thisMonth), 0)
  const reminders = dueB.map((b) => ({
    bucketId: b.id, name: b.name, color: b.color,
    note: (b.target - b.thisMonth > 0 ? ('FRw ' + (b.target - b.thisMonth).toLocaleString('en-US') + ' due') : '') + (b.debt > 0 ? (' · ' + fmt(b.debt) + ' overdue') : ''),
    tone: b.debt > 0 ? '#E5577A' : 'var(--muted2)',
  }))
  const reminderCount = dueB.length
  const hasReminder = reminderCount > 0 || totalDebt > 0
  const parts = []
  if (dueTotal > 0) parts.push(fmt(dueTotal) + ' still to set aside')
  if (totalDebt > 0) parts.push(fmt(totalDebt) + ' overdue from earlier months')
  const reminderSummary = parts.length ? parts.join(' · ') : 'You are on track this month.'
  const budgetReminders = (budget > 0 && (budgetOver || budgetNear)) ? [{ budget: true, name: 'Monthly budget', color: budgetColor, note: budgetOver ? ('Over by ' + fmt(budgetSpent - budget)) : (budgetPctInt + '% used · ' + fmt(Math.max(0, budgetRemaining)) + ' left'), tone: budgetOver ? '#E5577A' : '#D08700' }] : []
  const bellReminders = budgetReminders.concat(reminders)
  const bparts = parts.slice()
  if (budget > 0 && budgetOver) bparts.unshift('budget exceeded by ' + fmt(budgetSpent - budget))
  else if (budget > 0 && budgetNear) bparts.unshift(budgetPctInt + '% of monthly budget used')
  const bellSummary = bparts.length ? bparts.join(' · ') : 'You are on track this month.'

  const disp = (t) => {
    const isInc = t.kind === 'income'
    const cat = CATS.find((c) => c.id === t.category)
    const color = isInc ? '#34D399' : (cat ? cat.color : '#94A3B8')
    return {
      id: t.id, kind: t.kind, isIncome: isInc,
      title: t.desc || (cat ? cat.name : '') || (isInc ? 'Income' : 'Expense'),
      catName: isInc ? 'Income' : (cat ? cat.name : 'Expense'), catColor: color, chipBg: rgba(color, 0.16),
      initial: isInc ? '↑' : '↓', amountStr: (isInc ? '+ ' : '− ') + fmt(t.amount), amountColor: isInc ? '#1FA779' : '#E5577A',
      dateStr: dateLabel(t.date), raw: t,
    }
  }
  const sortedScope = scopeTx.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
  const recent = sortedScope.slice(0, 6).map(disp)
  const filtered = sortedScope.filter((t) => (txFilter === 'all' ? true : t.kind === txFilter)).map(disp)
  const net = periodIncome - periodExpense

  const periodLabel = range === 'all' ? 'All time' : (range === 'year' ? ('Year ' + YEAR) : monthFull(selMonth))
  const periodShort = range === 'all' ? 'all time' : (range === 'year' ? YEAR : monthLabel(selMonth))

  return {
    scopeTx, balance, periodIncome, periodExpense, savedInScope, totalSaved, totalDebt,
    incomeCount: scopeTx.filter((t) => t.kind === 'income').length, expenseCount: scopeTx.filter((t) => t.kind === 'expense').length,
    monthData, catData, buckets, targetTotal, savedRealMonth,
    items, plannedTotal, spentTotal, remainingTotal, budget, budgetSpent, budgetRemaining, budgetPctInt, budgetOver, budgetNear, budgetColor, budgetSegs,
    reminders, reminderCount, hasReminder, reminderSummary, bellReminders, bellSummary,
    recent, filtered, net, periodLabel, periodShort,
    hasDebt: totalDebt > 0,
  }
}

export { STATUS }
