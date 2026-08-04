import { useCallback, useEffect, useState } from 'react'
import { uid } from '../lib/format'
import { Finance } from '../api/resources'

/*
 * Debt store — backend only, no seed/mock fallback. Empty stays empty.
 * Mutations are optimistic with a write-through to the API and id reconciliation
 * on create so later edits / deletes / payments hit the real document.
 */
export function useDebts() {
  const [debts, setDebts] = useState([])

  useEffect(() => {
    let alive = true
    Finance.debts().then((list) => {
      if (alive && Array.isArray(list)) setDebts(list)
    }).catch(() => { /* leave empty on error */ })
    return () => { alive = false }
  }, [])

  const saveDebt = useCallback(async (rec) => {
    const editing = !!rec.id
    const localId = rec.id || uid()
    setDebts((cur) => {
      if (editing) return cur.map((d) => (d.id === localId ? { ...d, ...rec, id: localId, payments: d.payments || [] } : d))
      return cur.concat([{ ...rec, id: localId, payments: [] }])
    })
    try {
      if (editing) await Finance.updateDebt(localId, rec)
      else {
        const saved = await Finance.addDebt({ ...rec, payments: [] })
        const sid = saved && (saved.id || saved._id)
        if (sid && sid !== localId) setDebts((cur) => cur.map((d) => (d.id === localId ? { ...d, id: sid } : d)))
      }
    } catch {}
  }, [])

  const removeDebt = useCallback((id) => {
    setDebts((cur) => cur.filter((d) => d.id !== id))
    Finance.removeDebt(id).catch(() => {})
  }, [])

  const addPayment = useCallback((debtId, payment) => {
    const p = { id: uid(), amount: payment.amount, date: payment.date }
    setDebts((cur) => cur.map((d) => (d.id === debtId ? { ...d, payments: (d.payments || []).concat([p]) } : d)))
    Finance.addDebtPayment(debtId, { amount: payment.amount, date: payment.date })
      .then((updated) => {
        if (updated && Array.isArray(updated.payments)) {
          setDebts((cur) => cur.map((d) => (d.id === debtId ? { ...d, payments: updated.payments } : d)))
        }
      })
      .catch(() => {})
  }, [])

  return { debts, saveDebt, removeDebt, addPayment }
}
