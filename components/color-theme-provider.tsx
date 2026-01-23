"use client"

import * as React from "react"

type ColorTheme = "default" | "blue" | "green" | "rose" | "orange" | "violet" | "yellow"

interface ColorThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ColorTheme
  storageKey?: string
}

interface ColorThemeContextType {
  colorTheme: ColorTheme
  setColorTheme: (theme: ColorTheme) => void
}

const ColorThemeContext = React.createContext<ColorThemeContextType | undefined>(undefined)

export function ColorThemeProvider({
  children,
  defaultTheme = "default",
  storageKey = "color-theme",
}: ColorThemeProviderProps) {
  const [colorTheme, setColorThemeState] = React.useState<ColorTheme>(defaultTheme)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(storageKey) as ColorTheme | null
    if (stored) {
      setColorThemeState(stored)
    }
  }, [storageKey])

  React.useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    if (colorTheme === "default") {
      root.removeAttribute("data-theme")
    } else {
      root.setAttribute("data-theme", colorTheme)
    }
    localStorage.setItem(storageKey, colorTheme)
  }, [colorTheme, storageKey, mounted])

  const setColorTheme = React.useCallback((theme: ColorTheme) => {
    setColorThemeState(theme)
  }, [])

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const context = React.useContext(ColorThemeContext)
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider")
  }
  return context
}

export const colorThemes: { name: string; value: ColorTheme; color: string }[] = [
  { name: "Default", value: "default", color: "oklch(0.205 0 0)" },
  { name: "Blue", value: "blue", color: "oklch(0.488 0.243 264.376)" },
  { name: "Green", value: "green", color: "oklch(0.527 0.154 150.069)" },
  { name: "Rose", value: "rose", color: "oklch(0.645 0.246 16.439)" },
  { name: "Orange", value: "orange", color: "oklch(0.705 0.213 47.604)" },
  { name: "Violet", value: "violet", color: "oklch(0.627 0.265 303.9)" },
  { name: "Yellow", value: "yellow", color: "oklch(0.795 0.184 86.047)" },
]
