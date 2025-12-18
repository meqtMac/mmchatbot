import { useState, useEffect } from 'react'
import { ApiKeyDialog } from '@/components/ApiKeyDialog'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChat } from '@/hooks/useChat'
import { useTheme } from '@/hooks/useTheme'
import { Trash2 } from 'lucide-react'

const API_KEY_STORAGE_KEY = 'deepseek_api_key'

function App() {
  const [apiKey, setApiKey] = useState<string>('')
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat(apiKey)
  useTheme() // 初始化主题

  useEffect(() => {
    // 从本地存储加载 API Key
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY)
    if (savedKey) {
      setApiKey(savedKey)
    }
  }, [])

  const handleSaveApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem(API_KEY_STORAGE_KEY, key)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-foreground flex-shrink-0">DeepSeek Chat</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearMessages}>
                <Trash2 className="w-4 h-4 mr-2" />
                清空对话
              </Button>
            )}
            <ThemeToggle />
            <ApiKeyDialog onSave={handleSaveApiKey} currentKey={apiKey} />
          </div>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-20">
              <p className="text-lg mb-2">开始对话</p>
              <p className="text-sm">输入消息开始与 DeepSeek 对话</p>
            </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-muted-foreground">正在思考...</div>
            </div>
          )}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput onSend={sendMessage} disabled={isLoading || !apiKey} />
    </div>
  )
}

export default App

