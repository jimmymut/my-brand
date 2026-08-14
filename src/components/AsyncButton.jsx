import { useRef, useState } from 'react'

/*
 * Drop-in replacement for Hover on buttons whose onClick performs an async
 * action (delete, toggle, …). While the returned promise is pending the button
 * is disabled and dimmed, so it can't be double-clicked into duplicate requests.
 */
export default function AsyncButton({ as = 'button', style, hover = {}, onClick, children, disabled, ...rest }) {
  const [busy, setBusy] = useState(false)
  const [over, setOver] = useState(false)
  const mounted = useRef(true)
  const Tag = as

  const run = async (e) => {
    if (busy || disabled) return
    setBusy(true)
    try { await onClick(e) } finally { if (mounted.current) setBusy(false) }
  }

  const isDisabled = busy || disabled
  return (
    <Tag
      {...rest}
      ref={(el) => { mounted.current = !!el }}
      disabled={isDisabled}
      onMouseEnter={() => setOver(true)}
      onMouseLeave={() => setOver(false)}
      onClick={run}
      style={{ ...style, ...(over && !isDisabled ? hover : null), ...(busy ? { opacity: 0.45, cursor: 'default' } : null) }}
    >
      {children}
    </Tag>
  )
}
