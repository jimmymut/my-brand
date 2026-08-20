// Pure finance computations ported from the dashboard prototype's renderVals().
import { BUCKETS, CATS, CURRENT, YEAR, MONTHS, priorityMeta, goalMonths } from '../lib/constants'
import { fmt, monthLabel, monthFull, dateLabel, rgba } from '../lib/format'

const STATUS = {
  met: { bg: 'rgba(52,211,153,0.16)', fg: '#1FA779', bd: 'rgba(52,211,153,0.4)', mark: '✓' },
  partial: { bg: 'rgba(251,191,36,0.16)', fg: '#C98A00', bd: 'rgba(251,191,36,0.45)', mark: '½' },
  missed: { bg: 'rgba(251,113,133,0.14)', fg: '#E5577A', bd: 'rgba(251,113,133,0.42)', mark: '✕' },
  due: { bg: 'var(--fill)', fg: 'var(--muted3)', bd: 'var(--border2)', mark: '·' },
  future: { bg: 'transparent', fg: 'var(--muted4)', bd: 'var(--border)', mark: '+' }, // ahead of time — tap to pre-fund
}

// Effective monthly target for a given month: the latest schedule breakpoint at
// or before `mk`, else the goal's base target. Lets targets change over time
// without rewriting the amount past months were owed.
export function targetAt(base, schedule, mk) {
  let t = Number(base) || 0
  const sorted = (schedule || []).slice().sort((a, b) => (String(a.month) < String(b.month) ? -1 : 1))
  for (const s of sorted) {
    if (String(s.month) <= String(mk)) t = Number(s.target) || 0
    else break
  }
  return t
}

// Budget for a single month. Plan items are scoped by their `month` (legacy
// items with no month count as the current month). `budgetSegs` shows that
// month's recorded expenses + savings set aside, for reference.
export function deriveBudget(budgetItems, tx, contribs, month) {
  const items = (budgetItems || []).filter((it) => (it.month || CURRENT) === month).map((it) => {
    const sp = it.spent || 0
    const rem = (it.amount || 0) - sp
    const priority = it.priority || 'low'
    const pm = priorityMeta(priority)
    return { id: it.id, name: it.name, amount: it.amount, valueStr: fmt(it.amount), spent: sp, spentVal: sp, spentStr: fmt(sp), remaining: rem, remainingStr: fmt(rem), remainingColor: rem < 0 ? '#E5577A' : 'var(--text2)', priority, priorityLabel: pm.label, priorityColor: pm.color, priorityRank: pm.rank, order: it.order || 0, month: it.month || CURRENT }
  }).sort((a, b) => a.order - b.order) // manual drag order
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

  const savedForMonth = (contribs || []).filter((c) => c.month === month && c.kind !== 'withdrawal').reduce((a, c) => a + (c.amount || 0), 0)
  let budgetSegs = CATS.map((c) => ({ name: c.name, color: c.color, value: (tx || []).filter((t) => t.kind === 'expense' && t.category === c.id && t.date.slice(0, 7) === month).reduce((a, t) => a + t.amount, 0) })).filter((s) => s.value > 0)
  if (savedForMonth > 0) budgetSegs.push({ name: 'Savings set aside', color: '#38BDF8', value: savedForMonth })
  budgetSegs.forEach((s) => { s.valueStr = fmt(s.value); s.pctStr = budget > 0 ? Math.round(s.value / budget * 100) + '%' : '—'; s.widthStr = budget > 0 ? Math.min(100, s.value / budget * 100) + '%' : '0%' })

  return { month, items, plannedTotal, spentTotal, remainingTotal, budget, budgetSpent, budgetRemaining, budgetPctInt, budgetOver, budgetNear, budgetColor, budgetSegs }
}

