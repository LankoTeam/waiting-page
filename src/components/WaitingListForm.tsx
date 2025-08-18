'use client'

import { useState } from 'react'
import { Box, Input, Button, Alert } from '@chakra-ui/react'

export default function WaitingListForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'}|null>(null)

  // 简单的邮箱验证
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证邮箱
    if (!isValidEmail(email)) {
      setIsError(true)
      return
    }
    
    setIsLoading(true)
    setIsError(false)
    setMessage(null)
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({
          text: data.message,
          type: 'success'
        })
        setEmail('')
      } else {
        setMessage({
          text: data.error,
          type: 'error'
        })
      }
    } catch {
      setMessage({
        text: '抱歉，提交过程中出现了问题，请稍后再试。',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      width="100%"
      maxWidth="500px"
      mx="auto"
    >
      <Box position="relative" mb={4}>
        <Box display="flex" height="54px" shadow="sm" borderRadius="6px">
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (isError) setIsError(false)
              if (message) setMessage(null)
            }}
            placeholder="请输入您的电子邮箱"
            bg="var(--card-background)"
            borderColor={isError ? 'var(--error-text)' : 'var(--border-color)'}
            _hover={{
              borderColor: isError ? 'var(--error-text)' : 'var(--hover-border)',
            }}
            _focus={{
              borderColor: 'var(--brand-primary)',
              boxShadow: '0 0 0 1px var(--brand-primary)',
              outline: 'none'
            }}
            color="var(--foreground)"
            _placeholder={{ color: 'var(--text-muted)' }}
            fontSize="md"
            height="54px"
            pr="120px"
            borderRadius="6px"
          />
          <Button
            type="submit"
            loading={isLoading}
            position="absolute"
            top="7px"
            right="7px"
            bottom="7px"
            bg="var(--brand-primary)"
            color="white"
            _hover={{ bg: "var(--brand-secondary)" }}
            _active={{ bg: "var(--brand-secondary)" }}
            _disabled={{ bg: "var(--text-muted)", cursor: "not-allowed" }}
            borderRadius="6px"
            px="30px"
            fontSize="md"
            fontWeight="500"
            disabled={isLoading}
          >
            {isLoading ? '提交中...' : '加入'}
          </Button>
        </Box>
        
        {isError && (
          <Alert.Root 
            status="error" 
            size="sm" 
            mt={2}
            borderRadius="md"
          >
            <Alert.Indicator />
            <Alert.Title fontSize="sm">
              请输入有效的电子邮箱地址
            </Alert.Title>
          </Alert.Root>
        )}
      </Box>
      
      {message && (
        <Alert.Root 
          status={message.type}
          mt={3}
          borderRadius="md"
        >
          <Alert.Indicator />
          <Alert.Title>
            {message.text}
          </Alert.Title>
        </Alert.Root>
      )}
    </Box>
  )
}
