'use client'

import { useState, useEffect } from 'react'
import { Button, Box } from '@chakra-ui/react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 检测系统偏好和加载保存的设置
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('chakra-ui-color-mode')
      if (savedTheme) {
        setIsDark(savedTheme === 'dark')
        document.documentElement.setAttribute('data-theme', savedTheme)
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDark(true)
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    }
  }, [])

  // 主题改变时更新文档属性和保存设置
  useEffect(() => {
    if (!mounted) return
    
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.documentElement.classList.add('chakra-ui-dark')
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.classList.remove('chakra-ui-dark')
        document.documentElement.setAttribute('data-theme', 'light')
      }
      localStorage.setItem('chakra-ui-color-mode', isDark ? 'dark' : 'light')
    }
  }, [isDark, mounted])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // 避免 SSR 水合不匹配
  if (!mounted) {
    return null
  }

  return (
    <Button
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
      onClick={toggleTheme}
      variant="ghost"
      size="md"
      position="fixed"
      top={4}
      right={4}
      zIndex={1000}
      borderRadius="full"
      boxShadow="md"
      width="40px"
      height="40px"
      minWidth="40px"
    >
      <Box fontSize="20px">
        {isDark ? '☀️' : '🌙'}
      </Box>
    </Button>
  )
}
