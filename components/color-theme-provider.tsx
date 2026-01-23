"use client"

import * as React from "react"

type ColorTheme = "default" | "amber" | "blue" | "cyan" | "emerald" | "fuchsia" | "green" | "indigo" | "lime" | "orange" | "pink" | "purple" | "red" | "rose" | "violet" | "yellow"

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
  { name: "Amber", value: "amber", color: "oklch(0.769 0.188 70.08)" },
  { name: "Blue", value: "blue", color: "oklch(0.488 0.243 264.376)" },
  { name: "Cyan", value: "cyan", color: "oklch(0.6 0.118 184.704)" },
  { name: "Emerald", value: "emerald", color: "oklch(0.546 0.245 262.881)" },
  { name: "Fuchsia", value: "fuchsia", color: "oklch(0.627 0.265 303.9)" },
  { name: "Green", value: "green", color: "oklch(0.527 0.154 150.069)" },
  { name: "Indigo", value: "indigo", color: "oklch(0.488 0.243 264.376)" },
  { name: "Lime", value: "lime", color: "oklch(0.769 0.188 70.08)" },
  { name: "Orange", value: "orange", color: "oklch(0.705 0.213 47.604)" },
  { name: "Pink", value: "pink", color: "oklch(0.645 0.246 16.439)" },
  { name: "Purple", value: "purple", color: "oklch(0.627 0.265 303.9)" },
  { name: "Red", value: "red", color: "oklch(0.577 0.245 27.325)" },
  { name: "Rose", value: "rose", color: "oklch(0.645 0.246 16.439)" },
  { name: "Violet", value: "violet", color: "oklch(0.627 0.265 303.9)" },
  { name: "Yellow", value: "yellow", color: "oklch(0.795 0.184 86.047)" },
]
