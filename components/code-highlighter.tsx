'use client'

import { useEffect, useState } from 'react'

interface CodeHighlighterProps {
  code: string
  language: string
}

export function CodeHighlighter({ code, language }: CodeHighlighterProps) {
  const [formattedCode, setFormattedCode] = useState('')

  const decodeHtmlEntities = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
  }

  const removeComments = (code: string, lang: string) => {
    if (lang === 'javascript') {
      return code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/^\s*[\r\n]/gm, '')
    } else if (lang === 'css') {
      return code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*[\r\n]/gm, '')
    } else if (lang === 'html') {
      return code
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/^\s*[\r\n]/gm, '')
    }
    return code
  }

  useEffect(() => {
    const formatCode = (code: string, lang: string) => {
      let decodedCode = decodeHtmlEntities(code)
      decodedCode = removeComments(decodedCode, lang)
      
      if (lang === 'html') {
        return formatHTML(decodedCode)
      } else if (lang === 'css') {
        return formatCSS(decodedCode)
      } else if (lang === 'javascript') {
        return formatJavaScript(decodedCode)
      }
      return decodedCode
    }

    setFormattedCode(formatCode(code, language))
  }, [code, language])

  const formatHTML = (html: string) => {
    if (!html || html.trim().length === 0) return html
    
    let formatted = ''
    let indent = 0
    const indentSize = 2
    
    const cleanHtml = html
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim()
    
    const tokens = cleanHtml.split(/(<[^>]*>)/).filter(token => token.length > 0)
    
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i].trim()
      if (!token) continue
      
      if (token.startsWith('</')) {
        indent = Math.max(0, indent - indentSize)
        formatted += ' '.repeat(indent) + token
        if (i < tokens.length - 1) formatted += '\n'
      } else if (token.startsWith('<')) {
        const tagMatch = token.match(/<(\w+)/)
        const tagName = tagMatch ? tagMatch[1].toLowerCase() : ''
        const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
        const isSelfClosing = token.endsWith('/>') || voidElements.includes(tagName)
        
        formatted += ' '.repeat(indent) + token
        if (i < tokens.length - 1) formatted += '\n'
        
        if (!isSelfClosing) {
          indent += indentSize
        }
      } else {
        formatted += ' '.repeat(indent) + token
        if (i < tokens.length - 1) formatted += '\n'
      }
    }
    
    return formatted
  }

  const formatCSS = (css: string) => {
    if (!css || css.trim().length === 0) return css
    
    let formatted = ''
    let indent = 0
    const indentSize = 2
    
    const cleanCss = css
      .replace(/\s*{\s*/g, ' {\n')
      .replace(/;\s*/g, ';\n')
      .replace(/\s*}\s*/g, '\n}\n')
      .replace(/\n\s*\n/g, '\n')
      .trim()
    
    const lines = cleanCss.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      if (line === '}') {
        indent = Math.max(0, indent - indentSize)
        formatted += ' '.repeat(indent) + line
        if (i < lines.length - 1) formatted += '\n'
      } else if (line.endsWith('{')) {
        formatted += ' '.repeat(indent) + line
        if (i < lines.length - 1) formatted += '\n'
        indent += indentSize
      } else {
        formatted += ' '.repeat(indent) + line
        if (i < lines.length - 1) formatted += '\n'
      }
    }
    
    return formatted
  }

  const formatJavaScript = (js: string) => {
    if (!js || js.trim().length === 0) return js
    
    let formatted = ''
    let indent = 0
    const indentSize = 2
    
    const lines = js.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) {
        if (i < lines.length - 1) formatted += '\n'
        continue
      }
      
      if (line.startsWith('}')) {
        indent = Math.max(0, indent - indentSize)
      }
      
      formatted += ' '.repeat(indent) + line
      if (i < lines.length - 1) formatted += '\n'
      
      if (line.endsWith('{')) {
        indent += indentSize
      }
    }
    
    return formatted
  }

  const lines = formattedCode.split('\n')

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase">
          {language}
        </span>
      </div>
      <div className="overflow-x-auto">
        <div className="font-mono text-sm min-w-max">
          {lines.map((line, index) => (
            <div key={index} className="flex hover:bg-gray-100 dark:hover:bg-gray-800 min-w-0">
              <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-3 py-1 text-right min-w-[3rem] border-r border-gray-200 dark:border-gray-700 select-none flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 px-4 py-1 min-w-0">
                <pre className="whitespace-pre text-gray-800 dark:text-gray-200 m-0 overflow-x-auto">
                  {line || ' '}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
