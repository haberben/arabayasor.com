'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useState<Theme>('light')

  useEffect(() => {
    // Sadece light sınıfını tut, dark'ı temizle
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
  }, [])

  const toggleTheme = () => {
    // Koyu mod tamamen deaktif
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

