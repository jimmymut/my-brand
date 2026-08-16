import { useCallback, useEffect, useRef, useState } from 'react'
import { uid } from '../lib/format'
import { Finance } from '../api/resources'
import { useToast } from '../components/Toast'

/*
 * Finance store — backend is the single source of truth.
 *
 * Modal-driven writes (add/edit a transaction, contribution, budget item) are
 * CONFIRM-FIRST: we await the backend and only then put the returned record into
 * state, so nothing ever appears in the UI unless it was actually saved. On
 * failure the call throws (the caller keeps the modal open) after a toast.
 *
 * Quick inline actions (typing "spent", drag-reorder, delete) stay optimistic
 * for responsiveness, and re-sync from the backend if the write fails.
 */
export function useFinance() {
  const toast = useToast()
  const [tx, setTx] = useState([])
  const [contribs, setContribs] = useState([])
  const [budgetItems, setBudgetItems] = useState([])
  const [goals, setGoals] = useState([])
  const [accounts, setAccounts] = useState([])
  const itemsRef = useRef([])
  useEffect(() => { itemsRef.current = budgetItems }, [budgetItems])

  const hydrate = useCallback((s) => {
    if (!s) return
    if (Array.isArray(s.tx)) setTx(s.tx)
    if (Array.isArray(s.contribs)) setContribs(s.contribs)
    if (Array.isArray(s.budgetItems)) setBudgetItems(s.budgetItems)
    if (Array.isArray(s.goals)) setGoals(s.goals)
    if (Array.isArray(s.accounts)) setAccounts(s.accounts)
  }, [])
  const resync = useCallback(() => { Finance.state().then(hydrate).catch(() => {}) }, [hydrate])

  // toast + resync for optimistic (inline) failures; 401 is handled globally
  const failed = useCallback((what, e) => {
    if (!(e && e.status === 401)) toast(`Couldn't save your ${what}. Nothing was recorded — please try again.`, 'error')
    resync()
  }, [toast, resync])

  // toast for confirm-first (modal) failures; caller re-throws to keep modal open
  const writeError = useCallback((what, e) => {
    if (!(e && e.status === 401)) toast(`Couldn't save your ${what}. Please check your connection and try again.`, 'error')
  }, [toast])

  useEffect(() => {
    let alive = true
    Finance.state().then((s) => { if (alive) hydrate(s) }).catch(() => {})
    return () => { alive = false }
  }, [hydrate])

  const docId = (saved) => saved && (saved.id || saved._id)

  /* ------------------------------------------- transactions (confirm-first) */
  const saveTx = useCallback(async (rec) => {
    try {
      if (rec.id) {
        await Finance.updateTx(rec.id, rec)
        setTx((cur) => cur.map((t) => (t.id === rec.id ? { ...t, ...rec } : t)))
      } else {
        const saved = await Finance.addTx(rec)
        setTx((cur) => cur.concat([docId(saved) ? saved : { ...rec, id: uid() }]))
      }
    } catch (e) { writeError('transaction', e); throw e }
  }, [writeError])

  const removeTx = useCallback(async (id) => {
    try { await Finance.removeTx(id); setTx((cur) => cur.filter((t) => t.id !== id)) }
    catch (e) { writeError('change', e) }
  }, [writeError])

  /* ----------------------------------------- contributions (confirm-first) */
  const saveContrib = useCallback(async (rec) => {
    try {
      if (rec.id) {
        await Finance.updateContrib(rec.id, rec)
        setContribs((cur) => cur.map((c) => (c.id === rec.id ? { ...c, ...rec } : c)))
      } else {
        const saved = await Finance.saveContrib(rec)
        setContribs((cur) => cur.concat([docId(saved) ? saved : { ...rec, id: uid() }]))
      }
    } catch (e) { writeError('contribution', e); throw e }
  }, [writeError])

  const removeContrib = useCallback(async (id) => {
    try { await Finance.removeContrib(id); setContribs((cur) => cur.filter((c) => c.id !== id)) }
    catch (e) { writeError('change', e) }
  }, [writeError])

  /* ----------------------------------------- budget items (confirm-first) */
  const saveBudgetItem = useCallback(async (rec) => {
    const editing = !!rec.id
    const existing = editing ? itemsRef.current.find((x) => x.id === rec.id) : null
    const order = rec.order != null ? rec.order : existing ? (existing.order || 0) : (itemsRef.current.reduce((m, x) => Math.max(m, x.order || 0), -1) + 1)
    const payload = { spent: 0, priority: 'low', ...rec, order }
    try {
      if (editing) {
        await Finance.updateBudgetItem(rec.id, payload)
        setBudgetItems((cur) => cur.map((x) => (x.id === rec.id ? { ...x, ...payload } : x)))
      } else {
        const saved = await Finance.addBudgetItem(payload)
        setBudgetItems((cur) => cur.concat([docId(saved) ? saved : { ...payload, id: uid() }]))
      }
    } catch (e) { writeError('budget item', e); throw e }
  }, [writeError])

  // inline: drag-to-reorder (optimistic)
  const reorderBudgetItems = useCallback((orderedIds) => {
    setBudgetItems((cur) => {
      const byId = new Map(cur.map((x) => [x.id, x]))
      const reordered = orderedIds.map((id, i) => (byId.has(id) ? { ...byId.get(id), order: i } : null)).filter(Boolean)
      const extras = cur.filter((x) => !orderedIds.includes(x.id))
      return reordered.concat(extras)
    })
    Finance.reorderBudgetItems(orderedIds).catch((e) => failed('new order', e))
  }, [failed])

  // inline: editing the "spent" cell (optimistic)
  const updateItemSpent = useCallback((id, val) => {
    const amt = parseFloat(String(val == null ? '' : val).replace(/[^0-9.]/g, '')) || 0
    let updated = null
    setBudgetItems((cur) => cur.map((x) => (x.id === id ? (updated = { ...x, spent: amt }) : x)))
    if (updated) Finance.updateBudgetItem(id, updated).catch((e) => failed('budget item', e))
  }, [failed])

  const removeBudgetItem = useCallback(async (id) => {
    try { await Finance.removeBudgetItem(id); setBudgetItems((cur) => cur.filter((x) => x.id !== id)) }
    catch (e) { writeError('change', e) }
  }, [writeError])

  // clone the given plan items into a month (spent reset); confirm-first
  const copyBudget = useCallback(async (itemIds, toMonth) => {
    try {
      const created = await Finance.copyBudget(itemIds, toMonth)
      if (Array.isArray(created) && created.length) setBudgetItems((cur) => cur.concat(created))
      return Array.isArray(created) ? created : []
    } catch (e) { writeError('budget copy', e); throw e }
  }, [writeError])

  /* ------------------------------------------------ savings goals (confirm-first) */
  const saveGoal = useCallback(async (rec) => {
    try {
      if (rec.id) {
        await Finance.updateGoal(rec.id, rec)
        setGoals((cur) => cur.map((g) => (g.id === rec.id ? { ...g, ...rec } : g)))
      } else {
        const saved = await Finance.addGoal(rec)
        setGoals((cur) => cur.concat([saved && (saved.id || saved._id) ? saved : { ...rec, id: uid() }]))
      }
    } catch (e) { writeError('goal', e); throw e }
  }, [writeError])

  const removeGoal = useCallback(async (id) => {
    try {
      await Finance.removeGoal(id)
      setGoals((cur) => cur.filter((g) => g.id !== id))
      setContribs((cur) => cur.filter((c) => c.bucket !== id)) // its contributions are removed too
    } catch (e) { writeError('change', e) }
  }, [writeError])

  /* ---------------------------------------------- accounts (confirm-first) */
  const saveAccount = useCallback(async (rec) => {
    try {
      if (rec.id) {
        await Finance.updateAccount(rec.id, rec)
        setAccounts((cur) => cur.map((a) => (a.id === rec.id ? { ...a, ...rec } : a)))
        resync() // a rename cascades to tx/contribs/goals — pull the fresh state
      } else {
        const saved = await Finance.addAccount(rec)
        setAccounts((cur) => cur.concat([docId(saved) ? saved : { ...rec, id: uid() }]))
      }
    } catch (e) { writeError('account', e); throw e }
  }, [writeError, resync])

  const removeAccount = useCallback(async (id) => {
    try { await Finance.removeAccount(id); setAccounts((cur) => cur.filter((a) => a.id !== id)) }
    catch (e) { writeError('change', e) }
  }, [writeError])

  return { tx, contribs, budgetItems, goals, accounts, saveTx, removeTx, saveContrib, removeContrib, saveBudgetItem, reorderBudgetItems, updateItemSpent, removeBudgetItem, copyBudget, saveGoal, removeGoal, saveAccount, removeAccount }
}
