import Hover from '../../components/Hover'
import AsyncButton from '../../components/AsyncButton'
import { fmt } from '../../lib/format'

const card = { padding: '20px 22px', borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--border)' }

export default function AccountsTab({ d, onAddAccount, onEditAccount, onDeleteAccount }) {
  const info = d.accountsInfo || { spendableTotal: 0, savingsTotal: 0, netWorth: 0, unassigned: { has: false } }
  const accounts = d.accounts || []
  return (
    <div>
      <div className="noprint" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 13.5, color: 'var(--muted2)' }}>{accounts.length} account{accounts.length === 1 ? '' : 's'} · where your money sits</div>
        <button onClick={onAddAccount} style={{ display: 'flex', alignItems: 'center', gap: 7, height: 38, padding: '0 16px', border: 'none', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, color: '#04110B', background: 'linear-gradient(135deg,#34D399,#10B981)', boxShadow: '0 8px 20px rgba(16,185,129,0.26)' }}><span style={{ fontSize: 17, lineHeight: 1 }}>+</span> New account</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(214px,1fr))', gap: 18, marginBottom: 22 }}>
        <div style={{ padding: 22, borderRadius: 18, background: 'linear-gradient(160deg,rgba(52,211,153,0.16),rgba(16,185,129,0.04))', border: '1px solid rgba(52,211,153,0.22)' }}>
          <div style={{ fontSize: 13, color: '#3BA883', fontWeight: 700, marginBottom: 10 }}>Spendable</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 26, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(info.spendableTotal)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted2)', marginTop: 8 }}>across everyday wallets</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>Set aside (savings)</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: '#1E9BD7', fontVariantNumeric: 'tabular-nums' }}>{fmt(info.savingsTotal)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 8 }}>in savings pots</div>
        </div>
        <div style={card}>
          <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600, marginBottom: 10 }}>Net worth</div>
          <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{fmt(info.netWorth)}</div>
          <div style={{ fontSize: 12.5, color: 'var(--muted3)', marginTop: 8 }}>spendable + set aside</div>
        </div>
      </div>

      {info.unassigned && info.unassigned.has && (
        <div style={{ padding: '13px 18px', borderRadius: 12, background: 'rgba(251,191,36,0.10)', border: '1px solid rgba(251,191,36,0.28)', marginBottom: 18, fontSize: 13, color: 'var(--muted2)' }}>
          Some records aren't tagged with an account yet ({fmt(info.unassigned.income)} in · {fmt(info.unassigned.expense)} out). Edit them to pick a wallet so balances stay exact.
        </div>
      )}

      {accounts.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted3)', fontSize: 14, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          No accounts yet — add your wallets (Airtel Money, MTN MoMo, BK, Cash) and savings pots to track where money sits.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 18 }}>
          {accounts.map((a) => (
            <div key={a.id} style={{ padding: 22, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 40, height: 40, borderRadius: 12, background: `${a.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ width: 13, height: 13, borderRadius: '50%', background: a.color }} />
                  </span>
                  <div>
                    <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 15.5, color: 'var(--strong)' }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted3)' }}>{a.type === 'savings' ? 'Savings pot' : 'Spendable wallet'}</div>
                  </div>
                </div>
                <span className="noprint" style={{ display: 'flex', gap: 6 }}>
                  <Hover onClick={() => onEditAccount(a)} title="Edit account" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid var(--border2)', background: 'var(--fill)', color: 'var(--muted)', cursor: 'pointer', fontSize: 12 }} hover={{ background: 'var(--hover)' }}>✎</Hover>
                  <AsyncButton onClick={() => onDeleteAccount(a.id)} title="Delete account" style={{ width: 28, height: 28, borderRadius: 8, border: '1px solid rgba(251,113,133,0.3)', background: 'rgba(251,113,133,0.08)', color: '#E5577A', cursor: 'pointer', fontSize: 13 }} hover={{ background: 'rgba(251,113,133,0.18)' }}>×</AsyncButton>
                </span>
              </div>
              <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 24, color: a.negative ? '#E5577A' : 'var(--strong)', fontVariantNumeric: 'tabular-nums' }}>{a.balanceStr}</div>
              <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12, color: 'var(--muted3)' }}>
                <span><span style={{ color: '#1FA779', fontWeight: 700 }}>+ {a.inflowStr}</span> in</span>
                <span><span style={{ color: '#E5577A', fontWeight: 700 }}>− {a.outflowStr}</span> out</span>
                {a.opening !== 0 && <span>· opened at {a.openingStr}</span>}
              </div>
              {a.negative && <div style={{ fontSize: 11.5, color: '#E5577A', marginTop: 8 }}>Negative — a record may be tagged to the wrong wallet.</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
