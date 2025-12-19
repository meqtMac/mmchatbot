import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Code2, Eye } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { extractSvg, normalizeSvg } from '@/utils/svg'

interface SvgDisplayProps {
  /** SVG content to display */
  svgContent: string
  /** Whether the SVG is currently being streamed */
  isStreaming?: boolean
}

/**
 * SVG Display Component
 * Displays SVG with toggle between code view (syntax highlighted) and rendered view
 * Automatically normalizes SVG to use viewBox instead of width/height for scalability
 * Shows code view during streaming (typewriter effect), automatically switches to render view when complete
 * Respects user's manual view selection and doesn't auto-switch if user has manually chosen code view
 */
export function SvgDisplay({ svgContent, isStreaming = false }: SvgDisplayProps) {
  // Start with code view during streaming, render view when complete
  const [viewMode, setViewMode] = useState<'code' | 'render'>(isStreaming ? 'code' : 'render')
  // Track if user has manually selected a view mode
  const userSelectedMode = useRef<boolean>(false)
  
  // Automatically switch to render view when streaming completes (only if user hasn't manually selected)
  useEffect(() => {
    if (!isStreaming && viewMode === 'code' && !userSelectedMode.current) {
      // Small delay to ensure SVG is complete before switching
      const timer = setTimeout(() => {
        setViewMode('render')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isStreaming, viewMode])
  
  // Update view mode when streaming starts (reset user selection)
  useEffect(() => {
    if (isStreaming) {
      setViewMode('code')
      userSelectedMode.current = false // Reset on new stream
    }
  }, [isStreaming])
  
  // Handle manual view mode selection
  const handleViewModeChange = (mode: 'code' | 'render') => {
    userSelectedMode.current = true
    setViewMode(mode)
  }

  // Extract and normalize SVG
  // During streaming, content might be incomplete (no closing tag yet)
  // So we need to handle incomplete SVG gracefully
  let rawSvg = extractSvg(svgContent)
  
  // If no complete SVG found but we're streaming, use content as-is
  // This allows displaying partial SVG during streaming (typewriter effect)
  if (!rawSvg) {
    if (isStreaming) {
      // During streaming, always show content even if incomplete
      // This enables typewriter effect - content appears as it streams
      const trimmed = svgContent.trim()
      if (trimmed.startsWith('<svg') || trimmed.length > 0) {
        rawSvg = svgContent // Use content as-is during streaming
      } else {
        // Even if empty, show placeholder during streaming
        rawSvg = '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">'
      }
    } else {
      // Not streaming and no complete SVG found
      return null
    }
  }

  // Normalize SVG (will handle incomplete SVG gracefully)
  // normalizeSvg can handle incomplete SVG (without closing tag)
  const normalizedSvg = normalizeSvg(rawSvg)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toggle buttons */}
      <div className="flex gap-2 p-2 border-b border-border bg-muted/50">
        <Button
          variant={viewMode === 'render' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('render')}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          Render
        </Button>
        <Button
          variant={viewMode === 'code' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewModeChange('code')}
          className="flex-1"
        >
          <Code2 className="w-4 h-4 mr-2" />
          Code
        </Button>
      </div>

      {/* Content area */}
      <div className="p-4">
        {viewMode === 'render' ? (
          // Rendered SVG view
          <div className="flex items-center justify-center bg-background rounded border border-border p-4">
            <div
              className="w-full max-w-full"
              dangerouslySetInnerHTML={{ __html: normalizedSvg }}
            />
          </div>
        ) : (
          // Code view with syntax highlighting
          // Show code even if SVG is incomplete (during streaming)
          <div className="rounded overflow-hidden max-w-full overflow-x-auto">
            <SyntaxHighlighter
              language="xml"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
                wordBreak: 'break-all',
              }}
            >
              {normalizedSvg || svgContent}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}

