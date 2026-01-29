# 🇳🇱 Camikaze Goes Dutch

A fun, gamified Dutch learning web app built with love for Camille (aka Camikaze)! 

![Preview](https://img.shields.io/badge/Made%20with-❤️-red) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)

## 📱 Progressive Web App

**Install it like a real app!** Camikaze Goes Dutch is a full PWA:

- ✅ **Add to Home Screen** - Works on iOS, Android, and desktop
- ✅ **Works Offline** - Learn Dutch even without internet
- ✅ **App-like Experience** - Full screen, no browser UI
- ✅ **Auto Updates** - Always get the latest version

### How to Install

**On iPhone/iPad:**
1. Open the site in Safari
2. Tap the Share button (📤)
3. Tap "Add to Home Screen"
4. Tap "Add"

**On Android:**
1. Open in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home Screen"

**On Desktop (Chrome/Edge):**
1. Look for the install icon (⊕) in the address bar
2. Click "Install"

## ✨ Features

### 🎯 Exercise Types
- **Multiple Choice** - NL→FR and FR→NL vocabulary quizzes
- **Translation** - Translate sentences between French and Dutch
- **Fill in the Blank** - Complete sentences with the correct word
- **Drag & Drop Word Order** - Arrange words to form correct Dutch sentences
- **Flashcards** - Spaced repetition system for long-term memory

### 📚 Themes
- 🐴 **Chevaux & Équitation** - Horse riding vocabulary
- 🎉 **Sorties & Vie nocturne** - Going out and nightlife
- 🏠 **À la maison** - Around the house
- 🐱 **Animaux** - Animals (cats, geese, pets)
- 🎵 **Musique** - Music vocabulary
- 🍺 **Bar & Restaurant** - Dining and socializing
- 📝 **Grammaire** - Verbs, articles, and sentence structure

### 🎮 Gamification
- **XP System** - Earn experience points for correct answers
- **Levels** - Progress through levels as you learn
- **Streaks** - Keep your daily learning streak going
- **Hearts** - Don't lose all your hearts!
- **Achievements** - Unlock badges for milestones
- **Progress Tracking** - See your improvement over time

### 🔊 Extras
- **Text-to-Speech** - Hear Dutch pronunciation (using browser API)
- **Encouraging Messages** - Stay motivated with fun feedback
- **Offline Progress** - Data saved to localStorage
- **Mobile Friendly** - Works great on phones and tablets

## 🚀 Quick Start

### Local Development

1. Clone or download this repository
2. Open `index.html` in your browser
3. Start learning! 🎉

No build process or dependencies required - it's pure HTML/CSS/JS!

```bash
# Clone the repo
git clone https://github.com/yourusername/camikaze-goes-dutch.git

# Navigate to the folder
cd camikaze-goes-dutch

# Open in browser (macOS)
open index.html

# Or start a simple server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Deploy to Netlify

1. **Via Netlify UI:**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repo
   - Deploy settings: Leave defaults (no build command needed)
   - Click "Deploy site"

2. **Via Netlify CLI:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy from project folder
   cd camikaze-goes-dutch
   netlify deploy --prod
   ```

3. **Via Drag & Drop:**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag the entire `camikaze-goes-dutch` folder
   - Done! 🎉

## 📁 Project Structure

```
camikaze-goes-dutch/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles (cute & playful design)
├── js/
│   ├── app.js          # Main application logic
│   ├── exercises.js    # Exercise engine
│   ├── flashcards.js   # Flashcard system
│   ├── gamification.js # XP, levels, achievements
│   └── storage.js      # localStorage handling
├── data/
│   └── lessons.js      # All vocabulary and exercises
└── README.md           # This file!
```

## 🎨 Customization

### Adding New Vocabulary

Edit `data/lessons.js` and add to the `VOCABULARY` object:

```javascript
yourTheme: [
    { nl: 'Dutch word', fr: 'French translation', hint: 'optional hint' },
    // ... more words
]
```

### Adding New Themes

1. Add theme to `THEMES` array in `data/lessons.js`:
```javascript
{
    id: 'new-theme',
    name: 'Nouveau Thème',
    icon: '🆕',
    color: '#FF6B35',
    description: 'Description here',
    unlocked: true
}
```

2. Add vocabulary under the same id in `VOCABULARY`
3. Add sentences in `SENTENCES`

### Changing Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --primary: #FF6B35;      /* Main orange */
    --secondary: #4ECDC4;    /* Teal accent */
    --success: #2ECC71;      /* Green */
    --danger: #E74C3C;       /* Red */
    /* ... */
}
```

## 🔒 Privacy

All progress is stored locally in your browser using `localStorage`. No data is sent to any server. Your learning journey stays private!

To reset all progress:
```javascript
// Open browser console and run:
localStorage.removeItem('camikaze_dutch_progress');
location.reload();
```

## 💝 Credits

Built with love by Miguel for Camille ❤️

- Design inspired by Duolingo
- Font: [Nunito](https://fonts.google.com/specimen/Nunito) by Vernon Adams
- Icons: Native emoji (no dependencies!)

## 📝 License

MIT License - Feel free to use and modify!

---

**Veel succes met leren, Camikaze! 🇳🇱💪**

*Bonne chance pour ton apprentissage du néerlandais!*
