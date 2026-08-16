import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import { fmt, dateLabel } from '../../lib/format'

const card = { padding: '20px 22px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }

export default function AssetsTab({ d, debt, onAddAsset, onEditAsset, onDeleteAsset, onSellAsset }) {
  const a = d.assetsInfo || { active: [], sold: [], totalValue: 0, gain: 0, byType: [], hasGain: false }
  const acc = d.accountsInfo || { spendableTotal: 0, savingsTotal: 0, netWorth: 0 }
  const debtNet = debt ? debt.debtNet : 0
  const netWorth = acc.netWorth + a.totalValue + debtNet

  const line = (label, val, color) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, fontSize: 12.5, padding: '4px 0' }}>
      <span style={{ color: 'var(--muted2)' }}>{label}</span>
      <span style={{ color: color || 'var(--text)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{(val < 0 ? '− ' : '') + fmt(Math.abs(val))}</span>
    </div>
  )

  return (
    <div>
      <div className="noprint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13.5, color: 'var(--muted2)' }}>{a.count} asset{a.count === 1 ? '' : 's'} · what you own</div>
        <button onClick={onAddAsset} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 8px 20px rgba(16,185,129,0.26)' }}><span style={{ fontSize: 17, lineHeight: 1 }}>+</span> New asset</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 18, marginBottom: 22 }}>
        <div style={{ padding: 22, borderRadius: 18, background: 'linear-gradient(160deg,rgba(167,139,250,0.16),rgba(129,140,248,0.04))', border: '1px solid rgba(167,139,250,0.22)' }}>
          <div style={{ fontSize: 13, color: '#8B7DD8', fontWeight: 700, marginBottom: 10 }}>Net worth</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 27, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(netWorth)}</div>
          <div style={{ marginTop: 10 }}>
            {line('Spendable', acc.spendableTotal)}
            {line('Savings', acc.savingsTotal)}
            {line('Assets', a.totalValue)}
            {debtNet !== 0 && line(debtNet >= 0 ? 'Owed to you' : 'You owe', debtNet, debtNet >= 0 ? '#1FA779' : '#E5577A')}
          </div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>Assets value</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{a.totalValueStr}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 8 }}>across {a.count} asset{a.count === 1 ? '' : 's'}</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>Gain vs cost</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: a.hasGain ? a.gainColor : 'var(--muted3)', fontVariantNumeric: 'tabular-nums' }}>{a.hasGain ? a.gainStr : '—'}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 8 }}>{a.hasGain ? 'vs ' + a.totalCostStr + ' paid' : 'add buying cost to track'}</div>
        </div>
      </div>

      {a.byType.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          {a.byType.map((g) => (
            <div key={g.type} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 13px', borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: g.color }} />
              <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 600 }}>{g.label}</span>
              <span style={{ fontSize: 12.5, color: 'var(--muted2)', fontVariantNumeric: 'tabular-nums' }}>{g.valueStr}</span>
            </div>
          ))}
        </div>
      )}

      {a.active.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted3)', fontSize: 14, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          No assets yet — add land, a house, a vehicle or anything you own to see it in your net worth.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 18 }}>
          {a.active.map((it) => (
            <div key={it.id} style={{ padding: 22, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: `${it.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ width: 13, height: 13, borderRadius: 4, background: it.color }} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15.5, color: 'var(--strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted3)' }}>{it.typeLabel}</div>
                  </div>
                </div>
                <span className="noprint" style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Hover onClick={() => onSellAsset(it)} title="Record a sale" style={{ height: 28, padding: '0 10px', borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center' }} hover={{ background: 'var(--hover)' }}>Sell</Hover>
                  <Hover onClick={() => onEditAsset(it)} title="Edit" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }} hover={{ background: 'var(--hover)' }}>✎</Hover>
                  <AsyncButton onClick={() => onDeleteAsset(it.id)} title="Delete" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 23, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{it.valueStr}</span>
                {it.hasCost && <span style={{ fontSize: 12.5, fontWeight: 700, color: it.gainColor }}>{it.gainStr}</span>}
              </div>
              {it.details.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                  {it.details.map((dt, i) => (
                    <span key={i} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--muted2)', background: 'var(--fill)', border: '1px solid var(--border2)', padding: '3px 9px', borderRadius: 7 }}>{dt}</span>
                  ))}
                </div>
              )}
              {(it.hasCost || it.acquiredDate) && (
                <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 10 }}>
                  {it.hasCost && <>bought for {it.costStr}</>}{it.hasCost && it.acquiredDate ? ' · ' : ''}{it.acquiredDate && <>acquired {dateLabel(it.acquiredDate)}</>}
                </div>
              )}
              {it.notes && <div style={{ fontSize: 12, color: 'var(--muted3)', marginTop: 8, fontStyle: 'italic' }}>{it.notes}</div>}
            </div>
          ))}
        </div>
      )}

      {a.sold.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--muted3)', fontWeight: 700, marginBottom: 12 }}>Sold</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {a.sold.map((it) => (
              <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: it.color, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text2)' }}>{it.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted3)' }}>Sold {it.soldDate ? dateLabel(it.soldDate) : ''}{it.soldWalletName ? ' · into ' + it.soldWalletName : ''}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1FA779', fontVariantNumeric: 'tabular-nums' }}>{it.soldAmountStr}</span>
                <AsyncButton onClick={() => onDeleteAsset(it.id)} title="Remove record" className="noprint" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
