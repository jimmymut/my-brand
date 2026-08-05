import { useCallback, useEffect, useState } from 'react'
import { uid } from '../lib/format'
import { Finance } from '../api/resources'

/*
 * Finance store — backend is the single source of truth. No seed data and no
 * local fallback: empty stays empty so the dashboard reflects reality (and
 * analytics aren't polluted by mock records). Mutations update React state
 * optimistically, write through to the API, and reconcile the server-assigned
 * id on create so later edits / deletes hit the real document.
 */
export function useFinance() {
  const [tx, setTx] = useState([])
  const [contribs, setContribs] = useState([])
  const [budgetItems, setBudgetItems] = useState([])

  useEffect(() => {
    let alive = true
    Finance.state().then((s) => {
      if (!alive || !s) return
      setTx(Array.isArray(s.tx) ? s.tx : [])
      setContribs(Array.isArray(s.contribs) ? s.contribs : [])
      setBudgetItems(Array.isArray(s.budgetItems) ? s.budgetItems : [])
    }).catch(() => { /* leave empty on error */ })
    return () => { alive = false }
  }, [])

  /* ----------------------------------------------------------- transactions */
  const saveTx = useCallback(async (rec) => {
    const editing = !!rec.id
    const localId = rec.id || uid()
    const full = { ...rec, id: localId }
    setTx((cur) => (editing ? cur.map((t) => (t.id === localId ? full : t)) : cur.concat([full])))
    try {
      if (editing) await Finance.updateTx(localId, full)
      else {
        const saved = await Finance.addTx(full)
        const sid = saved && (saved.id || saved._id)
        if (sid && sid !== localId) setTx((cur) => cur.map((t) => (t.id === localId ? { ...t, id: sid } : t)))
      }
    } catch {}
  }, [])

  const removeTx = useCallback((id) => {
    setTx((cur) => cur.filter((t) => t.id !== id))
    Finance.removeTx(id).catch(() => {})
  }, [])

  /* --------------------------------------------------------- contributions */
  const saveContrib = useCallback(async (rec) => {
    const editing = !!rec.id
    const localId = rec.id || uid()
    const full = { ...rec, id: localId }
    setContribs((cur) => (editing ? cur.map((c) => (c.id === localId ? full : c)) : cur.concat([full])))
    try {
      if (editing) await Finance.updateContrib(localId, full)
      else {
        const saved = await Finance.saveContrib(full)
        const sid = saved && (saved.id || saved._id)
        if (sid && sid !== localId) setContribs((cur) => cur.map((c) => (c.id === localId ? { ...c, id: sid } : c)))
      }
    } catch {}
  }, [])

  const removeContrib = useCallback((id) => {
    setContribs((cur) => cur.filter((c) => c.id !== id))
    Finance.removeContrib(id).catch(() => {})
  }, [])

  /* ----------------------------------------------------------- budget items */
  const saveBudgetItem = useCallback(async (rec) => {
    const editing = !!rec.id
    const localId = rec.id || uid()
    const full = { spent: 0, ...rec, id: localId }
    setBudgetItems((cur) => (editing ? cur.map((x) => (x.id === localId ? full : x)) : cur.concat([full])))
    try {
      if (editing) await Finance.updateBudgetItem(localId, full)
      else {
        const saved = await Finance.addBudgetItem(full)
        const sid = saved && (saved.id || saved._id)
        if (sid && sid !== localId) setBudgetItems((cur) => cur.map((x) => (x.id === localId ? { ...x, id: sid } : x)))
      }
    } catch {}
  }, [])

  const updateItemSpent = useCallback((id, val) => {
    const amt = parseFloat(String(val == null ? '' : val).replace(/[^0-9.]/g, '')) || 0
    let updated = null
    setBudgetItems((cur) => cur.map((x) => (x.id === id ? (updated = { ...x, spent: amt }) : x)))
    if (updated) Finance.updateBudgetItem(id, updated).catch(() => {})
  }, [])

  const removeBudgetItem = useCallback((id) => {
    setBudgetItems((cur) => cur.filter((x) => x.id !== id))
    Finance.removeBudgetItem(id).catch(() => {})
  }, [])

  return { tx, contribs, budgetItems, saveTx, removeTx, saveContrib, removeContrib, saveBudgetItem, updateItemSpent, removeBudgetItem }
}
