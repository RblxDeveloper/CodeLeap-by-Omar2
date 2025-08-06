// Global state
let currentChallenge = null;
let challengeHistory = [];
let apiKey = null;
let isGenerating = false;

// DOM elements
const elements = {
    // Modal
    apiKeyModal: document.getElementById('apiKeyModal'),
    apiKeyInput: document.getElementById('apiKeyInput'),
    apiKeyError: document.getElementById('apiKeyError'),
    saveApiKey: document.getElementById('saveApiKey'),
    changeApiKey: document.getElementById('changeApiKey'),
    
    // Theme
    themeToggle: document.getElementById('themeToggle'),
    
    // Tabs
    tabTriggers: document.querySelectorAll('.tab-trigger'),
    challengeTab: document.getElementById('challengeTab'),
    historyTab: document.getElementById('historyTab'),
    
    // Challenge sections
    welcomeSection: document.getElementById('welcomeSection'),
    loadingGhost: document.getElementById('loadingGhost'),
    rateLimitWarning: document.getElementById('rateLimitWarning'),
    generationError: document.getElementById('generationError'),
    challengeControls: document.getElementById('challengeControls'),
    currentChallenge: document.getElementById('currentChallenge'),
    
    // Controls
    difficultySelect: document.getElementById('difficultySelect'),
    languageSelect: document.getElementById('languageSelect'),
    generateChallenge: document.getElementById('generateChallenge'),
    languageDisplay: document.getElementById('languageDisplay'),
    languageText: document.getElementById('languageText'),
    difficultyText: document.getElementById('difficultyText'),
    apiKeyRequired: document.getElementById('apiKeyRequired'),
    
    // Challenge display
    challengeLanguageIcon: document.getElementById('challengeLanguageIcon'),
    challengeLanguage: document.getElementById('challengeLanguage'),
    challengeDifficulty: document.getElementById('challengeDifficulty'),
    challengeProblem: document.getElementById('challengeProblem'),
    codeDisplay: document.getElementById('codeDisplay'),
    codeExplanation: document.getElementById('codeExplanation'),
    htmlPreview: document.getElementById('htmlPreview'),
    previewFrame: document.getElementById('previewFrame'),
    expandPreview: document.getElementById('expandPreview'),
    
    // Answer section
    answerButtons: document.getElementById('answerButtons'),
    correctBtn: document.getElementById('correctBtn'),
    incorrectBtn: document.getElementById('incorrectBtn'),
    answerReveal: document.getElementById('answerReveal'),
    userResult: document.getElementById('userResult'),
    resultIcon: document.getElementById('resultIcon'),
    resultText: document.getElementById('resultText'),
    userAnswerBadge: document.getElementById('userAnswerBadge'),
    actualAnswerBadge: document.getElementById('actualAnswerBadge'),
    explanationTitle: document.getElementById('explanationTitle'),
    explanationText: document.getElementById('explanationText'),
    additionalInfo: document.getElementById('additionalInfo'),
    additionalInfoText: document.getElementById('additionalInfoText'),
    
    // History
    statsCard: document.getElementById('statsCard'),
    totalChallenges: document.getElementById('totalChallenges'),
    accuracyPercent: document.getElementById('accuracyPercent'),
    correctAnswers: document.getElementById('correctAnswers'),
    incorrectAnswers: document.getElementById('incorrectAnswers'),
    easyCount: document.getElementById('easyCount'),
    mediumCount: document.getElementById('mediumCount'),
    hardCount: document.getElementById('hardCount'),
    jsCount: document.getElementById('jsCount'),
    htmlCount: document.getElementById('htmlCount'),
    cssCount: document.getElementById('cssCount'),
    historyList: document.getElementById('historyList'),
    emptyHistory: document.getElementById('emptyHistory'),
    
    // Status elements
    generationTime: document.getElementById('generationTime'),
    errorTime: document.getElementById('errorTime'),
    errorTitle: document.getElementById('errorTitle'),
    errorMessage: document.getElementById('errorMessage')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
    loadSavedData();
    setupEventListeners();
    updateUI();
});

// Initialize Lucide icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load saved data from localStorage
function loadSavedData() {
    // Load challenge history
    const savedHistory = localStorage.getItem('codeleap-history');
    if (savedHistory) {
        challengeHistory = JSON.parse(savedHistory);
    }
    
    // Load API key or set default
    const savedApiKey = localStorage.getItem('codeleap-api-key');
    if (savedApiKey) {
        apiKey = savedApiKey;
    } else {
        // Set default Groq API key
        const defaultKey = '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';
        apiKey = defaultKey;
        localStorage.setItem('codeleap-api-key', defaultKey);
    }
    
    // Load theme
    const savedTheme = localStorage.getItem('codeleap-theme') || 'light';
    document.body.className = `${savedTheme}-theme`;
}

// Setup event listeners
function setupEventListeners() {
    // API Key Modal
    elements.apiKeyInput.addEventListener('input', validateApiKeyInput);
    elements.apiKeyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveApiKeyHandler();
        }
    });
    elements.saveApiKey.addEventListener('click', saveApiKeyHandler);
    elements.changeApiKey.addEventListener('click', showApiKeyModal);
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Tabs
    elements.tabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Controls
    elements.difficultySelect.addEventListener('change', updateControlLabels);
    elements.languageSelect.addEventListener('change', updateControlLabels);
    elements.generateChallenge.addEventListener('click', generateChallengeHandler);
    
    // Answer buttons
    elements.correctBtn.addEventListener('click', () => handleAnswer(true));
    elements.incorrectBtn.addEventListener('click', () => handleAnswer(false));
    
    // Preview expand
    elements.expandPreview.addEventListener('click', togglePreviewExpand);
}

