'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink, Eye } from 'lucide-react'

interface HtmlPreviewProps {
  code: string
}

export function HtmlPreview({ code }: HtmlPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const createPreviewDocument = (htmlCode: string) => {
    // Remove any script tags for security
    const cleanCode = htmlCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    * { 
      box-sizing: border-box; 
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: 0.5em;
      color: #2c3e50;
    }
    p {
      margin-bottom: 1em;
    }
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1em;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
      color: #495057;
    }
    form {
      margin-bottom: 1em;
    }
    input, textarea, select, button {
      margin: 4px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
    }
    button {
      background-color: #007bff;
      color: white;
      cursor: pointer;
      font-weight: 500;
    }
    button:hover {
      background-color: #0056b3;
    }
    ul, ol {
      padding-left: 2em;
    }
    li {
      margin-bottom: 0.25em;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .card {
      border: 1px solid #dee2e6;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      background: #f8f9fa;
    }
    video {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${cleanCode}
</body>
</html>`
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Eye className="h-4 w-4 text-purple-600" />
            <span>HTML Preview</span>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpanded}
            className="flex items-center space-x-1"
          >
            <ExternalLink className="h-3 w-3" />
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`preview-container ${isExpanded ? 'expanded' : ''} border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white`}>
          <iframe
            srcDoc={createPreviewDocument(code)}
            className={`w-full border-0 ${isExpanded ? 'h-96' : 'h-48'}`}
            title="HTML Preview"
            sandbox="allow-same-origin"
          />
        </div>
      </CardContent>
    </Card>
  )
}
