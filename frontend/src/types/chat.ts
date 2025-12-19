/**
 * Chat message interface
 * Represents a single message in the conversation
 */
export interface Message {
  /** Message role: user or AI assistant */
  role: 'user' | 'assistant'
  /** Message content */
  content: string
  /** Message timestamp (optional) */
  timestamp?: Date
  /** Whether the message is currently being streamed (optional) */
  isStreaming?: boolean
}

/**
 * Chat state interface
 * Used to manage the entire conversation state
 */
export interface ChatState {
  /** List of messages */
  messages: Message[]
  /** Whether a request is currently loading */
  isLoading: boolean
  /** Error message (if any) */
  error: string | null
}