// API Key functions
function showApiKeyModal() {
    elements.apiKeyModal.classList.remove('hidden');
    elements.apiKeyInput.value = '';
    elements.apiKeyError.classList.add('hidden');
    elements.saveApiKey.disabled = true;
    elements.apiKeyInput.focus();
}

function hideApiKeyModal() {
    elements.apiKeyModal.classList.add('hidden');
}

function validateApiKeyInput() {
    const value = elements.apiKeyInput.value.trim();
    elements.saveApiKey.disabled = !value || !value.startsWith('gsk_');
    
    if (value && !value.startsWith('gsk_')) {
        showApiKeyError('Please enter a valid Groq API key (starts with gsk_)');
    } else {
        hideApiKeyError();
    }
}

function showApiKeyError(message) {
    elements.apiKeyError.querySelector('span').textContent = message;
    elements.apiKeyError.classList.remove('hidden');
}

function hideApiKeyError() {
    elements.apiKeyError.classList.add('hidden');
}

async function saveApiKeyHandler() {
    const keyValue = elements.apiKeyInput.value.trim();
    
    if (!keyValue || !keyValue.startsWith('gsk_')) {
        showApiKeyError('Please enter a valid Groq API key');
        return;
    }
    
    // Show loading state
    elements.saveApiKey.innerHTML = '<div class="loading-spinner"></div> Validating...';
    elements.saveApiKey.disabled = true;
    
    try {
        // Test the API key
        const isValid = await validateApiKey(keyValue);
        
        if (isValid) {
            apiKey = keyValue;
            localStorage.setItem('codeleap-api-key', keyValue);
            hideApiKeyModal();
            updateUI();
        } else {
            showApiKeyError('Invalid API key. Please check and try again.');
        }
    } catch (error) {
        showApiKeyError('Failed to validate API key. Please check your connection and try again.');
    } finally {
        // Reset button
        elements.saveApiKey.innerHTML = '<i data-lucide="key"></i> Save API Key';
        elements.saveApiKey.disabled = false;
        initializeLucideIcons();
    }
}

async function validateApiKey(key) {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                "messages": [{ "role": "user", "content": "Hello" }],
                "max_tokens": 5
            })
        });
        
        return response.ok;
    } catch (error) {
        console.error('API key validation error:', error);
        return false;
    }
}

// Theme functions
function toggleTheme() {
    const currentTheme = document.body.className.includes('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.className = `${newTheme}-theme`;
    localStorage.setItem('codeleap-theme', newTheme);
    
    // Update theme toggle icons
    const sunIcon = elements.themeToggle.querySelector('.sun-icon');
    const moonIcon = elements.themeToggle.querySelector('.moon-icon');
    
    if (newTheme === 'dark') {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
}

// Tab functions
function switchTab(tabName) {
    // Update tab triggers
    elements.tabTriggers.forEach(trigger => {
        trigger.classList.toggle('active', trigger.dataset.tab === tabName);
    });
    
    // Update tab content
    elements.challengeTab.classList.toggle('active', tabName === 'challenge');
    elements.historyTab.classList.toggle('active', tabName === 'history');
    
    // Update history when switching to history tab
    if (tabName === 'history') {
        updateHistoryDisplay();
    }
}

// Control functions
function updateControlLabels() {
    const difficulty = elements.difficultySelect.value;
    const language = elements.languageSelect.value;
    
    elements.languageDisplay.textContent = language.toUpperCase();
    elements.languageText.textContent = language;
    elements.difficultyText.textContent = difficulty;
}

// Challenge generation
async function generateChallengeHandler() {
    if (!apiKey) {
        showApiKeyModal();
        return;
    }
    
    if (isGenerating) return;
    
    const difficulty = elements.difficultySelect.value;
    const language = elements.languageSelect.value;
    
    await generateChallenge(difficulty, language);
}

async function generateChallenge(difficulty, language) {
    const startTime = Date.now();
    isGenerating = true;
    
    // Show loading state
    showLoadingState();
    
    try {
        const challenge = await callGroqAPI(difficulty, language);
        const endTime = Date.now();
        const generationTime = endTime - startTime;
        
        // Handle different response types
        if (challenge.isRateLimit) {
            showRateLimitWarning(generationTime);
        } else if (challenge.fallbackUsed) {
            showGenerationError('AI was slow/unavailable, using curated challenge', generationTime, true);
        }
        
        // Display the challenge
        currentChallenge = {
            ...challenge,
            id: challenge.id || `challenge-${Date.now()}`,
            timestamp: challenge.timestamp || Date.now()
        };
        
        displayChallenge(currentChallenge);
        
    } catch (error) {
        const endTime = Date.now();
        const generationTime = endTime - startTime;
        
        console.error('Challenge generation failed:', error);
        
        if (error.message === 'RATE_LIMIT_EXCEEDED') {
            showRateLimitWarning(generationTime);
            // Show fallback challenge
            currentChallenge = getFallbackChallenge(language, difficulty);
            displayChallenge(currentChallenge);
        } else {
            showGenerationError(error.message || 'AI generation failed', generationTime, false);
            // Show fallback challenge
            currentChallenge = getFallbackChallenge(language, difficulty);
            displayChallenge(currentChallenge);
        }
    } finally {
        isGenerating = false;
        hideLoadingState();
    }
}

async function callGroqAPI(difficulty, language) {
    // 70% chance of incorrect code for more challenge
    const shouldBeCorrect = Math.random() > 0.7;
    
    const getRandomTopic = (lang, diff) => {
        const topics = {
            javascript: {
                easy: ['variables', 'functions', 'arrays', 'objects', 'loops', 'conditionals', 'strings', 'numbers'],
                medium: ['array methods', 'object destructuring', 'arrow functions', 'promises', 'async/await', 'classes', 'modules'],
                hard: ['closures', 'prototypes', 'event loop', 'recursion', 'higher-order functions', 'generators', 'proxies']
            },
            html: {
                easy: ['headings', 'paragraphs', 'links', 'images', 'lists', 'divs', 'spans', 'buttons'],
                medium: ['forms', 'tables', 'semantic elements', 'attributes', 'input types', 'labels', 'fieldsets'],
                hard: ['accessibility', 'meta tags', 'custom elements', 'data attributes', 'microdata', 'web components']
            },
            css: {
                easy: ['colors', 'fonts', 'margins', 'padding', 'borders', 'backgrounds', 'text-align', 'display'],
                medium: ['flexbox', 'grid', 'positioning', 'transforms', 'transitions', 'pseudo-classes', 'media queries'],
                hard: ['animations', 'custom properties', 'calc()', 'clamp()', 'grid-areas', 'container queries', 'aspect-ratio']
            }
        };
        
        const topicList = topics[lang][diff];
        return topicList[Math.floor(Math.random() * topicList.length)];
    };
    
    const randomTopic = getRandomTopic(language, difficulty);
    const randomScenario = Math.floor(Math.random() * 1000);
    
    const prompt = createPrompt(language, difficulty, shouldBeCorrect, randomTopic, randomScenario);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, 25000);
    
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                "messages": [{ "role": "user", "content": prompt }],
                "temperature": 0.3,
                "max_tokens": 1500
            }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorText = await response.text();
            
            if (response.status === 429 || errorText.includes('Rate limit exceeded')) {
                throw new Error('RATE_LIMIT_EXCEEDED');
            }
            
            throw new Error(`Groq API error (${response.status}): ${errorText}`);
        }
        
        const aiResponse = await response.json();
        const content = aiResponse.choices?.[0]?.message?.content;
        
        if (!content) {
            throw new Error('No content received from AI');
        }
        
        // Parse the JSON response
        const challenge = parseAIResponse(content, language, difficulty, randomTopic);
        
        return {
            ...challenge,
            id: `ai-${language}-${difficulty}-${randomTopic}-${Date.now()}`,
            language,
            difficulty,
            timestamp: Date.now()
        };
        
    } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
    }
}

