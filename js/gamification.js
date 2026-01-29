// ==========================================
// Camikaze Goes Dutch - Gamification System
// XP, levels, streaks, achievements
// ==========================================

const gamification = {
    // XP rewards per action
    XP_REWARDS: {
        correctAnswer: 10,
        perfectLesson: 50,
        streakBonus: 5, // per day in streak
        firstTryCorrect: 5,
        flashcardEasy: 5,
        flashcardMedium: 8,
        flashcardHard: 3
    },
    
    // Initialize gamification displays
    async init() {
        await this.updateAllDisplays();
    },
    
    // Update all UI displays
    async updateAllDisplays() {
        const data = await storage.load();
        this.updateHeader(data);
        this.updateXPBar(data);
        this.updateStats(data);
        this.updateAchievements(data);
    },
    
    // Update header stats
    updateHeader(data) {
        document.getElementById('user-level').textContent = `Niveau ${data.level}`;
        document.getElementById('streak-count').textContent = data.streak;
        document.getElementById('total-xp').textContent = data.totalXP;
    },
    
    // Update XP progress bar
    updateXPBar(data) {
        const progress = (data.currentLevelXP / data.xpToNextLevel) * 100;
        const progressBar = document.getElementById('xp-progress');
        const xpText = document.getElementById('xp-to-next');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        if (xpText) {
            xpText.textContent = `${data.currentLevelXP} / ${data.xpToNextLevel} XP`;
        }
    },
    
    // Update stats tab
    updateStats(data) {
        const accuracy = data.stats.totalExercises > 0 
            ? Math.round((data.stats.correctAnswers / data.stats.totalExercises) * 100)
            : 0;
        
        const statsStreak = document.getElementById('stats-streak');
        const statsXP = document.getElementById('stats-xp');
        const statsCompleted = document.getElementById('stats-completed');
        const statsAccuracy = document.getElementById('stats-accuracy');
        
        if (statsStreak) statsStreak.textContent = data.streak;
        if (statsXP) statsXP.textContent = data.totalXP;
        if (statsCompleted) statsCompleted.textContent = data.stats.totalExercises;
        if (statsAccuracy) statsAccuracy.textContent = `${accuracy}%`;
    },
    
    // Update achievements display
    updateAchievements(data) {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;
        
        grid.innerHTML = ACHIEVEMENTS.map(achievement => {
            const unlocked = data.achievements.includes(achievement.id);
            return `
                <div class="achievement ${unlocked ? 'unlocked' : ''}" title="${achievement.description}">
                    <span class="achievement-icon">${achievement.icon}</span>
                    <span class="achievement-name">${achievement.name}</span>
                </div>
            `;
        }).join('');
    },
    
    // Award XP with animation
    async awardXP(amount, reason = '') {
        const { data, leveledUp } = await storage.addXP(amount);
        
        // Show XP toast
        this.showXPToast(amount, reason);
        
        // Update displays
        this.updateHeader(data);
        this.updateXPBar(data);
        this.updateStats(data);
        
        // Check for level up
        if (leveledUp) {
            this.showLevelUp(data.level);
        }
        
        // Check achievements
        const newAchievements = await storage.checkAchievements();
        newAchievements.forEach(achievement => {
            this.showAchievementUnlocked(achievement);
        });
        
        return data;
    },
    
    // Show XP gain toast
    showXPToast(amount, reason) {
        const message = reason ? `+${amount} XP - ${reason}` : `+${amount} XP`;
        this.showToast('xp', '💎', message);
    },
    
    // Show level up celebration
    showLevelUp(newLevel) {
        const levelBanner = document.getElementById('level-up-banner');
        if (levelBanner) {
            levelBanner.classList.remove('hidden');
            levelBanner.innerHTML = `
                <span class="level-up-icon">⭐</span>
                <span>Niveau ${newLevel} atteint!</span>
            `;
        }
        
        this.showToast('success', '🎉', `Félicitations! Tu es maintenant niveau ${newLevel}!`);
        this.playSound('levelup');
        this.createConfetti();
    },
    
    // Show achievement unlocked
    showAchievementUnlocked(achievement) {
        this.showToast('success', achievement.icon, `Badge débloqué: ${achievement.name}!`);
        this.playSound('achievement');
    },
    
    // Generic toast notification
    showToast(type, icon, message) {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // Get random encouragement
    getEncouragement(correct) {
        const messages = correct ? ENCOURAGEMENTS.correct : ENCOURAGEMENTS.incorrect;
        return messages[Math.floor(Math.random() * messages.length)];
    },
    
    // Get streak encouragement
    getStreakEncouragement() {
        return ENCOURAGEMENTS.streak[Math.floor(Math.random() * ENCOURAGEMENTS.streak.length)];
    },
    
    // Create confetti effect
    createConfetti() {
        const colors = ['#FF6B35', '#4ECDC4', '#FFD93D', '#E91E63', '#9B59B6'];
        const container = document.body;
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: 100vh;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                pointer-events: none;
                z-index: 9999;
                animation: confetti 1.5s ease-out forwards;
            `;
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 1500);
        }
        
        // Add confetti animation if not exists
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Play sound effect
    playSound(type) {
        const data = storage.load();
        if (!data.settings.soundEnabled) return;
        
        // Using Web Audio API for simple sounds
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch (type) {
                case 'correct':
                    oscillator.frequency.value = 523.25; // C5
                    gainNode.gain.value = 0.3;
                    oscillator.start();
                    setTimeout(() => {
                        oscillator.frequency.value = 659.25; // E5
                    }, 100);
                    setTimeout(() => {
                        oscillator.frequency.value = 783.99; // G5
                    }, 200);
                    setTimeout(() => oscillator.stop(), 300);
                    break;
                    
                case 'incorrect':
                    oscillator.frequency.value = 200;
                    gainNode.gain.value = 0.2;
                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 200);
                    break;
                    
                case 'levelup':
                    oscillator.frequency.value = 523.25;
                    gainNode.gain.value = 0.3;
                    oscillator.start();
                    setTimeout(() => oscillator.frequency.value = 659.25, 100);
                    setTimeout(() => oscillator.frequency.value = 783.99, 200);
                    setTimeout(() => oscillator.frequency.value = 1046.50, 300);
                    setTimeout(() => oscillator.stop(), 500);
                    break;
                    
                case 'achievement':
                    // Fanfare
                    oscillator.type = 'triangle';
                    oscillator.frequency.value = 392; // G4
                    gainNode.gain.value = 0.3;
                    oscillator.start();
                    setTimeout(() => oscillator.frequency.value = 523.25, 150);
                    setTimeout(() => oscillator.frequency.value = 659.25, 300);
                    setTimeout(() => oscillator.frequency.value = 783.99, 450);
                    setTimeout(() => oscillator.stop(), 600);
                    break;
            }
        } catch (e) {
            // Audio not supported
            console.log('Audio not supported');
        }
    },
    
    // Text-to-speech for Dutch words
    speak(text, lang = 'nl-NL') {
        const data = storage.load();
        if (!data.settings.ttsEnabled) return;
        
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = 0.9; // Slightly slower for learning
            
            // Try to find a Dutch voice
            const voices = window.speechSynthesis.getVoices();
            const dutchVoice = voices.find(v => v.lang.startsWith('nl'));
            if (dutchVoice) {
                utterance.voice = dutchVoice;
            }
            
            window.speechSynthesis.speak(utterance);
        }
    },
    
    // Calculate lesson completion bonus
    calculateLessonBonus(correctCount, totalCount, timeSeconds) {
        let bonus = 0;
        const accuracy = (correctCount / totalCount) * 100;
        
        // Base XP
        bonus += correctCount * this.XP_REWARDS.correctAnswer;
        
        // Perfect lesson bonus
        if (accuracy === 100) {
            bonus += this.XP_REWARDS.perfectLesson;
        }
        
        // Speed bonus (under 30 seconds per question)
        if (timeSeconds < totalCount * 30) {
            bonus += 20;
        }
        
        // Streak bonus
        const data = storage.load();
        bonus += data.streak * this.XP_REWARDS.streakBonus;
        
        return bonus;
    }
};
