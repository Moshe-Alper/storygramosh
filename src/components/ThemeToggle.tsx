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
    <button className="nav-item theme-toggle-btn" onClick={onToggleTheme} aria-label="Toggle theme" type="button">
      {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      <span className="nav-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}