function createPrompt(language, difficulty, isCorrect, topic, scenario) {
    if (language === 'html') {
        const htmlExample = isCorrect 
            ? `<div class="container">\\n  <h1>Welcome to Our Site</h1>\\n  <p>This is a sample paragraph with some content.</p>\\n  <ul>\\n    <li>First item</li>\\n    <li>Second item</li>\\n  </ul>\\n</div>`
            : `<div class="container">\\n  <h1>Welcome to Our Site</h2>\\n  <p>This is a sample paragraph with some content.</p>\\n  <ul>\\n    <li>First item</li>\\n    <li>Second item\\n  </ul>\\n</div>`;
        
        return `Create a unique ${difficulty} HTML challenge about ${topic}. Scenario #${scenario}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this HTML code correct?",
  "code": "${htmlExample}",
  "codeExplanation": "This HTML creates a container with heading, paragraph and list about ${topic}",
  "isCorrect": ${isCorrect},
  "explanation": "${isCorrect ? 'This HTML code is syntactically correct with proper nesting and closing tags.' : 'This HTML has an error - there is a mismatch between opening and closing tags.'}",
  "additionalInfo": "HTML elements must have matching opening and closing tags for proper structure."
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code about ${topic}
5. ${isCorrect ? 'Ensure HTML is completely valid' : 'Include ONE subtle HTML error (wrong closing tag, missing closing tag, invalid nesting)'}
6. Include proper indentation with 2 spaces per level
7. Make the code substantial (5-10 lines minimum)

The code should be complete and demonstrate ${topic} concepts.`;
    } else if (language === 'css') {
        const cssExample = isCorrect
            ? `.container {\\n  background-color: #f0f0f0;\\n  padding: 20px;\\n  margin: 10px;\\n  border-radius: 5px;\\n}\\n\\n.title {\\n  color: #333;\\n  font-size: 24px;\\n}`
            : `.container {\\n  background-color: #f0f0f0\\n  padding: 20px;\\n  margin: 10px;\\n  border-radius: 5px;\\n}\\n\\n.title {\\n  color: #333;\\n  font-size: 24px;\\n}`;
        
        return `Create a unique ${difficulty} CSS challenge about ${topic}. Scenario #${scenario}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this CSS code correct?",
  "code": "${cssExample}",
  "codeExplanation": "This CSS styles elements with ${topic} properties",
  "isCorrect": ${isCorrect},
  "explanation": "${isCorrect ? 'This CSS code is syntactically correct with proper semicolons and braces.' : 'This CSS has an error - missing semicolon after a property declaration.'}",
  "additionalInfo": "CSS declarations must end with semicolons for proper syntax."
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code about ${topic}
5. ${isCorrect ? 'Ensure CSS is completely valid' : 'Include ONE subtle CSS error (missing semicolon, wrong property name, invalid value)'}
6. Include proper indentation with 2 spaces per level
7. Make the code substantial (multiple selectors/properties)

The code should demonstrate ${topic} concepts clearly.`;
    } else {
        const jsExample = isCorrect
            ? `function calculateSum(numbers) {\\n  let total = 0;\\n  for (let i = 0; i < numbers.length; i++) {\\n    total += numbers[i];\\n  }\\n  return total;\\n}\\n\\nconst result = calculateSum([1, 2, 3, 4, 5]);\\nconsole.log(result);`
            : `function calculateSum(numbers) {\\n  let total = 0;\\n  for (let i = 0; i < numbers.length; i++) {\\n    total += numbers[i]\\n  }\\n  return total;\\n}\\n\\nconst result = calculateSum([1, 2, 3, 4, 5]);\\nconsole.log(result);`;
        
        return `Create a unique ${difficulty} JavaScript challenge about ${topic}. Scenario #${scenario}.

You must return ONLY a valid JSON object with this exact structure:

{
  "problem": "Is this JavaScript code correct?",
  "code": "${jsExample}",
  "codeExplanation": "This JavaScript function demonstrates ${topic} concepts",
  "isCorrect": ${isCorrect},
  "explanation": "${isCorrect ? 'This JavaScript code is syntactically correct with proper semicolons and braces.' : 'This JavaScript has an error - missing semicolon after a statement.'}",
  "additionalInfo": "JavaScript statements should end with semicolons for clarity and consistency."
}

CRITICAL RULES:
1. Return ONLY the JSON object, no other text
2. Use \\n for line breaks in the code field
3. Use \\" to escape quotes inside strings
4. Make the code about ${topic}
5. ${isCorrect ? 'Ensure JavaScript is completely valid' : 'Include ONE subtle JavaScript error (missing semicolon, wrong operator, undefined variable)'}
6. Include proper indentation with 2 spaces per level
7. Make the code substantial (multiple lines/statements)

The code should demonstrate ${topic} concepts clearly.`;
    }
}