// Resolve an account reference (its id, or a legacy/built-in NAME) to the account.
export function accountResolver(accounts) {
  const list = accounts || []
  const byId = new Map(list.map((a) => [a.id, a]))
  const byName = new Map(list.map((a) => [a.name, a]))
  return (ref) => (ref && (byId.get(ref) || byName.get(ref))) || null
}

// Per-account (wallet/pot) balances. Records link to an account by id (names are
// still resolved for legacy/built-in data). balance = opening + income in
// − expenses out + deposits landing here − deposits paid from here
// − withdrawals taken from here + withdrawals returned here.
export function deriveAccounts(accounts, tx, contribs, assets, debts) {
  const list = accounts || []
  const resolve = accountResolver(list)
  const inflow = {}, outflow = {}
  const bump = (map, acc, amt) => { if (acc) map[acc.id] = (map[acc.id] || 0) + (amt || 0) }
  ;(tx || []).forEach((t) => {
    const acc = resolve(t.account)
    if (t.kind === 'income') bump(inflow, acc, t.amount)
    else if (t.kind === 'expense') bump(outflow, acc, t.amount)
  })
  ;(contribs || []).forEach((c) => {
    const pot = resolve(c.account)
    const wal = resolve(c.wallet)
    if (c.kind === 'withdrawal') { bump(outflow, pot, c.amount); bump(inflow, wal, c.amount) }
    else { bump(inflow, pot, c.amount); bump(outflow, wal, c.amount) }
  })
  ;(assets || []).forEach((a) => {
    if (a.archived) return
    if (a.wallet && a.cost) bump(outflow, resolve(a.wallet), a.cost) // paid to acquire it
    if (a.sold && a.soldWallet && a.soldAmount) bump(inflow, resolve(a.soldWallet), a.soldAmount) // sale proceeds
  })
  ;(debts || []).forEach((d) => {
    const borrowed = d.direction !== 'lent'
    // origination: borrowed money lands in a wallet; lent money leaves one (only if linked)
    if (d.account) bump(borrowed ? inflow : outflow, resolve(d.account), d.amount)
    // repayments: on borrowed I pay out; on lent I receive (only linked payments)
    ;(d.payments || []).forEach((p) => {
      if (p.account) bump(borrowed ? outflow : inflow, resolve(p.account), p.amount)
    })
  })
  const views = list.filter((a) => !a.archived).slice().sort((a, b) => (a.order || 0) - (b.order || 0)).map((a) => {
    const inf = inflow[a.id] || 0
    const outf = outflow[a.id] || 0
    const opening = a.openingBalance || 0
    const balance = opening + inf - outf
    return {
      id: a.id, name: a.name, type: a.type || 'spendable', color: a.color || '#38BDF8',
      opening, openingStr: fmt(opening), inflow: inf, outflow: outf,
      inflowStr: fmt(inf), outflowStr: fmt(outf),
      balance, balanceStr: fmt(balance), negative: balance < 0,
    }
  })
  const spendableTotal = views.filter((v) => v.type === 'spendable').reduce((a, v) => a + v.balance, 0)
  const savingsTotal = views.filter((v) => v.type === 'savings').reduce((a, v) => a + v.balance, 0)
  // income/expense whose account reference resolves to nothing (legacy/unset)
  const sum = (arr) => arr.reduce((a, x) => a + (x.amount || 0), 0)
  const unInc = sum((tx || []).filter((t) => t.kind === 'income' && !resolve(t.account)))
  const unExp = sum((tx || []).filter((t) => t.kind === 'expense' && !resolve(t.account)))
  const unassigned = { income: unInc, expense: unExp, net: unInc - unExp, has: unInc > 0 || unExp > 0 }
  return { views, spendableTotal, savingsTotal, netWorth: spendableTotal + savingsTotal, unassigned }
}

export const ASSET_TYPES = {
  land: { label: 'Land', color: '#34D399' },
  house: { label: 'House', color: '#38BDF8' },
  vehicle: { label: 'Vehicle', color: '#F59E0B' },
  equipment: { label: 'Equipment', color: '#A78BFA' },
  investment: { label: 'Investment', color: '#F472B6' },
  other: { label: 'Other', color: '#94A3B8' },
}

