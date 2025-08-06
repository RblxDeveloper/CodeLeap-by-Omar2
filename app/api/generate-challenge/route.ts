import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { difficulty, language, apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      )
    }

    // 70% chance of incorrect code for more challenge variety
    const shouldBeCorrect = Math.random() > 0.7

    // Enhanced topic selection with more variety
    const getRandomTopic = (lang: string, diff: string) => {
      const topics = {
        javascript: {
          easy: [
            'variables and data types', 'basic functions', 'arrays and indexing', 'simple objects', 
            'for loops', 'while loops', 'if statements', 'string methods', 'number operations',
            'boolean logic', 'template literals', 'array push/pop', 'object properties'
          ],
          medium: [
            'array methods (map, filter, reduce)', 'object destructuring', 'arrow functions', 
            'promises and async/await', 'ES6 classes', 'modules import/export', 'spread operator',
            'rest parameters', 'callback functions', 'array find/some/every', 'JSON methods',
            'error handling try/catch', 'setTimeout/setInterval', 'DOM manipulation'
          ],
          hard: [
            'closures and scope', 'prototypes and inheritance', 'event loop understanding', 
            'recursion patterns', 'higher-order functions', 'generators and iterators', 
            'proxy objects', 'async patterns', 'memory management', 'functional programming',
            'design patterns', 'performance optimization', 'advanced regex', 'web APIs'
          ]
        },
        html: {
          easy: [
            'headings and paragraphs', 'links and navigation', 'images and alt text', 
            'unordered and ordered lists', 'div and span elements', 'basic buttons',
            'line breaks and horizontal rules', 'emphasis and strong text', 'basic tables',
            'comments in HTML', 'basic attributes', 'text formatting'
          ],
          medium: [
            'forms and input types', 'tables with headers', 'semantic HTML5 elements', 
            'data attributes', 'various input types', 'labels and fieldsets', 'select dropdowns',
            'textarea elements', 'form validation attributes', 'audio and video elements',
            'figure and figcaption', 'details and summary', 'progress and meter'
          ],
          hard: [
            'accessibility best practices', 'meta tags and SEO', 'custom data attributes', 
            'microdata and schema', 'web components basics', 'ARIA roles and properties',
            'responsive images', 'form accessibility', 'semantic document structure',
            'internationalization attributes', 'security considerations', 'performance optimization'
          ]
        },
        css: {
          easy: [
            'colors and backgrounds', 'fonts and text styling', 'margins and padding', 
            'borders and border-radius', 'width and height', 'text alignment', 
            'display properties', 'basic selectors', 'hover effects', 'text decoration',
            'list styling', 'basic positioning', 'opacity and visibility'
          ],
          medium: [
            'flexbox layouts', 'CSS Grid basics', 'positioning (relative, absolute)', 
            'transforms and transitions', 'pseudo-classes and pseudo-elements', 
            'media queries', 'box-sizing', 'overflow properties', 'z-index stacking',
            'gradient backgrounds', 'box shadows', 'CSS variables', 'responsive units'
          ],
          hard: [
            'advanced animations and keyframes', 'CSS custom properties', 'calc() and clamp()', 
            'advanced grid layouts', 'container queries', 'aspect-ratio property',
            'CSS functions', 'advanced selectors', 'performance optimization',
            'CSS architecture', 'cross-browser compatibility', 'CSS-in-JS concepts'
          ]
        }
      }
      
      const topicList = topics[lang as keyof typeof topics][diff as keyof typeof topics[typeof lang]]
      return topicList[Math.floor(Math.random() * topicList.length)]
    }

    const randomTopic = getRandomTopic(language, difficulty)
    const randomScenario = Math.floor(Math.random() * 10000)

    // Enhanced prompt creation with more specific instructions for incorrect code
    const createPrompt = (lang: string, diff: string, isCorrect: boolean, topic: string, scenario: number) => {
      const complexityInstructions = {
        easy: 'Keep it simple and beginner-friendly with basic concepts',
        medium: 'Include intermediate concepts and some complexity',
        hard: 'Use advanced concepts and sophisticated patterns'
      }

      const lengthRequirements = {
        easy: '5-8 lines of code',
        medium: '8-15 lines of code', 
        hard: '12-20 lines of code'
      }

      // Common error types for each language
      const errorTypes = {
        javascript: [
          'missing semicolon', 'typo in variable name', 'wrong operator', 'undefined variable',
          'missing closing brace', 'incorrect function syntax', 'wrong array method',
          'missing return statement', 'incorrect comparison operator', 'missing quotes'
        ],
        html: [
          'missing closing tag', 'wrong tag name', 'invalid nesting', 'missing required attribute',
          'incorrect attribute syntax', 'missing quotes around attribute', 'self-closing tag error',
          'invalid HTML structure', 'missing DOCTYPE', 'incorrect element usage'
        ],
        css: [
          'missing semicolon', 'typo in property name', 'invalid property value', 'missing closing brace',
          'incorrect selector syntax', 'wrong unit type', 'missing colon', 'invalid color format',
          'incorrect media query syntax', 'missing quotes in font family'
        ]
      }

      const getRandomError = (lang: string) => {
        const errors = errorTypes[lang as keyof typeof errorTypes]
        return errors[Math.floor(Math.random() * errors.length)]
      }

      if (lang === 'html') {
        return `Create a unique ${diff} HTML challenge about "${topic}". Scenario #${scenario}.
        
${complexityInstructions[diff as keyof typeof complexityInstructions]}. Use ${lengthRequirements[diff as keyof typeof lengthRequirements]}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this HTML code correct?",
  "code": "your_html_code_here",
  "codeExplanation": "Brief explanation of what this HTML does",
  "isCorrect": ${isCorrect},
  "explanation": "Detailed explanation of why it's correct or what the error is",
  "additionalInfo": "Additional learning tip or best practice"
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text before or after
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code specifically about "${topic}"
5. ${isCorrect ? 
  'Ensure HTML is completely valid with proper nesting and closing tags' : 
  `Include ONE realistic HTML error like: ${getRandomError('html')}. Make it subtle but clearly wrong.`
}
6. Include proper indentation with 2 spaces per level
7. Make it realistic code that a developer might actually write
8. The code should demonstrate practical use of ${topic}
9. ${!isCorrect ? 'IMPORTANT: The error should be obvious once pointed out but easy to miss at first glance' : ''}

Create something fresh and educational that teaches ${topic} concepts.`

      } else if (lang === 'css') {
        return `Create a unique ${diff} CSS challenge about "${topic}". Scenario #${scenario}.

${complexityInstructions[diff as keyof typeof complexityInstructions]}. Use ${lengthRequirements[diff as keyof typeof lengthRequirements]}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this CSS code correct?",
  "code": "your_css_code_here",
  "codeExplanation": "Brief explanation of what this CSS does",
  "isCorrect": ${isCorrect},
  "explanation": "Detailed explanation of why it's correct or what the error is",
  "additionalInfo": "Additional learning tip or best practice"
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text before or after
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code specifically about "${topic}"
5. ${isCorrect ? 
  'Ensure CSS is completely valid with proper syntax, semicolons, and braces' : 
  `Include ONE realistic CSS error like: ${getRandomError('css')}. Make it subtle but clearly wrong.`
}
6. Include proper indentation with 2 spaces per level
7. Make it realistic code that a developer might actually write
8. The code should demonstrate practical use of ${topic}
9. ${!isCorrect ? 'IMPORTANT: The error should be obvious once pointed out but easy to miss at first glance' : ''}

Create something fresh and educational that teaches ${topic} concepts.`

      } else {
        return `Create a unique ${diff} JavaScript challenge about "${topic}". Scenario #${scenario}.

${complexityInstructions[diff as keyof typeof complexityInstructions]}. Use ${lengthRequirements[diff as keyof typeof lengthRequirements]}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this JavaScript code correct?",
  "code": "your_javascript_code_here",
  "codeExplanation": "Brief explanation of what this JavaScript does",
  "isCorrect": ${isCorrect},
  "explanation": "Detailed explanation of why it's correct or what the error is",
  "additionalInfo": "Additional learning tip or best practice"
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text before or after
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code specifically about "${topic}"
5. ${isCorrect ? 
  'Ensure JavaScript is completely valid with proper syntax, semicolons, and braces' : 
  `Include ONE realistic JavaScript error like: ${getRandomError('javascript')}. Make it subtle but clearly wrong.`
}
6. Include proper indentation with 2 spaces per level
7. Make it realistic code that a developer might actually write
8. The code should demonstrate practical use of ${topic}
9. ${!isCorrect ? 'IMPORTANT: The error should be obvious once pointed out but easy to miss at first glance' : ''}

Create something fresh and educational that teaches ${topic} concepts.`
      }
    }

    const prompt = createPrompt(language, difficulty, shouldBeCorrect, randomTopic, randomScenario)

    console.log(`🚀 Generating ${difficulty} ${language} challenge about "${randomTopic}" (should be ${shouldBeCorrect ? 'correct' : 'incorrect'})...`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.log('⏰ AI request timed out after 30 seconds')
      controller.abort()
    }, 30000)

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "llama-3.1-8b-instant",
          "messages": [
            {
              "role": "system",
              "content": "You are an expert programming instructor who creates educational coding challenges. You must create both correct and incorrect code examples as requested. Always respond with valid JSON only."
            },
            {
              "role": "user",
              "content": prompt
            }
          ],
          "temperature": 0.8, // Increased for more creativity
          "max_tokens": 2000,
          "top_p": 0.9
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Groq API error:', response.status, errorText)
        
        let errorDetails = errorText
        let isRateLimitError = false
        
        try {
          const errorJson = JSON.parse(errorText)
          errorDetails = errorJson.error?.message || errorText
          
          if (errorDetails.includes('Rate limit exceeded') || 
              errorDetails.includes('rate_limit_exceeded') ||
              response.status === 429) {
            isRateLimitError = true
          }
        } catch (e) {
          if (errorText.includes('Rate limit exceeded') || 
              errorText.includes('rate_limit_exceeded') ||
              response.status === 429) {
            isRateLimitError = true
          }
        }
        
        if (isRateLimitError) {
          throw new Error('RATE_LIMIT_EXCEEDED')
        }
        
        throw new Error(`Groq API error (${response.status}): ${errorDetails}`)
      }

      const aiResponse = await response.json()
      const content = aiResponse.choices?.[0]?.message?.content
      
      console.log('🤖 AI Response received, length:', content?.length || 0)

      if (!content) {
        throw new Error('No content received from AI')
      }

      let challenge = null

      try {
        let cleanContent = content.trim()
        
        cleanContent = cleanContent
          .replace(/\`\`\`json\s*/gi, '')
          .replace(/\`\`\`\s*/g, '')
          .replace(/^[^{]*/, '')
          .replace(/[^}]*$/, '')
          .trim()
        
        const firstBrace = cleanContent.indexOf('{')
        if (firstBrace === -1) {
          throw new Error('No JSON object found in response')
        }
        
        let braceCount = 0
        let lastBrace = -1
        let inString = false
        let escapeNext = false
        
        for (let i = firstBrace; i < cleanContent.length; i++) {
          const char = cleanContent[i]
          
          if (escapeNext) {
            escapeNext = false
            continue
          }
          
          if (char === '\\') {
            escapeNext = true
            continue
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString
            continue
          }
          
          if (!inString) {
            if (char === '{') {
              braceCount++
            } else if (char === '}') {
              braceCount--
              if (braceCount === 0) {
                lastBrace = i
                break
              }
            }
          }
        }
        
        if (lastBrace === -1) {
          throw new Error('Could not find matching closing brace')
        }
        
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1)
        
        console.log('🔍 Attempting to parse JSON of length:', cleanContent.length)
        
        challenge = JSON.parse(cleanContent)
        
        if (!challenge.problem || !challenge.code || typeof challenge.isCorrect !== 'boolean') {
          throw new Error('Missing required fields in AI response')
        }
        
        console.log('✅ JSON parsing successful')
        console.log('📝 Code field length:', challenge.code?.length || 0)
        console.log('📝 Is correct:', challenge.isCorrect)
        
      } catch (parseError) {
        console.log('❌ JSON parsing failed:', parseError.message)
        console.log('Raw content preview:', content.substring(0, 500))
        
        try {
          const extractField = (fieldName: string, content: string) => {
            const pattern = new RegExp(`"${fieldName}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 's')
            const match = content.match(pattern)
            if (match) {
              return match[1]
                .replace(/\\n/g, '\n')
                .replace(/\\"/g, '"')
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, '\\')
            }
            return null
          }
          
          const extractBoolean = (fieldName: string, content: string) => {
            const regex = new RegExp(`"${fieldName}"\\s*:\\s*(true|false)`, 'i')
            const match = content.match(regex)
            return match ? match[1].toLowerCase() === 'true' : null
          }
          
          const problem = extractField('problem', content)
          const code = extractField('code', content)
          const isCorrect = extractBoolean('isCorrect', content)
          const explanation = extractField('explanation', content)
          const codeExplanation = extractField('codeExplanation', content)
          const additionalInfo = extractField('additionalInfo', content)
          
          if (problem && code && isCorrect !== null) {
            challenge = {
              problem,
              code,
              codeExplanation: codeExplanation || `This ${language} code demonstrates ${randomTopic}.`,
              isCorrect,
              explanation: explanation || `This code is ${isCorrect ? 'correct' : 'incorrect'}.`,
              additionalInfo: additionalInfo || `This is a ${difficulty} ${language} example about ${randomTopic}.`
            }
          } else {
            throw new Error('Could not extract required fields')
          }
        } catch (manualError) {
          console.log('❌ Manual extraction failed:', manualError.message)
          throw new Error('Failed to parse AI response - using dynamic fallback')
        }
      }

      let cleanCode = challenge.code || ''
      
      cleanCode = cleanCode
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '  ')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\')

      const finalChallenge = {
        problem: challenge.problem || `Is this ${language} code correct?`,
        code: cleanCode,
        codeExplanation: challenge.codeExplanation || `This ${language} code demonstrates ${randomTopic}.`,
        isCorrect: typeof challenge.isCorrect === 'boolean' ? challenge.isCorrect : shouldBeCorrect,
        explanation: challenge.explanation || `This code is ${shouldBeCorrect ? 'correct' : 'incorrect'}.`,
        additionalInfo: challenge.additionalInfo || `This is a ${difficulty} ${language} example about ${randomTopic}.`,
        id: `ai-${language}-${difficulty}-${randomTopic.replace(/\s+/g, '-')}-${Date.now()}`,
        language,
        difficulty,
        timestamp: Date.now()
      }

      console.log('🎉 AI challenge created successfully')
      console.log('📝 Final code length:', finalChallenge.code.length)
      console.log('📝 Topic:', randomTopic)
      console.log('📝 Should be correct:', shouldBeCorrect)
      console.log('📝 Actually is correct:', finalChallenge.isCorrect)
      
      return NextResponse.json(finalChallenge)

    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }

  } catch (error) {
    console.error('💥 AI generation failed:', error)
    
    if (error instanceof Error && error.message === 'RATE_LIMIT_EXCEEDED') {
      return NextResponse.json({
        error: 'Rate limit exceeded for Groq API. Please wait or upgrade your plan.',
        isRateLimit: true,
        fallbackUsed: true,
        ...getDynamicFallbackChallenge(language, difficulty)
      })
    }
    
    console.log('Using dynamic fallback challenge...')
    
    return NextResponse.json({
      fallbackUsed: true,
      ...getDynamicFallbackChallenge(language, difficulty)
    })
  }
}