function parseAIResponse(content, language, difficulty, topic) {
    try {
        let cleanContent = content.trim()
            .replace(/```json\s*/gi, '')
            .replace(/```\s*/g, '')
            .trim();
        
        // Find JSON object boundaries
        const firstBrace = cleanContent.indexOf('{');
        if (firstBrace === -1) {
            throw new Error('No JSON object found');
        }
        
        let braceCount = 0;
        let lastBrace = -1;
        let inString = false;
        let escapeNext = false;
        
        for (let i = firstBrace; i < cleanContent.length; i++) {
            const char = cleanContent[i];
            
            if (escapeNext) {
                escapeNext = false;
                continue;
            }
            
            if (char === '\\') {
                escapeNext = true;
                continue;
            }
            
            if (char === '"' && !escapeNext) {
                inString = !inString;
                continue;
            }
            
            if (!inString) {
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        lastBrace = i;
                        break;
                    }
                }
            }
        }
        
        if (lastBrace === -1) {
            throw new Error('Could not find matching closing brace');
        }
        
        cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
        const challenge = JSON.parse(cleanContent);
        
        // Validate required fields
        if (!challenge.problem || !challenge.code || typeof challenge.isCorrect !== 'boolean') {
            throw new Error('Missing required fields');
        }
        
        // Clean the code
        let cleanCode = challenge.code
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '  ')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
        
        return {
            problem: challenge.problem,
            code: cleanCode,
            codeExplanation: challenge.codeExplanation || `This ${language} code demonstrates ${topic}.`,
            isCorrect: challenge.isCorrect,
            explanation: challenge.explanation || `This code is ${challenge.isCorrect ? 'correct' : 'incorrect'}.`,
            additionalInfo: challenge.additionalInfo || `This is a ${difficulty} ${language} example about ${topic}.`
        };
        
    } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        
        // Manual extraction fallback
        const extractField = (fieldName, content) => {
            const pattern = new RegExp(`"${fieldName}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`,'s');
            const match = content.match(pattern);
            if (match) {
                return match[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/\\'/g, "'")
                    .replace(/\\\\/g, '\\');
            }
            return null;
        };
        
        const extractBoolean = (fieldName, content) => {
            const regex = new RegExp(`"${fieldName}"\\s*:\\s*(true|false)`, 'i');
            const match = content.match(regex);
            return match ? match[1] === 'true' : null;
        };
        
        const problem = extractField('problem', content);
        const code = extractField('code', content);
        const isCorrect = extractBoolean('isCorrect', content);
        const explanation = extractField('explanation', content);
        const codeExplanation = extractField('codeExplanation', content);
        const additionalInfo = extractField('additionalInfo', content);
        
        if (problem && code && isCorrect !== null) {
            return {
                problem,
                code,
                codeExplanation: codeExplanation || `This ${language} code demonstrates ${topic}.`,
                isCorrect,
                explanation: explanation || `This code is ${isCorrect ? 'correct' : 'incorrect'}.`,
                additionalInfo: additionalInfo || `This is a ${difficulty} ${language} example about ${topic}.`
            };
        }
        
        throw new Error('Failed to parse AI response');
    }
}

