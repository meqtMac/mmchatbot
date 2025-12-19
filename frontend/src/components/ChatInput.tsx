import { useState, KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'

interface ChatInputProps {
  /** Callback function when message is sent */
  onSend: (message: string) => void
  /** Whether the input is disabled */
  disabled?: boolean
}

/**
 * Chat input component
 * Provides a textarea for message input with send button
 * Supports Enter to send, Shift+Enter for new line
 */
export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('')

  /**
   * Handle send button click
   * Sends the message if input is not empty and not disabled
   */
  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim())
      setInput('')
    }
  }

  /**
   * Handle keyboard events
   * Enter: send message
   * Shift+Enter: new line
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border p-4 bg-card">
      <div className="flex gap-2 max-w-4xl mx-auto">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (Shift+Enter 换行)"
          className="min-h-[60px] resize-none"
          disabled={disabled}
        />
        <Button 
          onClick={handleSend} 
          disabled={disabled || !input.trim()}
          size="icon"
          className="h-[60px] w-[60px]"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

