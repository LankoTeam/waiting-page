'use client'

import { createContext, useState, useContext, useEffect } from 'react'

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {}
})

// 使用主题的hook
export const useTheme = () => useContext(ThemeContext)

// 提供者组件
export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // 检测系统偏好
    if (
      typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setTheme('dark')
    }
    
    // 加载保存的主题设置
    const savedTheme = localStorage?.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    setMounted(true)
  }, [])

  // 主题改变时更新document属性
  useEffect(() => {
    if (!mounted) return
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    
    localStorage?.setItem('theme', theme)
  }, [theme, mounted])

  // 避免SSR与客户端水合不匹配
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