function getFallbackChallenge(language, difficulty) {
    const fallbacks = {
        javascript: {
            easy: [
                {
                    problem: "Does this variable assignment work?",
                    code: "let age = 25;\nlet name = 'John';\nconsole.log('Hello ' + name + ', you are ' + age + ' years old.');",
                    codeExplanation: "This code declares variables and creates a greeting message.",
                    isCorrect: true,
                    explanation: "This correctly declares variables and uses string concatenation.",
                    additionalInfo: "Use 'let' for variables that can change their value."
                },
                {
                    problem: "Will this function work correctly?",
                    code: "function calculateArea(width, height) {\n  const area = width * height\n  return area;\n}\n\nconst result = calculateArea(5, 10);\nconsole.log('Area is: ' + result);",
                    codeExplanation: "This function calculates the area of a rectangle.",
                    isCorrect: false,
                    explanation: "Missing semicolon after 'width * height'. Should be 'const area = width * height;'",
                    additionalInfo: "JavaScript statements should end with semicolons for consistency."
                }
            ],
            medium: [
                {
                    problem: "Does this array method work correctly?",
                    code: "const numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(function(num) {\n  return num * 2;\n});\nconst sum = doubled.reduce((acc, curr) => acc + curr, 0);\nconsole.log('Sum of doubled numbers:', sum);",
                    codeExplanation: "This code doubles array elements and calculates their sum.",
                    isCorrect: true,
                    explanation: "This correctly uses map() to transform elements and reduce() to sum them.",
                    additionalInfo: "Array methods like map() and reduce() are powerful for data transformation."
                }
            ],
            hard: [
                {
                    problem: "Does this closure implementation work?",
                    code: "function createCounter(initialValue) {\n  let count = initialValue || 0;\n  \n  return {\n    increment: function() {\n      count++;\n      return count;\n    },\n    decrement: function() {\n      count--;\n      return count;\n    },\n    getValue: function() {\n      return count;\n    }\n  };\n}\n\nconst counter = createCounter(5);\nconsole.log(counter.increment());",
                    codeExplanation: "This creates a counter object using closures to maintain private state.",
                    isCorrect: true,
                    explanation: "This correctly implements a closure pattern with private variables and public methods.",
                    additionalInfo: "Closures allow functions to access variables from their outer scope even after the outer function returns."
                }
            ]
        },
        html: {
            easy: [
                {
                    problem: "Is this HTML structure correct?",
                    code: '<div class="welcome-section">\n  <h1>Welcome to Our Website</h1>\n  <p>This is a sample paragraph with some <strong>bold text</strong> and a <a href="#about">link</a>.</p>\n  <img src="welcome.jpg" alt="Welcome image">\n</div>',
                    codeExplanation: "This creates a welcome section with heading, paragraph, and image.",
                    isCorrect: true,
                    explanation: "This HTML is properly structured with correct nesting and attributes.",
                    additionalInfo: "Always include alt attributes for images for accessibility."
                },
                {
                    problem: "Is this list structure correct?",
                    code: '<div class="navigation">\n  <h2>Menu</h2>\n  <ul>\n    <li><a href="#home">Home</a></li>\n    <li><a href="#about">About</a>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</div>',
                    codeExplanation: "This creates a navigation menu with a list of links.",
                    isCorrect: false,
                    explanation: "Missing closing tag </li> for the 'About' list item. Each <li> must have a corresponding </li>.",
                    additionalInfo: "All HTML elements must be properly closed to maintain valid document structure."
                }
            ],
            medium: [
                {
                    problem: "Is this form structure correct?",
                    code: '<form action="/submit" method="post" class="contact-form">\n  <fieldset>\n    <legend>Contact Information</legend>\n    \n    <label for="fullname">Full Name:</label>\n    <input type="text" id="fullname" name="fullname" required>\n    \n    <label for="email">Email Address:</label>\n    <input type="email" id="email" name="email" required>\n    \n    <label for="message">Message:</label>\n    <textarea id="message" name="message" rows="4" cols="50" required></textarea>\n    \n    <button type="submit">Send Message</button>\n  </fieldset>\n</form>',
                    codeExplanation: "This creates a contact form with fieldset, labels, and various input types.",
                    isCorrect: true,
                    explanation: "This form is properly structured with semantic elements, proper labeling, and accessibility features.",
                    additionalInfo: "Using fieldset and legend elements helps group related form controls and improves accessibility."
                }
            ],
            hard: [
                {
                    problem: "Is this semantic HTML structure correct?",
                    code: '<article class="blog-post">\n  <header>\n    <h1>Understanding Web Accessibility</h1>\n    <p class="meta">\n      <time datetime="2024-01-15">January 15, 2024</time>\n      by <span class="author">Jane Smith</span>\n    </p>\n  </header>\n  \n  <section class="content">\n    <h2>Introduction</h2>\n    <p>Web accessibility ensures that websites are usable by people with disabilities.</p>\n    \n    <h2>Key Principles</h2>\n    <ul>\n      <li>Perceivable - Information must be presentable in ways users can perceive</li>\n      <li>Operable - Interface components must be operable</li>\n      <li>Understandable - Information and UI operation must be understandable</li>\n      <li>Robust - Content must be robust enough for various assistive technologies</li>\n    </ul>\n  </section>\n  \n  <footer>\n    <p>Tags: <span class="tag">accessibility</span>, <span class="tag">web development</span></p>\n  </footer>\n</article>',
                    codeExplanation: "This uses semantic HTML5 elements to structure a blog post with proper hierarchy.",
                    isCorrect: true,
                    explanation: "This correctly uses semantic elements like article, header, section, and footer with proper heading hierarchy.",
                    additionalInfo: "Semantic HTML improves accessibility, SEO, and code maintainability by providing meaningful structure."
                }
            ]
        },
        css: {
            easy: [
                {
                    problem: "Is this CSS styling correct?",
                    code: ".header {\n  background-color: #2c3e50;\n  color: white;\n  padding: 20px;\n  text-align: center;\n}\n\n.header h1 {\n  margin: 0;\n  font-size: 2.5em;\n  font-weight: bold;\n}",
                    codeExplanation: "This styles a header section with background, text color, and typography.",
                    isCorrect: true,
                    explanation: "This CSS is properly formatted with correct syntax and semicolons.",
                    additionalInfo: "Using specific selectors like '.header h1' helps target elements precisely."
                },
                {
                    problem: "Will this button styling work?",
                    code: ".button {\n  background-color: #3498db\n  color: white;\n  padding: 12px 24px;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.button:hover {\n  background-color: #2980b9;\n}",
                    codeExplanation: "This styles a button with colors, padding, and hover effects.",
                    isCorrect: false,
                    explanation: "Missing semicolon after 'background-color: #3498db'. Should be '#3498db;'",
                    additionalInfo: "Every CSS property declaration must end with a semicolon."
                }
            ],
            medium: [
                {
                    problem: "Does this flexbox layout work?",
                    code: ".container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 20px;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n\n.item {\n  flex: 1;\n  margin: 0 10px;\n  padding: 15px;\n  background-color: #f8f9fa;\n  border-radius: 8px;\n}",
                    codeExplanation: "This creates a flexible layout container with evenly distributed items.",
                    isCorrect: true,
                    explanation: "This correctly uses flexbox properties to create a responsive layout with proper spacing.",
                    additionalInfo: "Flexbox is excellent for creating flexible, responsive layouts with minimal code."
                }
            ],
            hard: [
                {
                    problem: "Will this CSS Grid and animation work?",
                    code: ".grid-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 20px;\n  padding: 20px;\n}\n\n.grid-item {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  padding: 30px;\n  border-radius: 12px;\n  color: white;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n\n.grid-item:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);\n}\n\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.grid-item {\n  animation: fadeInUp 0.6s ease-out;\n}",
                    codeExplanation: "This creates a responsive grid layout with gradient backgrounds, hover effects, and animations.",
                    isCorrect: true,
                    explanation: "This correctly combines CSS Grid, gradients, transitions, and keyframe animations for a modern layout.",
                    additionalInfo: "CSS Grid with auto-fit and minmax creates truly responsive layouts that adapt to any screen size."
                }
            ]
        }
    };
    
    const examples = fallbacks[language][difficulty];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    
    return {
        ...randomExample,
        id: `fallback-${language}-${difficulty}-${Date.now()}`,
        language,
        difficulty,
        timestamp: Date.now()
    };
}

