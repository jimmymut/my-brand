import { useCallback, useEffect, useState } from 'react'
import { uid } from '../lib/format'
import { Finance } from '../api/resources'
import { useToast } from '../components/Toast'

/*
 * Debt store — backend only. Modal-driven writes (add/edit a debt, record a
 * payment) are confirm-first: await the backend, then reflect the saved record,
 * so nothing shows unless it persisted. Delete stays optimistic + re-sync.
 */
export function useDebts() {
  const toast = useToast()
  const [debts, setDebts] = useState([])

  const writeError = useCallback((what, e) => {
    if (!(e && e.status === 401)) toast(`Couldn't save your ${what}. Please check your connection and try again.`, 'error')
  }, [toast])

  useEffect(() => {
    let alive = true
    Finance.debts().then((list) => { if (alive && Array.isArray(list)) setDebts(list) }).catch(() => {})
    return () => { alive = false }
  }, [])

  const saveDebt = useCallback(async (rec) => {
    try {
      if (rec.id) {
        await Finance.updateDebt(rec.id, rec)
        setDebts((cur) => cur.map((d) => (d.id === rec.id ? { ...d, ...rec, payments: d.payments || [] } : d)))
      } else {
        const saved = await Finance.addDebt({ ...rec, payments: [] })
        const doc = saved && (saved.id || saved._id) ? saved : { ...rec, id: uid(), payments: [] }
        setDebts((cur) => cur.concat([doc]))
      }
    } catch (e) { writeError('debt', e); throw e }
  }, [writeError])

  const removeDebt = useCallback(async (id) => {
    try { await Finance.removeDebt(id); setDebts((cur) => cur.filter((d) => d.id !== id)) }
    catch (e) { writeError('change', e) }
  }, [writeError])

  const addPayment = useCallback(async (debtId, payment) => {
    try {
      const updated = await Finance.addDebtPayment(debtId, { amount: payment.amount, date: payment.date, account: payment.account || '' })
      if (updated && Array.isArray(updated.payments)) {
        setDebts((cur) => cur.map((d) => (d.id === debtId ? { ...d, payments: updated.payments } : d)))
      } else {
        setDebts((cur) => cur.map((d) => (d.id === debtId ? { ...d, payments: (d.payments || []).concat([{ id: uid(), amount: payment.amount, date: payment.date, account: payment.account || '' }]) } : d)))
      }
    } catch (e) { writeError('payment', e); throw e }
  }, [writeError])

  return { debts, saveDebt, removeDebt, addPayment }
}
