'use client'

import { useState, useEffect } from 'react'
import { Box, Input, Button, Alert } from '@chakra-ui/react'

// 声明全局TencentCaptcha类型
declare global {
  interface Window {
    TencentCaptcha: new (
      container: HTMLElement,
      appId: string,
      callback: (res: TencentCaptchaResponse) => void,
      options?: Record<string, unknown>
    ) => TencentCaptchaInstance;
  }
}

// 腾讯云验证码响应类型
interface TencentCaptchaResponse {
  ret: number;
  ticket: string;
  randstr: string;
  appid: string;
  bizState?: string;
}

// 腾讯云验证码实例类型
interface TencentCaptchaInstance {
  show: () => void;
  destroy: () => void;
}

export default function WaitingListForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [message, setMessage] = useState<{text: string, type: 'success'|'error'}|null>(null)
  const [captchaReady, setCaptchaReady] = useState(false)

  // 检查腾讯云验证码SDK是否加载完成
  useEffect(() => {
    const checkCaptchaReady = () => {
      if (typeof window !== 'undefined' && window.TencentCaptcha) {
        setCaptchaReady(true)
      } else {
        setTimeout(checkCaptchaReady, 100)
      }
    }
    checkCaptchaReady()
  }, [])

  // 简单的邮箱验证
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  // 提交表单到后端，包含验证码票据
  const submitWithCaptcha = async (ticket: string, randstr: string) => {
    setIsLoading(true)
    setIsError(false)
    setMessage(null)
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          ticket,
          randstr 
        }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 清除之前的错误状态
    setIsError(false)
    setMessage(null)
    
    // 检查邮箱是否为空
    if (!email.trim()) {
      setIsError(true)
      setMessage({
        text: '请输入邮箱地址',
        type: 'error'
      })
      return
    }
    
    // 验证邮箱格式
    if (!isValidEmail(email)) {
      setIsError(true)
      setMessage({
        text: '请输入有效的电子邮箱地址',
        type: 'error'
      })
      return
    }

    // 检查验证码SDK是否准备就绪
    if (!captchaReady || !window.TencentCaptcha) {
      setMessage({
        text: '验证码组件正在加载中，请稍后再试。',
        type: 'error'
      })
      return
    }
    
    // 初始化腾讯云验证码（快速接入方式）
    const captcha = new window.TencentCaptcha(
      document.body, // 挂载元素
      "189934257", // 您的CaptchaAppId
      function(res: TencentCaptchaResponse) {
        if (res.ret === 0) {
          // 验证成功，获取票据
          const { ticket, randstr } = res
          submitWithCaptcha(ticket, randstr)
        } else {
          // 验证失败或用户取消
          setMessage({
            text: '验证码验证失败，请重试。',
            type: 'error'
          })
        }
      },
      {} // 配置项
    )

    // 显示验证码
    captcha.show()
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
        
        {/* 只显示一个Alert，优先显示message，如果没有message则显示isError */}
        {(message || isError) && (
          <Alert.Root 
            status={message?.type || "error"}
            mt={3}
            borderRadius="md"
          >
            <Alert.Indicator />
            <Alert.Title fontSize="sm">
              {message?.text || "请输入有效的电子邮箱地址"}
            </Alert.Title>
          </Alert.Root>
        )}
      </Box>
    </Box>
  )
}
