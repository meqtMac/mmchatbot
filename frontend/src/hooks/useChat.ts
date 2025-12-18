import { useState, useCallback } from 'react'
import { Message } from '@/types/chat'
import { chatWithDeepSeek } from '@/utils/deepseek'

export function useChat(apiKey: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!apiKey) {
      setError('请先设置 API Key')
      return
    }

    setIsLoading(true)
    setError(null)

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // 创建助手消息占位符
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      // 准备消息历史
      const history = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // 流式接收响应
      let fullContent = ''
      for await (const chunk of chatWithDeepSeek(apiKey, history)) {
        fullContent += chunk
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            ...assistantMessage,
            content: fullContent,
          }
          return newMessages
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送消息失败')
      // 移除失败的助手消息
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [apiKey, messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}

