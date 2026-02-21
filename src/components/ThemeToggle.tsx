import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { getTheme, toggleTheme, setTheme } from '../services/theme.service'

export function ThemeToggle() {
  const [theme, setThemeState] = useState(getTheme)

  useEffect(() => {
    setTheme(theme)
  }, [theme])

  function onToggleTheme() {
    const next = toggleTheme()
    setThemeState(next)
  }

  return (
    <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