// Property/assets: totals, gain vs cost, type-specific detail chips, per-type split.
export function deriveAssets(assets, accounts) {
  const resolve = accountResolver(accounts || [])
  const nameOf = (ref) => { const a = resolve(ref); return a ? a.name : (ref || '') }
  const list = (assets || []).filter((a) => !a.archived)
  const view = (a) => {
    const meta = ASSET_TYPES[a.type] || ASSET_TYPES.other
    const value = a.value || 0
    const cost = a.cost || 0
    const gain = value - cost
    const details = []
    if (a.type === 'land') {
      if (a.size) details.push(`${a.size} ${a.sizeUnit || 'sqm'}`)
      if (a.upi) details.push(`UPI ${a.upi}`)
    }
    if (a.type === 'house' && a.size) details.push(`${a.size} ${a.sizeUnit || 'sqm'}`)
    if (a.type === 'vehicle') {
      if (a.plate) details.push(a.plate)
      if (a.year) details.push(String(a.year))
    }
    if (a.location) details.push(a.location)
    return {
      id: a.id, name: a.name || meta.label, type: a.type || 'other', typeLabel: meta.label,
      color: a.color || meta.color, value, valueStr: fmt(value), cost, costStr: fmt(cost),
      gain, gainStr: (gain >= 0 ? '+ ' : '− ') + fmt(Math.abs(gain)), gainColor: gain >= 0 ? '#1FA779' : '#E5577A', hasCost: cost > 0,
      acquiredDate: a.acquiredDate || '', location: a.location || '', details, notes: a.notes || '',
      sold: !!a.sold, soldAmount: a.soldAmount || 0, soldAmountStr: fmt(a.soldAmount || 0), soldWalletName: nameOf(a.soldWallet), soldDate: a.soldDate || '',
      walletName: nameOf(a.wallet), order: a.order || 0, raw: a,
    }
  }
  const active = list.filter((a) => !a.sold).map(view).sort((x, y) => x.order - y.order)
  const sold = list.filter((a) => a.sold).map(view)
  const totalValue = active.reduce((s, a) => s + a.value, 0)
  const totalCost = active.reduce((s, a) => s + a.cost, 0)
  const gain = totalValue - totalCost
  const byType = []
  active.forEach((a) => {
    let g = byType.find((x) => x.type === a.type)
    if (!g) { g = { type: a.type, label: a.typeLabel, color: a.color, value: 0, count: 0 }; byType.push(g) }
    g.value += a.value; g.count += 1
  })
  byType.forEach((g) => { g.valueStr = fmt(g.value) })
  return {
    active, sold, count: active.length, byType,
    totalValue, totalValueStr: fmt(totalValue), totalCost, totalCostStr: fmt(totalCost),
    gain, gainStr: (gain >= 0 ? '+ ' : '− ') + fmt(Math.abs(gain)), gainColor: gain >= 0 ? '#1FA779' : '#E5577A', hasGain: totalCost > 0,
  }
}

