"use client"

import { ThemeProvider, useTheme } from "next-themes"

export function ColorModeProvider(props: React.PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props}>
      {props.children}
    </ThemeProvider>
  )
}

export function useColorMode() {
  const { theme, setTheme } = useTheme()
  
  return {
    colorMode: theme,
    setColorMode: setTheme,
    toggleColorMode: () => {
      setTheme(theme === "light" ? "dark" : "light")
    }
  }
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

export function LightMode({ children }: { children: React.ReactNode }) {
  return <div className="light">{children}</div>
}

export function DarkMode({ children }: { children: React.ReactNode }) {
  return <div className="dark">{children}</div>
}
