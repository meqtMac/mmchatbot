/**
 * SVG utility functions
 * Functions for detecting, extracting, and normalizing SVG content
 */

/**
 * Check if content contains SVG markup
 * 
 * @param content - Text content to check
 * @returns True if content contains SVG tags
 */
export function isSvg(content: string): boolean {
  return /<svg[\s\S]*<\/svg>/i.test(content.trim())
}

/**
 * Extract SVG markup from content
 * 
 * @param content - Text content that may contain SVG
 * @returns Extracted SVG string or null if not found
 */
export function extractSvg(content: string): string | null {
  const svgMatch = content.match(/<svg[\s\S]*<\/svg>/i)
  return svgMatch ? svgMatch[0] : null
}

/**
 * Normalize SVG content
 * Removes width and height attributes, ensures viewBox is present
 * Makes SVG scalable and responsive
 * Adds preserveAspectRatio to allow scaling without modifying viewBox
 * 
 * @param svgContent - Raw SVG content string
 * @returns Normalized SVG string with viewBox and without width/height
 */
export function normalizeSvg(svgContent: string): string {
  // Extract SVG opening tag
  const svgTagMatch = svgContent.match(/<svg([^>]*)>/i)
  if (!svgTagMatch) return svgContent

  const attributes = svgTagMatch[1]
  const restOfContent = svgContent.substring(svgTagMatch[0].length)

  // Parse attributes into a map
  const attrMap: Record<string, string> = {}
  const attrRegex = /(\w+)=["']([^"']+)["']/g
  let match

  while ((match = attrRegex.exec(attributes)) !== null) {
    const [, key, value] = match
    attrMap[key.toLowerCase()] = value
  }

  // Remove width and height attributes (case-insensitive)
  delete attrMap.width
  delete attrMap.height

  // Ensure viewBox exists, add default if missing
  // Use default viewBox (1024x1024) for square canvas
  if (!attrMap.viewbox && !attrMap.viewBox) {
    attrMap.viewBox = '0 0 1024 1024'
  } else if (attrMap.viewbox && !attrMap.viewBox) {
    // Handle case-insensitive viewbox attribute
    attrMap.viewBox = attrMap.viewbox
    delete attrMap.viewbox
  }
  
  // Add preserveAspectRatio if not present to allow scaling
  // "xMidYMid meet" keeps aspect ratio and centers the content
  if (!attrMap.preserveaspectratio && !attrMap.preserveAspectRatio) {
    attrMap.preserveAspectRatio = 'xMidYMid meet'
  }

  // Reconstruct attributes string
  const newAttributes = Object.entries(attrMap)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  // Reconstruct normalized SVG
  return `<svg ${newAttributes}>${restOfContent}`
}