// UI State functions
function showLoadingState() {
    elements.welcomeSection.classList.add('hidden');
    elements.rateLimitWarning.classList.add('hidden');
    elements.generationError.classList.add('hidden');
    elements.currentChallenge.classList.add('hidden');
    elements.loadingGhost.classList.remove('hidden');
    
    elements.generateChallenge.disabled = true;
    elements.generateChallenge.innerHTML = '<i data-lucide="brain"></i> AI is thinking...';
    initializeLucideIcons();
}

function hideLoadingState() {
    elements.loadingGhost.classList.add('hidden');
    elements.generateChallenge.disabled = false;
    elements.generateChallenge.innerHTML = '<i data-lucide="brain"></i> Generate Challenge';
    initializeLucideIcons();
}

function showRateLimitWarning(generationTime) {
    elements.rateLimitWarning.classList.remove('hidden');
    elements.generationError.classList.add('hidden');
    
    if (generationTime) {
        elements.generationTime.classList.remove('hidden');
        elements.generationTime.querySelector('span').textContent = `${(generationTime / 1000).toFixed(1)}s`;
    }
}

function showGenerationError(message, generationTime, isFallback) {
    elements.generationError.classList.remove('hidden');
    elements.rateLimitWarning.classList.add('hidden');
    
    elements.errorTitle.textContent = isFallback ? 'Using Curated Challenge' : 'AI Issue';
    elements.errorMessage.textContent = message;
    
    const errorCard = elements.generationError;
    if (isFallback) {
        errorCard.className = 'card warning-card';
    } else {
        errorCard.className = 'card error-card';
    }
    
    if (generationTime) {
        elements.errorTime.classList.remove('hidden');
        elements.errorTime.querySelector('span').textContent = `${(generationTime / 1000).toFixed(1)}s`;
    }
}

// Challenge display
function displayChallenge(challenge) {
    elements.welcomeSection.classList.add('hidden');
    elements.currentChallenge.classList.remove('hidden');
    
    // Update challenge info
    const languageIcons = {
        javascript: '🟨',
        html: '🟧',
        css: '🟦'
    };
    
    elements.challengeLanguageIcon.textContent = languageIcons[challenge.language];
    elements.challengeLanguage.textContent = challenge.language.charAt(0).toUpperCase() + challenge.language.slice(1);
    elements.challengeDifficulty.textContent = challenge.difficulty.toUpperCase();
    elements.challengeDifficulty.className = `difficulty-badge ${challenge.difficulty}`;
    elements.challengeProblem.textContent = challenge.problem;
    
    // Display code
    displayCode(challenge.code, challenge.language);
    
    // Update explanation
    elements.codeExplanation.textContent = challenge.codeExplanation;
    
    // Show HTML preview if applicable
    if (challenge.language === 'html' && shouldShowPreview(challenge.code)) {
        showHtmlPreview(challenge.code);
    } else {
        elements.htmlPreview.classList.add('hidden');
    }
    
    // Reset answer state
    elements.answerButtons.classList.remove('hidden');
    elements.answerReveal.classList.add('hidden');
    
    initializeLucideIcons();
}

