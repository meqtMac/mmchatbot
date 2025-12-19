import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Code2, Eye } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { extractSvg, normalizeSvg } from '@/utils/svg'

interface SvgDisplayProps {
  /** SVG content to display */
  svgContent: string
}

/**
 * SVG Display Component
 * Displays SVG with toggle between code view (syntax highlighted) and rendered view
 * Automatically normalizes SVG to use viewBox instead of width/height for scalability
 */
export function SvgDisplay({ svgContent }: SvgDisplayProps) {
  const [viewMode, setViewMode] = useState<'code' | 'render'>('render')

  // Extract and normalize SVG
  const rawSvg = extractSvg(svgContent)
  if (!rawSvg) return null

  const normalizedSvg = normalizeSvg(rawSvg)

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* Toggle buttons */}
      <div className="flex gap-2 p-2 border-b border-border bg-muted/50">
        <Button
          variant={viewMode === 'render' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('render')}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          Render
        </Button>
        <Button
          variant={viewMode === 'code' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('code')}
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
              {normalizedSvg}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}

