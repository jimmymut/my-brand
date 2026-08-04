import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const KEY = 'jmt_theme'

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => localStorage.getItem(KEY) || 'system')

  const setTheme = (t) => {
    localStorage.setItem(KEY, t)
    setThemeState(t)
  }

  // Keep <html> data-theme in sync so global selection / scrollbar colours track too.
  useEffect(() => {
    try { document.documentElement.setAttribute('data-theme', theme) } catch {}
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