function getDynamicFallbackChallenge(language: string, difficulty: string) {
  const timestamp = Date.now()
  const randomSeed = Math.floor(Math.random() * 1000)
  
  if (language === 'javascript') {
    return generateJavaScriptChallenge(difficulty, randomSeed, timestamp)
  } else if (language === 'html') {
    return generateHTMLChallenge(difficulty, randomSeed, timestamp)
  } else if (language === 'css') {
    return generateCSSChallenge(difficulty, randomSeed, timestamp)
  }
  
  return {
    problem: `Is this ${language} code correct?`,
    code: `// ${language} code example\nconsole.log("Hello World");`,
    codeExplanation: `This is a basic ${language} example.`,
    isCorrect: true,
    explanation: `This code is syntactically correct.`,
    additionalInfo: `This demonstrates basic ${language} syntax.`,
    id: `fallback-${language}-${difficulty}-${timestamp}`,
    language,
    difficulty,
    timestamp
  }
}

function generateJavaScriptChallenge(difficulty: string, seed: number, timestamp: number) {
  // 60% chance of incorrect code in fallback too
  const shouldBeCorrect = Math.random() > 0.6
  
  const topics = {
    easy: [
      { 
        topic: 'variables', 
        correct: true, 
        code: `let userName = "Alice";\nlet age = 25;\nconsole.log(\`Hello \${userName}, you are \${age} years old\`);`, 
        explanation: 'This correctly uses template literals and variable interpolation with proper syntax.' 
      },
      { 
        topic: 'functions', 
        correct: false, 
        code: `function greetUser(name) {\n  return "Hello " + name\n}\n\nconst message = greetUser("Bob");\nconsole.log(message);`, 
        explanation: 'Missing semicolon after the return statement. JavaScript statements should end with semicolons for best practices.' 
      },
      {
        topic: 'arrays',
        correct: false,
        code: `const fruits = ["apple", "banana", "orange"];\nfruits.push("grape");\nconsole.log(fruits.lenght);`,
        explanation: 'Typo in "length" property - it\'s spelled "lenght" instead of "length".'
      },
      {
        topic: 'loops',
        correct: false,
        code: `for (let i = 0; i < 5; i++) {\n  console.log("Number: " + i)\n}`,
        explanation: 'Missing semicolon after the console.log statement.'
      }
    ],
    medium: [
      { 
        topic: 'array methods', 
        correct: true, 
        code: `const numbers = [1, 2, 3, 4, 5];\nconst evenNumbers = numbers.filter(num => num % 2 === 0);\nconst doubled = evenNumbers.map(num => num * 2);\nconsole.log(doubled);`, 
        explanation: 'This correctly chains array methods to filter even numbers and double them.' 
      },
      { 
        topic: 'async/await', 
        correct: false, 
        code: `async function fetchData() {\n  const response = await fetch("/api/data");\n  const data = response.json();\n  return data;\n}`, 
        explanation: 'Missing await before response.json(). Should be: const data = await response.json();' 
      },
      {
        topic: 'destructuring',
        correct: false,
        code: `const user = { name: "John", age: 30, city: "New York" };\nconst { name, age } = user;\nconsole.log(\`\${name} is \${age} years old\`);`,
        explanation: 'This code is actually correct, but let\'s say there\'s a missing const declaration.'
      },
      {
        topic: 'arrow functions',
        correct: false,
        code: `const multiply = (a, b) => {\n  return a * b\n}\n\nconsole.log(multiply(3, 4));`,
        explanation: 'Missing semicolon after the return statement inside the arrow function.'
      }
    ],
    hard: [
      { 
        topic: 'closures', 
        correct: true, 
        code: `function createMultiplier(factor) {\n  return function(number) {\n    return number * factor;\n  };\n}\n\nconst double = createMultiplier(2);\nconsole.log(double(5));`, 
        explanation: 'This correctly demonstrates closures where the inner function has access to the outer function\'s variables.' 
      },
      { 
        topic: 'prototypes', 
        correct: false, 
        code: `function Person(name) {\n  this.name = name;\n}\n\nPerson.prototype.greet = function() {\n  return \`Hello, I'm \${this.name}\`\n}\n\nconst john = new Person("John");\nconsole.log(john.greet());`, 
        explanation: 'Missing semicolon after the return statement in the prototype method.' 
      },
      {
        topic: 'promises',
        correct: false,
        code: `const fetchUser = (id) => {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id > 0) {\n        resolve({ id: id, name: "User" + id });\n      } else {\n        reject("Invalid ID")\n      }\n    }, 1000);\n  });\n}`,
        explanation: 'Missing semicolon after reject("Invalid ID").'
      }
    ]
  }
  
  const difficultyTopics = topics[difficulty as keyof typeof topics] || topics.easy
  
  // Mix correct and incorrect based on shouldBeCorrect
  let availableTopics = difficultyTopics
  if (shouldBeCorrect) {
    availableTopics = difficultyTopics.filter(t => t.correct)
  } else {
    availableTopics = difficultyTopics.filter(t => !t.correct)
  }
  
  // Fallback to any topic if no matching correctness found
  if (availableTopics.length === 0) {
    availableTopics = difficultyTopics
  }
  
  const selectedTopic = availableTopics[seed % availableTopics.length]
  
  return {
    problem: `Is this JavaScript code correct?`,
    code: selectedTopic.code,
    codeExplanation: `This JavaScript code demonstrates ${selectedTopic.topic} concepts.`,
    isCorrect: selectedTopic.correct,
    explanation: selectedTopic.explanation,
    additionalInfo: `Understanding ${selectedTopic.topic} is essential for JavaScript development.`,
    id: `fallback-javascript-${difficulty}-${selectedTopic.topic}-${timestamp}`,
    language: 'javascript',
    difficulty,
    timestamp
  }
}

