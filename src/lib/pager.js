// Pagination token logic — mirrors the design prototype's mkPager/paginate.
// Returns the slice window plus the numbered tokens (with … gaps) the Pager renders.
export function makePager(total, size, page, setPage) {
  const totalPages = Math.max(1, Math.ceil(total / size))
  const p = Math.min(Math.max(1, page || 1), totalPages)
  const from = (p - 1) * size

  let toks
  if (totalPages <= 7) {
    toks = []
    for (let i = 1; i <= totalPages; i++) toks.push(i)
  } else {
    toks = [1]
    const a = Math.max(2, p - 1)
    const b = Math.min(totalPages - 1, p + 1)
    if (a > 2) toks.push('…')
    for (let i = a; i <= b; i++) toks.push(i)
    if (b < totalPages - 1) toks.push('…')
    toks.push(totalPages)
  }

  return {
    from,
    size,
    page: p,
    totalPages,
    total,
    fromLabel: total === 0 ? 0 : from + 1,
    toLabel: Math.min(from + size, total),
    multiPage: totalPages > 1,
    onPrev: () => setPage(Math.max(1, p - 1)),
    onNext: () => setPage(Math.min(totalPages, p + 1)),
    tokens: toks.map((t) =>
      t === '…'
        ? { label: '…', bg: 'transparent', fg: 'var(--muted3)', bd: 'transparent', cursor: 'default', onClick: () => {} }
        : {
            label: String(t),
            bg: t === p ? 'rgba(52,211,153,0.16)' : 'var(--fill)',
            fg: t === p ? '#1FA779' : 'var(--text)',
            bd: t === p ? 'rgba(52,211,153,0.5)' : 'var(--border2)',
            cursor: 'pointer',
            onClick: () => setPage(t),
          }
    ),
  }
}

// Convenience: slice a list for the current page given the pager.
export function pageSlice(list, pager) {
  return list.slice(pager.from, pager.from + pager.size)
}
