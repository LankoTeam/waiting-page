'use client'

import { useEffect, useState } from 'react'

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

interface CaptchaPreloaderProps {
  onCaptchaReady: () => void
}

export default function CaptchaPreloader({ onCaptchaReady }: CaptchaPreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 10
    const retryInterval = 200

    const checkCaptchaReady = () => {
      try {
        // 检查TCaptcha SDK是否已加载
        if (typeof window !== 'undefined' && window.TencentCaptcha) {
          console.log('TCaptcha SDK已加载完成，可以开始使用')
          onCaptchaReady()
          setIsLoading(false)
        } else if (retryCount < maxRetries) {
          // 如果SDK还没加载，等待后重试
          retryCount++
          console.log(`TCaptcha SDK未加载，等待重试 (${retryCount}/${maxRetries})...`)
          setTimeout(checkCaptchaReady, retryInterval)
        } else {
          // 超过最大重试次数
          const errorMsg = 'TCaptcha SDK加载超时，请刷新页面重试'
          console.error(errorMsg)
          setError(errorMsg)
          setIsLoading(false)
        }
      } catch (err) {
        const errorMsg = `验证码SDK检查失败: ${err instanceof Error ? err.message : '未知错误'}`
        console.error(errorMsg)
        setError(errorMsg)
        setIsLoading(false)
      }
    }

    // 开始检查
    checkCaptchaReady()

    // 清理函数
    return () => {
      // 组件卸载时的清理逻辑
    }
  }, [onCaptchaReady])

  // 这个组件不需要渲染任何UI，只是预加载验证码SDK
  return null
}
