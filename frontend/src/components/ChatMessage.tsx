import { Message } from '@/types/chat'
import { format } from 'date-fns'
import { User, Bot } from 'lucide-react'
import { SvgDisplay } from './SvgDisplay'

interface ChatMessageProps {
  /** Message data to display */
  message: Message
  /** Whether this message is currently being streamed */
  isStreaming?: boolean
}

/**
 * Check if content is SVG or contains SVG elements
 * Since we're in always-SVG mode, assistant messages should always be SVG
 */
function isSvgContent(content: string): boolean {
  const trimmed = content.trim()
  // Check for complete SVG tag
  if (trimmed.startsWith('<svg')) return true
  // Check for SVG elements (content might be missing opening tag due to prefix continuation)
  const svgElements = ['<circle', '<rect', '<polygon', '<path', '<line', '<polyline', '<ellipse', '<text', '<g', '<defs']
  return svgElements.some(el => trimmed.includes(el))
}

/**
 * Wrap SVG content with SVG tag if missing
 */
function ensureCompleteSvg(content: string): string {
  const trimmed = content.trim()
  // If already has SVG tag, return as is
  if (trimmed.startsWith('<svg')) return trimmed
  // Wrap with SVG tag if it contains SVG elements
  if (isSvgContent(content)) {
    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">${trimmed}</svg>`
  }
  return trimmed
}

/**
 * Chat message component
 * Displays a single message with appropriate styling based on role
 * User messages appear on the right, assistant messages on the left
 * All assistant messages are displayed as SVG (always SVG mode)
 */
export function ChatMessage({ message, isStreaming = false }: ChatMessageProps) {
  const isUser = message.role === 'user'
  // All assistant messages are SVG format (always SVG mode)
  const hasSvg = !isUser && isSvgContent(message.content)
  
  // Ensure complete SVG for display
  const displayContent = hasSvg ? ensureCompleteSvg(message.content) : message.content

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
          {hasSvg ? (
            // Display SVG with special component
            <SvgDisplay svgContent={displayContent} isStreaming={isStreaming} />
          ) : (
            // Regular text content
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
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

