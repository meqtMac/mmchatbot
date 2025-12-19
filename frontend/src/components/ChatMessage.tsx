import { Message } from '@/types/chat'
import { format } from 'date-fns'
import { User, Bot } from 'lucide-react'

interface ChatMessageProps {
  /** Message data to display */
  message: Message
}

/**
 * Chat message component
 * Displays a single message with appropriate styling based on role
 * User messages appear on the right, assistant messages on the left
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary' : 'bg-secondary'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-primary-foreground" />
        ) : (
          <Bot className="w-5 h-5 text-secondary-foreground" />
        )}
      </div>
      {/* Message content */}
      <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-foreground'
        }`}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {/* Timestamp */}
        {message.timestamp && (
          <p className="text-xs text-muted-foreground mt-1">
            {format(message.timestamp, 'HH:mm')}
          </p>
        )}
      </div>
    </div>
  )
}

