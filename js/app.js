// ==========================================
// Camikaze Goes Dutch - Main Application
// Entry point and navigation
// ==========================================

const app = {
    currentScreen: 'splash-screen',
    currentTab: 'lessons',
    
    // Initialize the app
    async init() {
        // Initialize Supabase storage and load user data
        await storage.init();
        
        // Update streak
        await storage.updateStreak();
        
        // Initialize displays
        gamification.init();
        
        // Render themes
        this.renderThemes();
        this.renderFlashcardThemes();
        
        // Load voices for TTS
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
        }
        
        console.log('🇳🇱 Camikaze Goes Dutch initialized!');
    },
    
    // Start the app (from splash screen)
    async startApp() {
        this.showScreen('dashboard');
        await this.init();
    },
    
    // Show a screen
    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        }
        
        // Update displays if going to dashboard
        if (screenId === 'dashboard') {
            gamification.updateAllDisplays();
            this.renderThemes();
        }
    },
    
    // Switch tab on dashboard
    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
        
        this.currentTab = tabId;
    },
    
    // Render theme cards
    renderThemes() {
        const grid = document.getElementById('theme-grid');
        if (!grid) return;
        
        const data = storage.load();
        
        grid.innerHTML = THEMES.map(theme => {
            const progress = data.themeProgress[theme.id] || 0;
            const isCompleted = progress >= 100;
            
            return `
                <div class="theme-card ${isCompleted ? 'completed' : ''}" 
                     onclick="app.startTheme('${theme.id}')"
                     style="--theme-color: ${theme.color}">
                    ${isCompleted ? '<span class="theme-badge">✅</span>' : ''}
                    <span class="theme-icon">${theme.icon}</span>
                    <span class="theme-name">${theme.name}</span>
                    <span class="theme-progress">${progress}%</span>
                    <div class="theme-progress-bar">
                        <div class="theme-progress-fill" style="width: ${progress}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Render flashcard theme selection
    renderFlashcardThemes() {
        const grid = document.getElementById('flashcard-themes');
        if (!grid) return;
        
        grid.innerHTML = THEMES.map(theme => {
            const dueCount = flashcards.getDueCount(theme.id);
            
            return `
                <div class="theme-card" onclick="flashcards.start('${theme.id}')">
                    ${dueCount > 0 ? `<span class="theme-badge">🔔${dueCount}</span>` : ''}
                    <span class="theme-icon">${theme.icon}</span>
                    <span class="theme-name">${theme.name}</span>
                </div>
            `;
        }).join('');
    },
    
    // Start a theme lesson
    startTheme(themeId) {
        exercises.startLesson(themeId);
    },
    
    // Start practice mode
    startPractice(mode) {
        exercises.startPractice(mode);
    },
    
    // Exit lesson (with confirmation)
    exitLesson() {
        if (exercises.currentExerciseIndex > 0) {
            if (confirm('Tu veux vraiment quitter? Ta progression sera perdue.')) {
                this.goToDashboard();
            }
        } else {
            this.goToDashboard();
        }
    },
    
    // Exit flashcards
    exitFlashcards() {
        this.goToDashboard();
    },
    
    // Go to dashboard
    goToDashboard() {
        this.showScreen('dashboard');
        gamification.updateAllDisplays();
        this.renderThemes();
        this.renderFlashcardThemes();
    },
    
    // Show results screen
    showResults(results) {
        this.showScreen('results-screen');
        
        // Update results display
        document.getElementById('result-xp').textContent = `+${results.xp}`;
        document.getElementById('result-accuracy').textContent = `${results.accuracy}%`;
        document.getElementById('result-time').textContent = this.formatTime(results.time);
        
        // Update animation based on performance
        const animation = document.getElementById('results-animation');
        const title = document.getElementById('results-title');
        const subtitle = document.getElementById('results-subtitle');
        
        if (results.accuracy === 100) {
            animation.textContent = '🏆';
            title.textContent = 'Parfait!';
            subtitle.textContent = 'Incroyable, Camikaze! Pas une seule erreur!';
        } else if (results.accuracy >= 80) {
            animation.textContent = '🎉';
            title.textContent = 'Super travail!';
            subtitle.textContent = 'Tu progresses vraiment bien!';
        } else if (results.accuracy >= 60) {
            animation.textContent = '👍';
            title.textContent = 'Bien joué!';
            subtitle.textContent = 'Continue comme ça!';
        } else {
            animation.textContent = '💪';
            title.textContent = 'Pas mal!';
            subtitle.textContent = 'La pratique rend parfait!';
        }
        
        // Check for level up
        const data = storage.load();
        const levelBanner = document.getElementById('level-up-banner');
        // Level up banner is handled by gamification.awardXP
    },
    
    // Continue to next lesson in theme
    continueLesson() {
        if (exercises.currentLesson && exercises.currentLesson !== 'practice') {
            exercises.startLesson(exercises.currentLesson);
        } else {
            this.goToDashboard();
        }
    },
    
    // Format time (seconds to mm:ss)
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Small delay for splash screen effect
    setTimeout(() => {
        // Auto-start if returning user
        const data = storage.load();
        if (data.stats.lessonsCompleted > 0) {
            app.startApp();
        }
    }, 500);
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Enter to continue on feedback
    if (e.key === 'Enter' && app.currentScreen === 'lesson-screen') {
        const feedbackContainer = document.getElementById('feedback-container');
        if (feedbackContainer && feedbackContainer.classList.contains('visible')) {
            exercises.nextExercise();
        }
    }
    
    // Space to flip flashcard
    if (e.key === ' ' && app.currentScreen === 'flashcard-screen') {
        e.preventDefault();
        flashcards.flipCard();
    }
    
    // 1, 2, 3 for flashcard rating
    if (app.currentScreen === 'flashcard-screen' && flashcards.isFlipped) {
        if (e.key === '1') flashcards.rateCard('hard');
        if (e.key === '2') flashcards.rateCard('medium');
        if (e.key === '3') flashcards.rateCard('easy');
    }
});

// Service Worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Could register a service worker here for PWA support
        // navigator.serviceWorker.register('/sw.js');
    });
}
