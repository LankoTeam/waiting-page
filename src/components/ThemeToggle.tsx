'use client'

import { useState, useEffect } from 'react'
import { Button, Box } from '@chakra-ui/react'
import { useColorMode } from '@/components/ui/color-mode'

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        aria-label="主题切换"
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
        <Box fontSize="20px">🌙</Box>
      </Button>
    )
  }

  return (
    <Button
      aria-label={colorMode === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
      onClick={toggleColorMode}
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
        {colorMode === 'dark' ? '☀️' : '🌙'}
      </Box>
    </Button>
  )
}
