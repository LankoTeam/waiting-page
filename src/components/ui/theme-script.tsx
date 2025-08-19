"use client"

import { useEffect } from "react"

export function ThemeScript() {
  useEffect(() => {
    try {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch {
      // 忽略localStorage访问错误
    }
  }, [])

  return null
}
