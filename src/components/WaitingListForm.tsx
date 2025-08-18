'use client'

import { useState } from 'react'
import { Box, Input, Button } from '@chakra-ui/react'

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
    
    // 模拟API调用
    try {
      // 这里将来可以替换为真实的API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 成功提交
      setMessage({
        text: '感谢您的订阅，我们会在LANKO蓝扣上线时通知您。',
        type: 'success'
      })
      
      setEmail('')
    } catch (error) {
      // 提交失败
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
          <Box color="var(--error-text)" fontSize="sm" mt={1}>
            请输入有效的电子邮箱地址
          </Box>
        )}
      </Box>
      
      {message && (
        <Box 
          p={3}
          borderRadius="md"
          mt={3}
          bg={message.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)'}
          borderColor={message.type === 'success' ? 'var(--success-text)' : 'var(--error-text)'}
          borderWidth="1px"
          color={message.type === 'success' ? 'var(--success-text)' : 'var(--error-text)'}
        >
          {message.text}
        </Box>
      )}
    </Box>
  )
}
