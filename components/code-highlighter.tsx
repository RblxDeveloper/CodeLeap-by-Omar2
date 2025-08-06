'use client'

import { useEffect, useState } from 'react'

interface CodeHighlighterProps {
  code: string
  language: string
}

export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  const [formattedCode, setFormattedCode] = useState('')

  useEffect(() => {
    const formatCode = (code: string, lang: string) => {
      if (lang === 'html') {
        return formatHTML(code)
      } else if (lang === 'css') {
        return formatCSS(code)
      } else if (lang === 'javascript') {
        return formatJavaScript(code)
      }
      return code
    }

    setFormattedCode(formatCode(code, language))
  }, [code, language])

const formatHTML = (html: string) => {
  if (!html || html.trim().length === 0) return html
  
  let formatted = ''
  let indent = 0
  const indentSize = 2
  
  // Don't over-clean the HTML - preserve some structure
  let cleanHtml = html.trim()
  
  // Split by tags while preserving content
  const parts = cleanHtml.split(/(<[^>]*>)/).filter(part => part.length > 0)
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    if (!part) continue
    
    if (part.startsWith('</')) {
      // Closing tag - decrease indent first
      indent = Math.max(0, indent - indentSize)
      formatted += ' '.repeat(indent) + part + '\n'
    } else if (part.startsWith('<')) {
      // Opening tag
      const tagMatch = part.match(/<(\w+)/)
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : ''
      
      // Self-closing tags and void elements
      const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
      const isSelfClosing = part.endsWith('/>') || voidElements.includes(tagName)
      
      formatted += ' '.repeat(indent) + part + '\n'
      
      if (!isSelfClosing) {
        indent += indentSize
      }
    } else {
      // Text content - trim but preserve
      const trimmedPart = part.trim()
      if (trimmedPart.length > 0) {
        formatted += ' '.repeat(indent) + trimmedPart + '\n'
      }
    }
  }
  
  return formatted.trim()
}

  const formatCSS = (css: string) => {
    if (!css || css.trim().length === 0) return css
    
    let formatted = ''
    let indent = 0
    const indentSize = 2
    
    let cleanCss = css
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n')
      .trim()
    
    const lines = cleanCss.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      
      if (trimmed === '}') {
        indent = Math.max(0, indent - indentSize)
        formatted += ' '.repeat(indent) + trimmed + '\n'
      } else if (trimmed.endsWith('{')) {
        formatted += ' '.repeat(indent) + trimmed + '\n'
        indent += indentSize
      } else {
        formatted += ' '.repeat(indent) + trimmed + '\n'
      }
    }
    
    return formatted.trim()
  }

const formatJavaScript = (js: string) => {
  if (!js || js.trim().length === 0) return js
  
  let formatted = ''
  let indent = 0
  const indentSize = 2
  
  const lines = js.split('\n')
  
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      formatted += '\n'
      continue
    }
    
    // Decrease indent for closing braces
    if (trimmed.startsWith('}')) {
      indent = Math.max(0, indent - indentSize)
    }
    
    formatted += ' '.repeat(indent) + trimmed + '\n'
    
    // Increase indent after opening braces
    if (trimmed.endsWith('{')) {
      indent += indentSize
    }
  }
  
  return formatted.trim()
}

  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

const lines = formattedCode.split('\n')

return (
  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
        {language}
      </span>
    </div>
    <div className="p-0">
      <div className="font-mono text-sm">
        {lines.map((line, index) => (
          <div key={index} className="flex hover:bg-gray-100 dark:hover:bg-gray-800">
            <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 text-right min-w-[3rem] border-r border-gray-200 dark:border-gray-700 select-none">
              {index + 1}
            </div>
            <div className="flex-1 px-4 py-1 overflow-x-auto">
              <code 
                className="whitespace-pre text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: line || '&nbsp;' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)
}
