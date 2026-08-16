// Domain constants ported from the dashboard prototype.

export const TAG_COLORS = {
  Career: '#38BDF8',
  Backend: '#34D399',
  Frontend: '#F472B6',
  Journey: '#FBBF24',
  Other: '#94A3B8',
}

export const TAGS = [
  { id: 'Career', color: '#38BDF8' },
  { id: 'Backend', color: '#34D399' },
  { id: 'Frontend', color: '#F472B6' },
  { id: 'Journey', color: '#FBBF24' },
  { id: 'Other', color: '#94A3B8' },
]

export const CATS = [
  { id: 'rent', name: 'Rent', color: '#FB7185' },
  { id: 'food', name: 'Food', color: '#FBBF24' },
  { id: 'transport', name: 'Transport', color: '#38BDF8' },
  { id: 'school', name: 'School fees', color: '#818CF8' },
  { id: 'other', name: 'Other', color: '#94A3B8' },
]

// Built-in goals. `account` = where the money is held; `startMonth` = when the
// goal began counting toward savings/debt. `builtin` goals aren't editable.
export const BUCKETS = [
  { id: 'ejoheza', name: 'Ejo Heza', short: 'Ejo Heza', sub: 'Long-term pension', target: 30000, color: '#34D399', account: 'Ejo Heza', startMonth: '2025-01', builtin: true },
  { id: 'child1', name: 'Education · Child 1', short: 'Child 1', sub: 'School fund', target: 10000, color: '#38BDF8', account: 'BK', startMonth: '2025-01', builtin: true },
  { id: 'child2', name: 'Education · Child 2', short: 'Child 2', sub: 'School fund', target: 10000, color: '#818CF8', account: 'BK', startMonth: '2025-01', builtin: true },
  { id: 'child3', name: 'Education · Child 3', short: 'Child 3', sub: 'School fund', target: 10000, color: '#F472B6', account: 'BK', startMonth: '2025-01', builtin: true },
  { id: 'emergency', name: 'Emergency Fund', short: 'Emergency', sub: 'Rainy-day reserve', target: 20000, color: '#FBBF24', account: 'BK', startMonth: '2025-01', builtin: true },
]

// palette offered when creating a custom goal
export const GOAL_COLORS = ['#34D399', '#38BDF8', '#818CF8', '#F472B6', '#FBBF24', '#FB7185', '#2DD4BF', '#A78BFA', '#F59E0B', '#22D3EE']

// Live finance window: from when savings began (Jan 2025) through the real
// current month, derived at load so seeded history is always in range.
const _now = new Date()
const _pad = (n) => String(n).padStart(2, '0')
export const CURRENT = `${_now.getFullYear()}-${_pad(_now.getMonth() + 1)}`
export const YEAR = String(_now.getFullYear())
export const SAVINGS_START = '2025-01'
// how many months ahead you can pre-record a savings goal
export const FUTURE_MONTHS = 6

// inclusive list of "YYYY-MM" from an index to another (index = year*12 + month0)
const _idx = (y, m0) => y * 12 + m0
const _fromIdx = (i) => `${Math.floor(i / 12)}-${_pad((i % 12) + 1)}`
const _monthList = (fromIdx, toIdx) => {
  const out = []
  for (let i = fromIdx; i <= toIdx; i += 1) out.push(_fromIdx(i))
  return out
}
const _startIdx = _idx(...(() => { const [y, m] = SAVINGS_START.split('-').map(Number); return [y, m - 1] })())
const _curIdx = _idx(_now.getFullYear(), _now.getMonth())

// MONTHS: history → current (used by cash-flow chart, period nav, scope filters)
export const MONTHS = _monthList(_startIdx, _curIdx)
// SAVINGS_MONTHS: also includes the next FUTURE_MONTHS so goals can be funded ahead
export const SAVINGS_MONTHS = _monthList(_startIdx, _curIdx + FUTURE_MONTHS)

// public month helpers (for per-goal windows)
export const ymIndex = (ym) => { const [y, m] = String(ym).split('-').map(Number); return _idx(y, m - 1) }
export const ymFromIndex = (i) => _fromIdx(i)
export const monthRange = (startYM, endYM) => _monthList(ymIndex(startYM), ymIndex(endYM))
// the recordable window for a goal: its start → max(current, start) + FUTURE_MONTHS
export const goalMonths = (startYM) => {
  const s = startYM || SAVINGS_START
  const end = Math.max(_curIdx, ymIndex(s)) + FUTURE_MONTHS
  return _monthList(ymIndex(s), end)
}

export const ACCENT = '#34D399'
export const ACCENT2 = '#10B981'
export const GREEN_TEXT = '#1FA779'
export const RED = '#E5577A'

export function tagColor(t) {
  return TAG_COLORS[t] || '#94A3B8'
}

// Budget-item priority — used to sort the budget plan (high first).
export const PRIORITIES = [
  { id: 'high', label: 'High', color: '#E5577A', rank: 0 },
  { id: 'medium', label: 'Medium', color: '#F59E0B', rank: 1 },
  { id: 'low', label: 'Low', color: '#7E8A9C', rank: 2 },
]
export function priorityMeta(id) {
  return PRIORITIES.find((p) => p.id === id) || PRIORITIES[1]
}
