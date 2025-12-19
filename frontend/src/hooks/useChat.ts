import { useState, useCallback } from 'react'
import { Message } from '@/types/chat'
import { chatWithDeepSeek } from '@/utils/deepseek'

/**
 * Custom hook for managing chat functionality
 * Handles message state, streaming responses, and error management
 * 
 * @param apiKey - DeepSeek API key for authentication
 * @returns Object containing messages, loading state, error, and control functions
 */
export function useChat(apiKey: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Send a message to DeepSeek API and stream the response
   * Creates a typing effect by updating the assistant message incrementally
   * 
   * @param content - User message content
   */
  const sendMessage = useCallback(async (content: string) => {
    // Validate API key
    if (!apiKey) {
      setError('Please set API Key first')
      return
    }

    setIsLoading(true)
    setError(null)

    // Add user message to the conversation
    const userMessage: Message = {
      role: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Create placeholder for assistant message (will be updated incrementally)
    const assistantMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMessage])

    try {
      // Prepare message history for API (without timestamps)
      const history = [...messages, userMessage].map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      // Stream response and update UI incrementally
      let fullContent = ''
      for await (const chunk of chatWithDeepSeek(apiKey, history)) {
        fullContent += chunk
        // Update the last message (assistant message) with accumulated content
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
      setError(err instanceof Error ? err.message : 'Failed to send message')
      // Remove failed assistant message placeholder
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [apiKey, messages])

  /**
   * Clear all messages and reset error state
   */
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

