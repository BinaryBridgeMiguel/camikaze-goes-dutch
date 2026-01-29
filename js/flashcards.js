// ==========================================
// Camikaze Goes Dutch - Flashcard System
// Spaced repetition flashcards
// ==========================================

const flashcards = {
    currentTheme: null,
    cards: [],
    currentIndex: 0,
    isFlipped: false,
    sessionStreak: 0,
    
    // Start flashcard session
    start(themeId) {
        this.currentTheme = themeId;
        this.currentIndex = 0;
        this.sessionStreak = 0;
        this.isFlipped = false;
        
        // Get cards for this theme
        const vocab = VOCABULARY[themeId] || [];
        
        // Check for cards due for review (spaced repetition)
        const dueCards = storage.getDueFlashcards(themeId);
        const dueCardIds = new Set(dueCards.map(c => c.id));
        
        // Mix due cards with new cards
        this.cards = vocab.map(word => ({
            id: `${themeId}:${word.nl}`,
            front: word.nl,
            back: word.fr,
            hint: word.hint,
            isDue: dueCardIds.has(`${themeId}:${word.nl}`)
        }));
        
        // Prioritize due cards, then shuffle
        this.cards.sort((a, b) => {
            if (a.isDue && !b.isDue) return -1;
            if (!a.isDue && b.isDue) return 1;
            return Math.random() - 0.5;
        });
        
        // Limit to 10 cards per session
        this.cards = this.cards.slice(0, 10);
        
        // Show flashcard screen
        app.showScreen('flashcard-screen');
        this.showCurrentCard();
        this.updateProgress();
    },
    
    // Show current card
    showCurrentCard() {
        const card = this.cards[this.currentIndex];
        if (!card) {
            this.endSession();
            return;
        }
        
        const flashcardEl = document.getElementById('flashcard');
        const frontText = document.getElementById('flashcard-front-text');
        const backText = document.getElementById('flashcard-back-text');
        
        // Reset flip state
        this.isFlipped = false;
        flashcardEl.classList.remove('flipped');
        
        // Set content
        frontText.textContent = card.front;
        backText.textContent = card.back;
        
        this.updateProgress();
    },
    
    // Flip the card
    flipCard() {
        const flashcardEl = document.getElementById('flashcard');
        this.isFlipped = !this.isFlipped;
        flashcardEl.classList.toggle('flipped', this.isFlipped);
        
        // Speak the word when flipped to back (Dutch)
        if (this.isFlipped) {
            const card = this.cards[this.currentIndex];
            if (card) {
                gamification.speak(card.front, 'nl-NL');
            }
        }
    },
    
    // Speak the current card
    speak(side) {
        const card = this.cards[this.currentIndex];
        if (!card) return;
        
        if (side === 'front') {
            gamification.speak(card.front, 'nl-NL');
        } else {
            gamification.speak(card.back, 'fr-FR');
        }
    },
    
    // Rate the card (spaced repetition)
    rateCard(difficulty) {
        const card = this.cards[this.currentIndex];
        if (!card) return;
        
        // Update spaced repetition data
        storage.updateFlashcard(card.id, difficulty);
        
        // Award XP based on difficulty
        let xp = 0;
        switch (difficulty) {
            case 'easy':
                xp = gamification.XP_REWARDS.flashcardEasy;
                this.sessionStreak++;
                break;
            case 'medium':
                xp = gamification.XP_REWARDS.flashcardMedium;
                this.sessionStreak++;
                break;
            case 'hard':
                xp = gamification.XP_REWARDS.flashcardHard;
                this.sessionStreak = 0;
                break;
        }
        
        if (xp > 0) {
            gamification.awardXP(xp);
        }
        
        // Sound feedback
        if (difficulty !== 'hard') {
            gamification.playSound('correct');
        }
        
        // Update streak display
        this.updateStreak();
        
        // Go to next card
        this.currentIndex++;
        if (this.currentIndex >= this.cards.length) {
            this.endSession();
        } else {
            this.showCurrentCard();
        }
    },
    
    // Update progress display
    updateProgress() {
        const progressEl = document.getElementById('flashcard-progress');
        if (progressEl) {
            progressEl.textContent = `${this.currentIndex + 1} / ${this.cards.length}`;
        }
    },
    
    // Update streak display
    updateStreak() {
        const streakEl = document.getElementById('flashcard-streak');
        if (streakEl) {
            streakEl.textContent = this.sessionStreak;
        }
    },
    
    // End flashcard session
    endSession() {
        // Show completion message
        gamification.showToast('success', '🃏', `Super! ${this.cards.length} cartes étudiées!`);
        
        // Go back to dashboard
        app.goToDashboard();
    },
    
    // Get cards due for review (for dashboard indicator)
    getDueCount(themeId = null) {
        return storage.getDueFlashcards(themeId).length;
    }
};
