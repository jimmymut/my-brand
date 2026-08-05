import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
  }, [])

  const bg = { error: '#E5577A', success: '#10B981', info: '#334155' }

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div style={{ position: 'fixed', right: 18, bottom: 18, zIndex: 3000, display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 380 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
            style={{ padding: '12px 15px', borderRadius: 12, fontSize: 13.5, fontWeight: 600, lineHeight: 1.4, color: '#fff', cursor: 'pointer', boxShadow: '0 12px 34px rgba(0,0,0,0.38)', background: bg[t.type] || bg.info, fontFamily: "'Manrope', sans-serif" }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