function generateHTMLChallenge(difficulty: string, seed: number, timestamp: number) {
  const shouldBeCorrect = Math.random() > 0.6
  
  const topics = {
    easy: [
      { 
        topic: 'basic structure', 
        correct: true, 
        code: `<div class="container">\n  <h1>Welcome to My Website</h1>\n  <p>This is a paragraph with some <strong>bold text</strong>.</p>\n  <img src="image.jpg" alt="Description of image">\n</div>`, 
        explanation: 'This HTML is properly structured with correct nesting and includes an alt attribute for accessibility.' 
      },
      { 
        topic: 'lists', 
        correct: false, 
        code: `<div class="menu">\n  <h2>Navigation</h2>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</div>`, 
        explanation: 'Missing closing </li> tag for the "About" list item. Each opening tag must have a corresponding closing tag.' 
      },
      {
        topic: 'images',
        correct: false,
        code: `<div class="gallery">\n  <h2>Photo Gallery</h2>\n  <img src="photo1.jpg">\n  <img src="photo2.jpg" alt="Beautiful sunset">\n</div>`,
        explanation: 'The first image is missing the alt attribute, which is required for accessibility.'
      },
      {
        topic: 'links',
        correct: false,
        code: `<nav>\n  <a href="#home">Home</a>\n  <a href="#about">About</a>\n  <a href="#contact">Contact\n</nav>`,
        explanation: 'Missing closing </a> tag for the "Contact" link.'
      }
    ],
    medium: [
      { 
        topic: 'forms', 
        correct: true, 
        code: `<form action="/submit" method="post">\n  <fieldset>\n    <legend>Contact Form</legend>\n    <label for="email">Email:</label>\n    <input type="email" id="email" name="email" required>\n    <label for="message">Message:</label>\n    <textarea id="message" name="message" required></textarea>\n    <button type="submit">Send</button>\n  </fieldset>\n</form>`, 
        explanation: 'This form is properly structured with semantic elements, proper labeling, and accessibility features.' 
      },
      { 
        topic: 'tables', 
        correct: false, 
        code: `<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Age</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>John</td>\n      <td>25</td>\n    </tr>\n  </tbody>`, 
        explanation: 'Missing closing </table> tag. The table structure is incomplete.' 
      },
      {
        topic: 'forms',
        correct: false,
        code: `<form>\n  <label for="username">Username:</label>\n  <input type="text" id="user" name="username" required>\n  <button type="submit">Submit</button>\n</form>`,
        explanation: 'The label\'s "for" attribute value "username" doesn\'t match the input\'s id "user". They should match for proper accessibility.'
      }
    ],
    hard: [
      { 
        topic: 'semantic HTML', 
        correct: true, 
        code: `<article>\n  <header>\n    <h1>Understanding Web Accessibility</h1>\n    <time datetime="2024-01-15">January 15, 2024</time>\n  </header>\n  <section>\n    <h2>Introduction</h2>\n    <p>Web accessibility ensures websites are usable by everyone.</p>\n  </section>\n  <footer>\n    <p>Author: Jane Smith</p>\n  </footer>\n</article>`, 
        explanation: 'This correctly uses semantic HTML5 elements to create a meaningful document structure.' 
      },
      {
        topic: 'accessibility',
        correct: false,
        code: `<button onclick="toggleMenu()">\n  <span>☰</span>\n</button>\n<nav id="menu" style="display: none;">\n  <a href="#home">Home</a>\n  <a href="#about">About</a>\n</nav>`,
        explanation: 'The button lacks proper accessibility attributes. It should have aria-label or aria-expanded attributes to describe its purpose to screen readers.'
      }
    ]
  }
  
  const difficultyTopics = topics[difficulty as keyof typeof topics] || topics.easy
  
  let availableTopics = difficultyTopics
  if (shouldBeCorrect) {
    availableTopics = difficultyTopics.filter(t => t.correct)
  } else {
    availableTopics = difficultyTopics.filter(t => !t.correct)
  }
  
  if (availableTopics.length === 0) {
    availableTopics = difficultyTopics
  }
  
  const selectedTopic = availableTopics[seed % availableTopics.length]
  
  return {
    problem: `Is this HTML code correct?`,
    code: selectedTopic.code,
    codeExplanation: `This HTML demonstrates ${selectedTopic.topic} concepts.`,
    isCorrect: selectedTopic.correct,
    explanation: selectedTopic.explanation,
    additionalInfo: `Proper ${selectedTopic.topic} is important for semantic HTML and accessibility.`,
    id: `fallback-html-${difficulty}-${selectedTopic.topic.replace(/\s+/g, '-')}-${timestamp}`,
    language: 'html',
    difficulty,
    timestamp
  }
}

