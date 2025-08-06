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

## Quick Start

### Option 1: GitHub Pages (Recommended)

1. **Fork this repository** or **download the files**
2. **Upload to your GitHub repository**:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

3. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Access your site**:
   - Your site will be available at: `https://yourusername.github.io/your-repo-name`

### Option 2: Local Development

1. **Download the files** to a folder on your computer
2. **Open `index.html`** in any modern web browser
3. **Start generating challenges!**

## How It Works

1. **Open the website** in your browser
2. **Select difficulty and language** for your challenge
3. **Click "Generate Challenge"** to create a unique coding challenge
4. **Analyze the code** and decide if it's correct or incorrect
5. **View the explanation** and learn from the results
6. **Track your progress** in the History tab

## Built-in AI Integration

The application comes with a **default Groq API key** that provides:
- **Free AI-powered challenges** for all users
- **No setup required** - works immediately
- **Fallback challenges** if the API is unavailable
- **Rate limiting protection** with curated alternatives

### API Key Information

- **Default Key**: The app includes a working Groq API key
- **Free Tier**: Generous limits for learning and practice
- **Fallback System**: High-quality curated challenges when needed
- **No Registration**: Start using immediately

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
To add new challenge types or modify existing ones, edit the fallback challenges in the `getDynamicFallbackChallenge()` function in `script.js`.

### Styling
All styles are contained in `styles.css` with CSS custom properties for easy theming and customization.

## Troubleshooting

### Common Issues
- **Challenges not generating**: The app will automatically use fallback challenges
- **Display issues**: Clear your browser cache and ensure JavaScript is enabled
- **Theme not switching**: Try refreshing the page

### Rate Limiting
- The free tier has usage limits
- Fallback challenges are automatically used when needed
- All challenges are educational and high-quality

## Contributing

This is a static web application that can be easily modified:

1. Fork the repository
2. Make your changes to the HTML, CSS, or JavaScript files
3. Test locally by opening `index.html` in a browser
4. Deploy to GitHub Pages

## Educational Use

Perfect for:
- **Coding bootcamps** and educational institutions
- **Self-directed learning** and skill improvement
- **Interview preparation** and debugging practice
- **Team training** and code review exercises

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the browser console for error messages
- Ensure JavaScript is enabled in your browser
- Try refreshing the page or clearing browser storage
- The app includes comprehensive fallback systems

---

**Start improving your coding skills with CodeLeap!** 🚀

### Quick Deploy Checklist

- [ ] Upload `index.html`, `styles.css`, `script.js` to your repository
- [ ] Enable GitHub Pages in repository settings
- [ ] Access your live site and start coding!

No additional setup, API keys, or configuration required - everything works out of the box!
