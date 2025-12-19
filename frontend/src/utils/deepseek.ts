/**
 * DeepSeek API message interface
 * Represents a message in the format expected by DeepSeek API
 */
export interface DeepSeekMessage {
  /** Message role: user, assistant, or system */
  role: 'user' | 'assistant' | 'system'
  /** Message content */
  content: string
  /** Prefix mode for continuation (Beta feature) */
  prefix?: boolean
}

/**
 * Stream chat with DeepSeek API
 * 
 * This function uses an async generator to stream responses from DeepSeek API.
 * It processes Server-Sent Events (SSE) format and yields content chunks as they arrive.
 * 
 * Uses DeepSeek Beta API with prefix continuation to always return SVG format.
 * Automatically appends SVG prefix to force SVG output regardless of user input.
 * 
 * @param apiKey - DeepSeek API key for authentication
 * @param messages - Array of conversation messages
 * @returns Async generator that yields content chunks (strings)
 * 
 * @example
 * for await (const chunk of chatWithDeepSeek(apiKey, messages)) {
 *   console.log(chunk) // Process each chunk
 * }
 */
export async function* chatWithDeepSeek(
  apiKey: string,
  messages: DeepSeekMessage[]
): AsyncGenerator<string, void, unknown> {
  // Prepare messages with SVG prefix for continuation mode
  const apiMessages: DeepSeekMessage[] = [...messages]
  
  // Add assistant message with SVG prefix for continuation
  // This forces the model to always output SVG format
  // Use default viewBox (1024x1024) for square canvas
  apiMessages.push({
    role: 'assistant',
    content: '<svg viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">',
    prefix: true
  })
  
  // Use Beta API endpoint for prefix continuation feature
  const response = await fetch('https://api.deepseek.com/beta/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: apiMessages,
      stream: true, // Enable streaming response
      temperature: 0.7,
      stop: ['</svg>'], // Stop when SVG tag closes
    }),
  })

  // Handle API errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(error.error?.message || `HTTP error! status: ${response.status}`)
  }

  // Get ReadableStream reader
  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error('No response body')
  }

  const decoder = new TextDecoder()
  let buffer = '' // Buffer for incomplete lines

  try {
    // Read stream chunks
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      // Decode bytes to text and add to buffer
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      // Keep incomplete line in buffer for next iteration
      buffer = lines.pop() || ''

      // Process complete lines
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6) // Remove 'data: ' prefix
          if (data === '[DONE]') {
            return // Stream finished
          }
          try {
            // Parse SSE JSON data
            const json = JSON.parse(data)
            const content = json.choices?.[0]?.delta?.content
            if (content) {
              yield content // Yield content chunk
            }
          } catch (e) {
            // Ignore parsing errors for malformed data
          }
        }
      }
    }
  } finally {
    // Always release the reader lock
    reader.releaseLock()
  }
}

