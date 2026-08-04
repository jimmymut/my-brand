import { fmtShort } from '../lib/format'

// Cash-flow bars — income / expense per month.
export function BarChart({ monthData }) {
  const H = 176
  const max = Math.max(1, ...monthData.map((m) => Math.max(m.income, m.expense)))
  const Bar = ({ v, grad }) => (
    <div style={{ width: 15, height: Math.max(4, (v / max) * H), borderRadius: '5px 5px 0 0', background: grad, transition: 'height .4s' }} />
  )
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: H + 26 }}>
      {monthData.map((m) => (
        <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, opacity: m.dim ? 0.4 : 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: H }}>
            <Bar v={m.income} grad="linear-gradient(180deg,#4ADE9E,#10B981)" />
            <Bar v={m.expense} grad="linear-gradient(180deg,#FB7185,#E11D48)" />
          </div>
          <div style={{ fontSize: 12, color: m.active ? '#1FA779' : 'var(--muted2)', fontWeight: m.active ? 700 : 500, fontFamily: "'JetBrains Mono'" }}>{m.label}</div>
        </div>
      ))}
    </div>
  )
}

// Spending donut — conic gradient by category.
export function Donut({ catData, total }) {
  let acc = 0
  const stops = []
  catData.forEach((c) => {
    const s = (acc / total) * 360
    acc += c.value
    const e = (acc / total) * 360
    stops.push(`${c.color} ${s}deg ${e}deg`)
  })
  const grad = total > 0 ? `conic-gradient(${stops.join(',')})` : 'conic-gradient(var(--fill) 0deg 360deg)'
  return (
    <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0, borderRadius: '50%', background: grad }}>
      <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, color: 'var(--muted2)' }}>Spent</div>
        <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18, color: 'var(--strong)' }}>{total > 0 ? fmtShort(total) : '—'}</div>
      </div>
    </div>
  )
}