export function deriveFinance({ tx, contribs, budgetItems, goals, accounts, assets, debts }, { range, selMonth, txFilter }) {
  const inScope = (d) => {
    if (range === 'all') return true
    if (range === 'year') return d.slice(0, 4) === YEAR
    return d.slice(0, 7) === selMonth
  }
  const scopeTx = tx.filter((t) => inScope(t.date))
  // records link to accounts by id; resolve id-or-legacy-name to a display name
  const resolveAcct = accountResolver(accounts)
  const acctName = (ref) => { const a = resolveAcct(ref); return a ? a.name : (ref || '') }
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

  // built-in goals + user-created custom goals. Goal docs flagged `overrideFor`
  // aren't standalone goals — they only carry target-schedule overrides for a
  // built-in bucket, so they're pulled out here and applied by id below.
  const allGoals = goals || []
  const overrides = allGoals.filter((g) => g.overrideFor)
  const overrideScheduleFor = (bid) => {
    const o = overrides.find((x) => x.overrideFor === bid)
    return (o && o.targetSchedule) || []
  }
  const goalDefs = allGoals.filter((g) => !g.overrideFor).map((g) => ({
    id: g.id, name: g.name || 'Goal', short: g.short || g.name || 'Goal', sub: g.sub || 'Custom goal',
    target: g.target || 0, color: g.color || '#34D399', account: g.account || '',
    startMonth: g.startMonth || CURRENT, custom: true, targetSchedule: g.targetSchedule || [],
  }))
  const allBuckets = BUCKETS.concat(goalDefs)

  const buckets = allBuckets.map((b) => {
    // a goal only counts from its start month (nothing before it is owed/missed),
    // and can be pre-funded a few months past its start / the current month
    // (goalMonths falls back to the default start when a goal has no startMonth)
    const months = goalMonths(b.startMonth)
    // target changes over time: custom goals carry their own schedule; built-ins
    // read overrides from the carrier doc. Each month uses its effective target.
    const schedule = b.custom ? (b.targetSchedule || []) : overrideScheduleFor(b.id)
    const curTarget = targetAt(b.target, schedule, CURRENT)
    // monthly target tracking is deposits-only — a withdrawal must not mark a month unmet
    const byMonth = months.map((mk) => {
      const tgt = targetAt(b.target, schedule, mk)
      const amt = contribs.filter((c) => c.bucket === b.id && c.month === mk && !isWithdrawal(c)).reduce((a, c) => a + c.amount, 0)
      let st
      if (mk > CURRENT) st = amt >= tgt ? 'met' : (amt > 0 ? 'partial' : 'future') // ahead of time
      else if (mk === CURRENT) st = amt >= tgt ? 'met' : (amt > 0 ? 'partial' : 'due')
      else st = amt >= tgt ? 'met' : (amt > 0 ? 'partial' : 'missed')
      const x = STATUS[st]
      return { month: mk, label: monthLabel(mk), amount: amt, amountStr: fmt(amt), target: tgt, targetStr: fmt(tgt), status: st, mark: x.mark, bg: x.bg, fg: x.fg, bd: x.bd }
    })
    const deposited = byMonth.reduce((a, m) => a + m.amount, 0) // includes any pre-funded future months
    const withdrawn = contribs.filter((c) => c.bucket === b.id && isWithdrawal(c)).reduce((a, c) => a + c.amount, 0)
    const saved = deposited - withdrawn // balance currently held
    const curCell = byMonth.find((m) => m.month === CURRENT)
    const thisMonth = curCell ? curCell.amount : 0
    // owed = start month through the current month; future & pre-start never owed.
    // each month is owed its own effective target (past targets are preserved)
    const owed = byMonth.filter((m) => m.month <= CURRENT)
    const debt = owed.reduce((a, m) => a + Math.max(0, m.target - m.amount), 0)
    const debtPast = owed.filter((m) => m.month < CURRENT).reduce((a, m) => a + Math.max(0, m.target - m.amount), 0)
    const pct = curTarget ? Math.min(100, Math.round(thisMonth / curTarget * 100)) : 0
    // most recent account this goal was saved into, else the bucket default
    const lastWithAccount = contribs.filter((c) => c.bucket === b.id && c.account).slice(-1)[0]
    const account = acctName((lastWithAccount && lastWithAccount.account) || b.account || '')
    return {
      ...b, target: curTarget, account, byMonth, schedule, hasTargetChanges: (schedule || []).length > 0,
      deposited, depositedStr: fmt(deposited), withdrawn, withdrawnStr: fmt(withdrawn), hasWithdrawn: withdrawn > 0,
      saved, savedStr: fmt(saved), balance: saved, balanceStr: fmt(saved),
      debt, debtStr: fmt(debt), hasDebt: debt > 0, debtPast, debtPastStr: fmt(debtPast),
      thisMonth, thisMonthStr: fmt(thisMonth), targetStr: fmt(curTarget), pct, pctStr: pct + '%',
      softBg: rgba(b.color, 0.14),
    }
  })
  const totalDebt = buckets.reduce((a, b) => a + b.debt, 0)          // incl. current month
  const pastDebtTotal = buckets.reduce((a, b) => a + b.debtPast, 0)  // earlier months only
  const targetTotal = buckets.reduce((a, b) => a + b.target, 0)
  const savedRealMonth = buckets.reduce((a, b) => a + b.thisMonth, 0)

  // budget for the CURRENT month (reminders/overview/bell). The Budget tab shows
  // a month it picks itself, via a separate deriveBudget() call in the Dashboard.
  const { items, plannedTotal, spentTotal, remainingTotal, budget, budgetSpent, budgetRemaining, budgetPctInt, budgetOver, budgetNear, budgetColor, budgetSegs } = deriveBudget(budgetItems, tx, contribs, CURRENT)

  // reminders (real current month)
  const dueB = buckets.filter((b) => b.thisMonth < b.target)
  const dueTotal = dueB.reduce((a, b) => a + (b.target - b.thisMonth), 0)
  const reminders = dueB.map((b) => ({
    bucketId: b.id, name: b.name, color: b.color,
    note: (b.target - b.thisMonth > 0 ? ('FRw ' + (b.target - b.thisMonth).toLocaleString('en-US') + ' due') : '') + (b.debtPast > 0 ? (' · ' + fmt(b.debtPast) + ' overdue') : ''),
    tone: b.debtPast > 0 ? '#E5577A' : 'var(--muted2)',
  }))
  const reminderCount = dueB.length
  const hasReminder = reminderCount > 0 || totalDebt > 0
  const parts = []
  if (dueTotal > 0) parts.push(fmt(dueTotal) + ' still to set aside')
  if (pastDebtTotal > 0) parts.push(fmt(pastDebtTotal) + ' overdue from earlier months')
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
      id: t.id, kind: t.kind, isIncome: isInc, date: t.date,
      title: t.desc || (cat ? cat.name : '') || (isInc ? 'Income' : 'Expense'),
      catName: isInc ? 'Income' : (cat ? cat.name : 'Expense'), catColor: color, chipBg: rgba(color, 0.16),
      initial: isInc ? '↑' : '↓', amountStr: (isInc ? '+ ' : '− ') + fmt(t.amount), amountColor: isInc ? '#1FA779' : '#E5577A',
      account: t.account || '', accountLabel: t.account ? ((isInc ? 'to ' : 'from ') + acctName(t.account)) : '',
      dateStr: dateLabel(t.date), raw: t,
    }
  }
  // Savings deposits/withdrawals shown as distinct ledger rows (so you never have
  // to log a saving as an expense). A deposit leaves your spendable balance (−);
  // a withdrawal returns to it (+). These are NOT expenses — the balance already
  // accounts for them via `saved`, so they must not be double-counted.
  const savingDisp = (c) => {
    const isDep = c.kind !== 'withdrawal'
    const b = buckets.find((x) => x.id === c.bucket)
    const name = b ? (b.short || b.name) : 'Savings'
    const color = (b && b.color) || '#38BDF8'
    return {
      id: c.id, kind: 'saving', isIncome: !isDep, isSaving: true, date: c.date,
      title: (isDep ? 'Saved to ' : 'Withdrew from ') + name,
      catName: isDep ? 'Saving' : 'Withdrawal', catColor: color, chipBg: rgba(color, 0.16),
      initial: isDep ? '↓' : '↑', amountStr: (isDep ? '− ' : '+ ') + fmt(c.amount), amountColor: isDep ? '#1E9BD7' : '#1FA779',
      account: c.wallet || '', accountLabel: c.wallet ? ((isDep ? 'from ' : 'to ') + acctName(c.wallet)) : '',
      dateStr: dateLabel(c.date), raw: c,
    }
  }
  // Debt movements as read-only ledger rows (only the account-linked ones affect
  // balances, so only those appear). Borrowed cash comes in / repayments go out;
  // lent cash goes out / repayments come in.
  const debtRows = []
  ;(debts || []).forEach((d) => {
    const borrowed = d.direction !== 'lent'
    if (d.account && inScope(d.date)) {
      debtRows.push({
        id: 'debt-' + d.id, kind: 'debt', readOnly: true, isIncome: borrowed, date: d.date,
        title: (borrowed ? 'Borrowed from ' : 'Lent to ') + (d.name || 'someone'),
        catName: borrowed ? 'Borrowed' : 'Lent', catColor: '#F59E0B', chipBg: rgba('#F59E0B', 0.16),
        initial: borrowed ? '↑' : '↓', amountStr: (borrowed ? '+ ' : '− ') + fmt(d.amount), amountColor: borrowed ? '#1FA779' : '#E5577A',
        account: d.account, accountLabel: (borrowed ? 'into ' : 'from ') + acctName(d.account),
        dateStr: dateLabel(d.date), raw: d,
      })
    }
    ;(d.payments || []).forEach((p, i) => {
      if (!p.account || !inScope(p.date)) return
      debtRows.push({
        id: 'pay-' + d.id + '-' + (p.id || i), kind: 'debt', readOnly: true, isIncome: !borrowed, date: p.date,
        title: (borrowed ? 'Repaid ' : 'Repayment from ') + (d.name || 'someone'),
        catName: 'Debt payment', catColor: '#F59E0B', chipBg: rgba('#F59E0B', 0.16),
        initial: borrowed ? '↓' : '↑', amountStr: (borrowed ? '− ' : '+ ') + fmt(p.amount), amountColor: borrowed ? '#E5577A' : '#1FA779',
        account: p.account, accountLabel: (borrowed ? 'from ' : 'into ') + acctName(p.account),
        dateStr: dateLabel(p.date), raw: d,
      })
    })
  })
  const scopeContribs = contribs.filter((c) => inScope(c.date))
  const feed = scopeTx.map(disp).concat(scopeContribs.map(savingDisp)).concat(debtRows).sort((a, b) => (a.date < b.date ? 1 : -1))
  const recent = feed.slice(0, 6)
  const filtered = feed.filter((t) => (txFilter === 'all' ? true : t.kind === txFilter))
  const net = periodIncome - periodExpense

  const accountsView = deriveAccounts(accounts, tx, contribs, assets, debts)
  const assetsView = deriveAssets(assets, accounts)

  const periodLabel = range === 'all' ? 'All time' : (range === 'year' ? ('Year ' + YEAR) : monthFull(selMonth))
  const periodShort = range === 'all' ? 'all time' : (range === 'year' ? YEAR : monthLabel(selMonth))

  return {
    scopeTx, balance, totalIncome, totalExpense, periodIncome, periodExpense, savedInScope, totalSaved, totalDebt,
    incomeCount: scopeTx.filter((t) => t.kind === 'income').length, expenseCount: scopeTx.filter((t) => t.kind === 'expense').length,
    monthData, catData, buckets, targetTotal, savedRealMonth,
    items, plannedTotal, spentTotal, remainingTotal, budget, budgetSpent, budgetRemaining, budgetPctInt, budgetOver, budgetNear, budgetColor, budgetSegs,
    reminders, reminderCount, hasReminder, reminderSummary, bellReminders, bellSummary,
    recent, filtered, net, periodLabel, periodShort,
    accounts: accountsView.views, accountsInfo: accountsView,
    assetsInfo: assetsView,
    hasDebt: totalDebt > 0,
  }
}

export { STATUS }
