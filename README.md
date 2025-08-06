# CodeLeap - AI Coding Challenges

A static web application that generates unique coding challenges using AI to help developers improve their debugging and code analysis skills.

## Features

- **AI-Generated Challenges**: Unique JavaScript, HTML, and CSS challenges powered by Groq AI
- **Multiple Difficulty Levels**: Easy, Medium, and Hard challenges
- **Interactive Code Analysis**: Analyze code snippets and determine if they're correct
- **Live HTML Preview**: See HTML code rendered in real-time
- **Progress Tracking**: Track your accuracy and challenge history
- **Dark/Light Theme**: Toggle between themes for comfortable viewing
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Setup Instructions

### 1. Get a Groq API Key

1. Visit [console.groq.com/keys](https://console.groq.com/keys)
2. Sign up for a free account
3. Generate a new API key (starts with `gsk_`)
4. Copy the API key for use in the application

### 2. Deploy to GitHub Pages

1. **Fork or Download** this repository
2. **Upload files** to your GitHub repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your site**:
   - Your site will be available at: `https://yourusername.github.io/your-repo-name`

### 3. Using the Application

1. **Open the website** in your browser
2. **Enter your Groq API key** when prompted
3. **Select difficulty and language** for your challenge
4. **Click "Generate Challenge"** to create a unique coding challenge
5. **Analyze the code** and decide if it's correct or incorrect
6. **View the explanation** and learn from the results
7. **Track your progress** in the History tab

## API Key Information

### Free Tier Limits
- Groq offers a generous free tier with rate limits
- If you hit rate limits, the app will use curated fallback challenges
- For unlimited usage, consider upgrading to Groq Pro

### Security
- Your API key is stored locally in your browser
- It's never sent to our servers or stored remotely
- You can change or remove your API key at any time

## File Structure

\`\`\`
codeleap/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles and themes
├── script.js           # JavaScript functionality
└── README.md           # This documentation
\`\`\`

## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No frameworks or dependencies
- **Groq AI API**: For generating unique coding challenges
- **Lucide Icons**: Beautiful, consistent icons

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Themes
The application supports light and dark themes. You can modify the CSS custom properties in `styles.css` to create your own color schemes.

### Challenge Types
To add new challenge types or modify existing ones, edit the fallback challenges in the `getFallbackChallenge()` function in `script.js`.

### Styling
All styles are contained in `styles.css` with CSS custom properties for easy theming and customization.

## Troubleshooting

### API Key Issues
- Ensure your API key starts with `gsk_`
- Check that your Groq account has available credits
- Verify your internet connection

### Rate Limiting
- Free tier has usage limits
- Wait for limits to reset or upgrade your Groq plan
- Fallback challenges will be used when rate limited

### Display Issues
- Clear your browser cache
- Ensure JavaScript is enabled
- Check browser console for errors

## Contributing

This is a static web application that can be easily modified:

1. Fork the repository
2. Make your changes
3. Test locally by opening `index.html` in a browser
4. Deploy to GitHub Pages

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the browser console for error messages
- Ensure your API key is valid
- Try refreshing the page
- Clear browser storage if needed

---

**Enjoy improving your coding skills with CodeLeap!** 🚀
