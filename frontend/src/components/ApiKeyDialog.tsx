import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import * as Dialog from '@radix-ui/react-dialog'

interface ApiKeyDialogProps {
  onSave: (apiKey: string) => void
  currentKey?: string
}

export function ApiKeyDialog({ onSave, currentKey }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState(currentKey || '')
  const [open, setOpen] = useState(!currentKey)

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim())
      setOpen(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          设置 API Key
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-card border border-border p-6 shadow-lg w-[90vw] max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-4 text-foreground">
            输入 DeepSeek API Key
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted-foreground mb-4">
            请输入您的 DeepSeek API Key。API Key 将保存在浏览器本地存储中。
          </Dialog.Description>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline">取消</Button>
            </Dialog.Close>
            <Button onClick={handleSave}>保存</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

