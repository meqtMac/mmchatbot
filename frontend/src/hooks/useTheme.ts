import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme'

/**
 * Custom hook for managing theme (light/dark mode)
 * Persists theme preference to localStorage and applies it to the document
 * 
 * @returns Object containing current theme, toggle function, and setter
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Read from localStorage or use system preference
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (saved) return saved
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    // Apply theme class to root element
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    // Persist theme preference
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme, setTheme }
}