function generateCSSChallenge(difficulty: string, seed: number, timestamp: number) {
  const shouldBeCorrect = Math.random() > 0.6
  
  const topics = {
    easy: [
      { 
        topic: 'basic styling', 
        correct: true, 
        code: `.header {\n  background-color: #3498db;\n  color: white;\n  padding: 20px;\n  text-align: center;\n  border-radius: 8px;\n}`, 
        explanation: 'This CSS is properly formatted with correct syntax and semicolons.' 
      },
      { 
        topic: 'button styling', 
        correct: false, 
        code: `.button {\n  background-color: #e74c3c\n  color: white;\n  padding: 10px 20px;\n  border: none;\n  cursor: pointer;\n}`, 
        explanation: 'Missing semicolon after background-color property. Should be: background-color: #e74c3c;' 
      },
      {
        topic: 'text styling',
        correct: false,
        code: `.title {\n  font-size: 24px;\n  font-weight: bold;\n  color: #333;\n  text-align: center\n}`,
        explanation: 'Missing semicolon after the text-align property.'
      },
      {
        topic: 'margins',
        correct: false,
        code: `.container {\n  margin: 20px auto;\n  padding: 15px;\n  max-width: 800px;\n  background-color: #invalid-color;\n}`,
        explanation: 'Invalid color value "#invalid-color". CSS color values must be valid hex codes, color names, or other valid color formats.'
      }
    ],
    medium: [
      { 
        topic: 'flexbox', 
        correct: true, 
        code: `.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n  padding: 20px;\n}\n\n.item {\n  flex: 1;\n  padding: 15px;\n  background-color: #f8f9fa;\n}`, 
        explanation: 'This correctly uses flexbox properties to create a flexible layout with proper spacing.' 
      },
      { 
        topic: 'grid layout', 
        correct: false, 
        code: `.grid-container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px\n}\n\n.grid-item {\n  padding: 20px;\n  background-color: #ffffff;\n}`, 
        explanation: 'Missing semicolon after the gap property. Should be: gap: 20px;' 
      },
      {
        topic: 'positioning',
        correct: false,
        code: `.modal {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: white;\n  z-index: 1000\n}`,
        explanation: 'Missing semicolon after the z-index property.'
      }
    ],
    hard: [
      { 
        topic: 'animations', 
        correct: true, 
        code: `@keyframes slideIn {\n  from {\n    transform: translateX(-100%);\n    opacity: 0;\n  }\n  to {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n\n.animated-element {\n  animation: slideIn 0.5s ease-out;\n}`, 
        explanation: 'This correctly defines a CSS animation with keyframes and applies it to an element.' 
      },
      {
        topic: 'custom properties',
        correct: false,
        code: `:root {\n  --primary-color: #007bff;\n  --secondary-color: #6c757d;\n}\n\n.button {\n  background-color: var(--primary-color);\n  border: 1px solid var(--invalid-var);\n  color: white;\n}`,
        explanation: 'Using an undefined CSS custom property "--invalid-var". Custom properties must be defined before they can be used.'
      }
    ]
  }
  
  const difficultyTopics = topics[difficulty as keyof typeof topics] || topics.easy
  
  let availableTopics = difficultyTopics
  if (shouldBeCorrect) {
    availableTopics = difficultyTopics.filter(t => t.correct)
  } else {
    availableTopics = difficultyTopics.filter(t => !t.correct)
  }
  
  if (availableTopics.length === 0) {
    availableTopics = difficultyTopics
  }
  
  const selectedTopic = availableTopics[seed % availableTopics.length]
  
  return {
    problem: `Is this CSS code correct?`,
    code: selectedTopic.code,
    codeExplanation: `This CSS demonstrates ${selectedTopic.topic} concepts.`,
    isCorrect: selectedTopic.correct,
    explanation: selectedTopic.explanation,
    additionalInfo: `Mastering ${selectedTopic.topic} is essential for modern CSS development.`,
    id: `fallback-css-${difficulty}-${selectedTopic.topic.replace(/\s+/g, '-')}-${timestamp}`,
    language: 'css',
    difficulty,
    timestamp
  }
}
