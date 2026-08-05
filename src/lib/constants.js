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

// `account` = where each goal's money is held/allocated.
export const BUCKETS = [
  { id: 'ejoheza', name: 'Ejo Heza', short: 'Ejo Heza', sub: 'Long-term pension', target: 30000, color: '#34D399', account: 'Ejo Heza' },
  { id: 'child1', name: 'Education · Child 1', short: 'Child 1', sub: 'School fund', target: 10000, color: '#38BDF8', account: 'BK' },
  { id: 'child2', name: 'Education · Child 2', short: 'Child 2', sub: 'School fund', target: 10000, color: '#818CF8', account: 'BK' },
  { id: 'child3', name: 'Education · Child 3', short: 'Child 3', sub: 'School fund', target: 10000, color: '#F472B6', account: 'BK' },
  { id: 'emergency', name: 'Emergency Fund', short: 'Emergency', sub: 'Rainy-day reserve', target: 20000, color: '#FBBF24', account: 'BK' },
]

// Live finance window: from when savings began (Jan 2025) through the real
// current month, derived at load so seeded history is always in range.
const _now = new Date()
const _pad = (n) => String(n).padStart(2, '0')
export const CURRENT = `${_now.getFullYear()}-${_pad(_now.getMonth() + 1)}`
export const YEAR = String(_now.getFullYear())
export const SAVINGS_START = '2025-01'
export const MONTHS = (() => {
  const [sy, sm] = SAVINGS_START.split('-').map((n) => parseInt(n, 10))
  const ey = _now.getFullYear()
  const em = _now.getMonth() + 1
  const out = []
  let y = sy, m = sm
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${_pad(m)}`)
    m += 1
    if (m > 12) { m = 1; y += 1 }
  }
  return out
})()

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