function displayCode(code, language) {
    const formattedCode = formatCode(code, language);
    const lines = formattedCode.split('\n');
    
    let html = `
        <div class="code-header">
            <span class="code-language">${language.toUpperCase()}</span>
        </div>
        <div class="code-content">
    `;
    
    lines.forEach((line, index) => {
        const escapedLine = escapeHtml(line) || '&nbsp;';
        html += `
            <div class="code-line">
                <span class="line-number">${index + 1}</span>
                <span class="line-content">${escapedLine}</span>
            </div>
        `;
    });
    
    html += '</div>';
    elements.codeDisplay.innerHTML = html;
}

function formatCode(code, language) {
    if (language === 'html') {
        return formatHTML(code);
    } else if (language === 'css') {
        return formatCSS(code);
    } else if (language === 'javascript') {
        return formatJavaScript(code);
    }
    return code;
}

function formatHTML(html) {
    if (!html || html.trim().length === 0) return html;
    
    let formatted = '';
    let indent = 0;
    const indentSize = 2;
    
    let cleanHtml = html
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
    
    const parts = cleanHtml.split(/(<[^>]*>)/).filter(part => part.length > 0);
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i].trim();
        if (!part) continue;
        
        if (part.startsWith('</')) {
            indent = Math.max(0, indent - indentSize);
            formatted += ' '.repeat(indent) + part + '\n';
        } else if (part.startsWith('<')) {
            const tagMatch = part.match(/<(\w+)/);
            const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
            
            const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
            const isSelfClosing = part.endsWith('/>') || voidElements.includes(tagName);
            
            formatted += ' '.repeat(indent) + part + '\n';
            
            if (!isSelfClosing) {
                indent += indentSize;
            }
        } else {
            if (part.length > 0) {
                formatted += ' '.repeat(indent) + part + '\n';
            }
        }
    }
    
    return formatted.trim();
}

function formatCSS(css) {
    if (!css || css.trim().length === 0) return css;
    
    let formatted = '';
    let indent = 0;
    const indentSize = 2;
    
    let cleanCss = css
        .replace(/\s*{\s*/g, ' {\n')
        .replace(/;\s*/g, ';\n')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
    
    const lines = cleanCss.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        if (trimmed === '}') {
            indent = Math.max(0, indent - indentSize);
            formatted += ' '.repeat(indent) + trimmed + '\n';
        } else if (trimmed.endsWith('{')) {
            formatted += ' '.repeat(indent) + trimmed + '\n';
            indent += indentSize;
        } else {
            formatted += ' '.repeat(indent) + trimmed + '\n';
        }
    }
    
    return formatted.trim();
}

function formatJavaScript(js) {
    if (!js || js.trim().length === 0) return js;
    
    let formatted = '';
    let indent = 0;
    const indentSize = 2;
    
    const lines = js.split('\n');
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            formatted += '\n';
            continue;
        }
        
        if (trimmed.startsWith('}')) {
            indent = Math.max(0, indent - indentSize);
        }
        
        formatted += ' '.repeat(indent) + trimmed + '\n';
        
        if (trimmed.endsWith('{')) {
            indent += indentSize;
        }
    }
    
    return formatted.trim();
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

function shouldShowPreview(code) {
    if (!code) return false;
    const hasHtmlTags = /<\s*[a-zA-Z][^>]*>/i.test(code);
    return hasHtmlTags && code.trim().length > 0;
}

function showHtmlPreview(code) {
    elements.htmlPreview.classList.remove('hidden');
    
    const cleanCode = code.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    const previewDocument = createPreviewDocument(cleanCode);
    
    elements.previewFrame.srcdoc = previewDocument;
}

