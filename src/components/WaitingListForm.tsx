'use client'

import { useState } from 'react'
import styles from '@/components/WaitingListForm.module.css'

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
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (isError) setIsError(false)
            if (message) setMessage(null)
          }}
          placeholder="请输入您的电子邮箱"
          required
          className={`${styles.input} ${isError ? styles.inputError : ''}`}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? '提交中...' : '加入'}
        </button>
      </div>
      
      {isError && (
        <div className={styles.errorMessage}>
          请输入有效的电子邮箱地址
        </div>
      )}
      
      {message && (
        <div className={`${styles.message} ${message.type === 'success' ? styles.successMessage : styles.errorMessageBox}`}>
          {message.text}
        </div>
      )}
    </form>
  )
}
