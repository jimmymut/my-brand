import { useState } from 'react'
import { fmt, fmtShort } from '../lib/format'

// Cash-flow bars — income / expense per month, with a hover tooltip.
export function BarChart({ monthData }) {
  const H = 176
  const [hi, setHi] = useState(null)
  const max = Math.max(1, ...monthData.map((m) => Math.max(m.income, m.expense)))
  const n = monthData.length || 1
  const Bar = ({ v, grad }) => (
    <div style={{ width: 15, height: Math.max(4, (v / max) * H), borderRadius: '5px 5px 0 0', background: grad, transition: 'height .4s' }} />
  )
  const active = hi != null ? monthData[hi] : null
  return (
    <div style={{ position: 'relative' }}>
      {active && (
        <div style={{ position: 'absolute', top: 0, left: `${((hi + 0.5) / n) * 100}%`, transform: 'translateX(-50%)', zIndex: 5, pointerEvents: 'none', padding: '8px 11px', borderRadius: 10, background: 'var(--surface2)', border: '1px solid var(--border2)', boxShadow: '0 10px 26px var(--shadow)', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--strong)', marginBottom: 5 }}>{active.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--muted)' }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#34D399' }} />Income <b style={{ marginLeft: 'auto', paddingLeft: 12, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(active.income)}</b></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--muted)', marginTop: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#FB7185' }} />Expense <b style={{ marginLeft: 'auto', paddingLeft: 12, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(active.expense)}</b></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--muted)', marginTop: 3, borderTop: '1px solid var(--border)', paddingTop: 4 }}>Net <b style={{ marginLeft: 'auto', paddingLeft: 12, color: active.income - active.expense < 0 ? '#E5577A' : '#1FA779', fontVariantNumeric: 'tabular-nums' }}>{fmt(active.income - active.expense)}</b></div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: H + 26 }}>
        {monthData.map((m, i) => (
          <div
            key={m.month}
            onMouseEnter={() => setHi(i)}
            onMouseLeave={() => setHi(null)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, cursor: 'default', opacity: m.dim ? 0.4 : (hi != null && hi !== i ? 0.55 : 1), transition: 'opacity .15s' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: H }}>
              <Bar v={m.income} grad="linear-gradient(180deg,#4ADE9E,#10B981)" />
              <Bar v={m.expense} grad="linear-gradient(180deg,#FB7185,#E11D48)" />
            </div>
            <div style={{ fontSize: 12, color: m.active ? '#1FA779' : 'var(--muted2)', fontWeight: m.active ? 700 : 500, fontFamily: "'JetBrains Mono'" }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Spending donut — SVG ring, one hoverable segment per category. Hovering a
// segment shows its amount + share in the middle of the ring.
export function Donut({ catData, total }) {
  const [hi, setHi] = useState(null)
  const R = 60
  const SW = 26
  const C = 2 * Math.PI * R
  let acc = 0
  const segs = catData.map((c) => {
    const frac = total > 0 ? c.value / total : 0
    const seg = { ...c, frac, len: frac * C, offset: acc }
    acc += seg.len
    return seg
  })
  const active = hi != null ? segs[hi] : null
  return (
    <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
        {total <= 0 && <circle cx="75" cy="75" r={R} fill="none" stroke="var(--fill)" strokeWidth={SW} />}
        {segs.map((s, i) => (
          <circle
            key={s.id}
            cx="75" cy="75" r={R} fill="none"
            stroke={s.color}
            strokeWidth={hi === i ? SW + 5 : SW}
            strokeDasharray={`${Math.max(0, s.len - 1)} ${C - Math.max(0, s.len - 1)}`}
            strokeDashoffset={-s.offset}
            style={{ cursor: 'pointer', transition: 'stroke-width .15s', opacity: hi != null && hi !== i ? 0.5 : 1, pointerEvents: 'stroke' }}
            onMouseEnter={() => setHi(i)}
            onMouseLeave={() => setHi(null)}
          />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: SW + 4, borderRadius: '50%', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', pointerEvents: 'none' }}>
        {active ? (
          <>
            <div style={{ fontSize: 10.5, color: 'var(--muted2)', maxWidth: 70, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{active.name}</div>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmtShort(active.value)}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: active.color }}>{active.pctStr}</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, color: 'var(--muted2)' }}>Spent</div>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--strong)' }}>{total > 0 ? fmtShort(total) : '—'}</div>
          </>
        )}
      </div>
    </div>
  )
}