function createPreviewDocument(htmlCode) {
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
  ${htmlCode}
</body>
</html>`;
}

function togglePreviewExpand() {
    const container = document.querySelector('.preview-container');
    const button = elements.expandPreview;
    const isExpanded = container.classList.contains('expanded');
    
    if (isExpanded) {
        container.classList.remove('expanded');
        button.innerHTML = '<i data-lucide="external-link"></i> <span>Expand</span>';
    } else {
        container.classList.add('expanded');
        button.innerHTML = '<i data-lucide="external-link"></i> <span>Collapse</span>';
    }
    
    initializeLucideIcons();
}

// Answer handling
function handleAnswer(userAnswer) {
    if (!currentChallenge) return;
    
    // Update challenge with user answer
    currentChallenge.userAnswer = userAnswer;
    
    // Hide answer buttons and show reveal
    elements.answerButtons.classList.add('hidden');
    elements.answerReveal.classList.remove('hidden');
    
    // Update result display
    const isCorrect = userAnswer === currentChallenge.isCorrect;
    
    // Update result box
    const resultBox = elements.userResult;
    const resultHeader = resultBox.querySelector('.result-header');
    
    if (isCorrect) {
        resultBox.className = 'result-box correct';
        resultHeader.className = 'result-header correct';
        elements.resultIcon.setAttribute('data-lucide', 'check-circle');
        elements.resultText.textContent = '🎉 Correct!';
    } else {
        resultBox.className = 'result-box incorrect';
        resultHeader.className = 'result-header incorrect';
        elements.resultIcon.setAttribute('data-lucide', 'x-circle');
        elements.resultText.textContent = '❌ Incorrect!';
    }
    
    // Update answer badges
    elements.userAnswerBadge.textContent = userAnswer ? 'Correct' : 'Incorrect';
    elements.userAnswerBadge.className = `result-badge ${userAnswer ? 'correct' : 'incorrect'}`;
    
    elements.actualAnswerBadge.textContent = currentChallenge.isCorrect ? 'Correct' : 'Incorrect';
    elements.actualAnswerBadge.className = `result-badge ${currentChallenge.isCorrect ? 'correct' : 'incorrect'}`;
    
    // Update explanation
    elements.explanationTitle.textContent = currentChallenge.isCorrect ? '✅ Why it\'s correct:' : '❌ Why it\'s incorrect:';
    elements.explanationTitle.className = currentChallenge.isCorrect ? 'correct' : 'incorrect';
    elements.explanationText.textContent = currentChallenge.explanation;
    
    // Show additional info if available
    if (currentChallenge.additionalInfo) {
        elements.additionalInfo.classList.remove('hidden');
        elements.additionalInfoText.textContent = currentChallenge.additionalInfo;
    } else {
        elements.additionalInfo.classList.add('hidden');
    }
    
    // Save to history
    saveToHistory(currentChallenge);
    
    initializeLucideIcons();
}

// History functions
function saveToHistory(challenge) {
    challengeHistory.unshift(challenge);
    challengeHistory = challengeHistory.slice(0, 50); // Keep last 50
    localStorage.setItem('codeleap-history', JSON.stringify(challengeHistory));
}

function updateHistoryDisplay() {
    updateStats();
    updateHistoryList();
}

function updateStats() {
    const total = challengeHistory.length;
    const correct = challengeHistory.filter(c => c.userAnswer === c.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    elements.totalChallenges.textContent = total;
    elements.accuracyPercent.textContent = `${accuracy}%`;
    elements.correctAnswers.textContent = correct;
    elements.incorrectAnswers.textContent = total - correct;
    
    // By difficulty
    elements.easyCount.textContent = challengeHistory.filter(c => c.difficulty === 'easy').length;
    elements.mediumCount.textContent = challengeHistory.filter(c => c.difficulty === 'medium').length;
    elements.hardCount.textContent = challengeHistory.filter(c => c.difficulty === 'hard').length;
    
    // By language
    elements.jsCount.textContent = challengeHistory.filter(c => c.language === 'javascript').length;
    elements.htmlCount.textContent = challengeHistory.filter(c => c.language === 'html').length;
    elements.cssCount.textContent = challengeHistory.filter(c => c.language === 'css').length;
}

function updateHistoryList() {
    if (challengeHistory.length === 0) {
        elements.emptyHistory.classList.remove('hidden');
        elements.historyList.innerHTML = '';
        elements.historyList.appendChild(elements.emptyHistory);
        return;
    }
    
    elements.emptyHistory.classList.add('hidden');
    
    const historyHTML = challengeHistory.map(challenge => {
        const languageIcons = {
            javascript: '🟨',
            html: '🟧',
            css: '🟦'
        };
        
        const isCorrect = challenge.userAnswer === challenge.isCorrect;
        const resultIcon = isCorrect ? 'check-circle' : 'x-circle';
        const resultClass = isCorrect ? 'correct' : 'incorrect';
        
        const timestamp = new Date(challenge.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const codePreview = challenge.code.length > 100 
            ? challenge.code.substring(0, 100) + '...'
            : challenge.code;
        
        return `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-badges">
                        <div class="language-badge">
                            <span>${languageIcons[challenge.language]}</span>
                            <span>${challenge.language.charAt(0).toUpperCase() + challenge.language.slice(1)}</span>
                        </div>
                        <div class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty.toUpperCase()}</div>
                    </div>
                    <div class="history-result ${resultClass}">
                        <i data-lucide="${resultIcon}"></i>
                        <span class="history-timestamp">${timestamp}</span>
                    </div>
                </div>
                <p class="history-problem">${challenge.problem}</p>
                <div class="history-code">${escapeHtml(codePreview)}</div>
                <div class="history-details">
                    <strong>Your answer:</strong> ${challenge.userAnswer ? 'Correct' : 'Incorrect'} | 
                    <strong>Actual:</strong> ${challenge.isCorrect ? 'Correct' : 'Incorrect'}
                </div>
            </div>
        `;
    }).join('');
    
    elements.historyList.innerHTML = historyHTML;
    initializeLucideIcons();
}

// Update UI based on current state
function updateUI() {
    // Show/hide API key button
    if (apiKey) {
        elements.changeApiKey.classList.remove('hidden');
        elements.apiKeyRequired.classList.add('hidden');
        elements.generateChallenge.disabled = false;
    } else {
        elements.changeApiKey.classList.add('hidden');
        elements.apiKeyRequired.classList.remove('hidden');
        elements.generateChallenge.disabled = true;
    }
    
    // Update control labels
    updateControlLabels();
    
    // Update history if on history tab
    if (elements.historyTab.classList.contains('active')) {
        updateHistoryDisplay();
    }
}
