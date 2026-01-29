// ==========================================
// Camikaze Goes Dutch - Storage Manager
// Supabase backend for progress persistence
// ==========================================

const SUPABASE_URL = 'https://ctupvrjuayydshscyvne.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXB2cmp1YXl5ZHNoc2N5dm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzQwMzAsImV4cCI6MjA4NDg1MDAzMH0.Y7RxEnZMhvt4vpFlzxXFH-lCc11JRc8dytwj7wyAdGI';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const storage = {
    userId: null,
    userData: null,
    
    // Default user data structure
    getDefaultData() {
        return {
            username: 'Camikaze',
            avatar: '🦊',
            level: 1,
            total_xp: 0,
            current_level_xp: 0,
            xp_to_next_level: 100,
            streak: 0,
            last_active_date: null,
            stats: {
                totalExercises: 0,
                correctAnswers: 0,
                lessonsCompleted: 0,
                themesExplored: [],
                totalStudyTime: 0,
                hasPerfectLesson: false,
                studiedLateNight: false,
                flashcardsLearned: 0
            },
            theme_progress: {
                'horses': 0,
                'going-out': 0,
                'house': 0,
                'animals': 0,
                'music': 0,
                'bar-restaurant': 0,
                'grammar': 0
            },
            exercise_history: [],
            flashcards: {},
            achievements: [],
            settings: {
                soundEnabled: true,
                ttsEnabled: true
            }
        };
    },
    
    // Initialize - get or create user
    async init() {
        // Check localStorage for user ID
        let userId = localStorage.getItem('camikaze_user_id');
        
        if (!userId) {
            // Create new user
            const { data, error } = await supabase
                .from('camikaze_users')
                .insert([this.getDefaultData()])
                .select()
                .single();
            
            if (error) {
                console.error('Error creating user:', error);
                // Fallback to localStorage
                return this.loadFromLocalStorage();
            }
            
            userId = data.id;
            localStorage.setItem('camikaze_user_id', userId);
        }
        
        this.userId = userId;
        return await this.load();
    },
    
    // Load data from Supabase
    async load() {
        if (!this.userId) {
            return this.loadFromLocalStorage();
        }
        
        try {
            const { data, error } = await supabase
                .from('camikaze_users')
                .select('*')
                .eq('id', this.userId)
                .single();
            
            if (error) throw error;
            
            // Convert DB format to app format
            this.userData = {
                ...this.getDefaultData(),
                ...data,
                stats: data.stats || this.getDefaultData().stats,
                theme_progress: data.theme_progress || this.getDefaultData().theme_progress,
                flashcards: data.flashcards || {},
                achievements: data.achievements || [],
                settings: data.settings || this.getDefaultData().settings
            };
            
            // Also save to localStorage as backup
            localStorage.setItem('camikaze_dutch_progress', JSON.stringify(this.userData));
            
            return this.userData;
        } catch (e) {
            console.error('Error loading from Supabase:', e);
            return this.loadFromLocalStorage();
        }
    },
    
    // Fallback localStorage load
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('camikaze_dutch_progress');
            if (stored) {
                this.userData = { ...this.getDefaultData(), ...JSON.parse(stored) };
                return this.userData;
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
        this.userData = this.getDefaultData();
        return this.userData;
    },
    
    // Save data to Supabase
    async save(data) {
        this.userData = data;
        
        // Always save to localStorage as backup
        localStorage.setItem('camikaze_dutch_progress', JSON.stringify(data));
        
        if (!this.userId) return true;
        
        try {
            const { error } = await supabase
                .from('camikaze_users')
                .update({
                    username: data.username,
                    avatar: data.avatar,
                    level: data.level,
                    total_xp: data.total_xp || data.totalXP,
                    current_level_xp: data.current_level_xp || data.currentLevelXP,
                    xp_to_next_level: data.xp_to_next_level || data.xpToNextLevel,
                    streak: data.streak,
                    last_active_date: data.last_active_date || data.lastActiveDate,
                    stats: data.stats,
                    theme_progress: data.theme_progress || data.themeProgress,
                    exercise_history: data.exercise_history || data.exerciseHistory,
                    flashcards: data.flashcards,
                    achievements: data.achievements,
                    settings: data.settings,
                    updated_at: new Date().toISOString()
                })
                .eq('id', this.userId);
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error('Error saving to Supabase:', e);
            return false;
        }
    },
    
    // Update specific field(s)
    async update(updates) {
        const data = this.userData || await this.load();
        const updated = { ...data, ...updates };
        await this.save(updated);
        return updated;
    },
    
    // Add XP and handle level ups
    async addXP(amount) {
        const data = this.userData || await this.load();
        data.total_xp = (data.total_xp || data.totalXP || 0) + amount;
        data.current_level_xp = (data.current_level_xp || data.currentLevelXP || 0) + amount;
        
        let leveledUp = false;
        const xpToNext = data.xp_to_next_level || data.xpToNextLevel || 100;
        
        while (data.current_level_xp >= xpToNext) {
            data.current_level_xp -= xpToNext;
            data.level++;
            data.xp_to_next_level = this.calculateXPForLevel(data.level);
            leveledUp = true;
        }
        
        await this.save(data);
        return { data, leveledUp };
    },
    
    calculateXPForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    },
    
    // Update streak
    async updateStreak() {
        const data = this.userData || await this.load();
        const today = new Date().toDateString();
        const lastActive = data.last_active_date || data.lastActiveDate;
        
        if (lastActive !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActive === yesterday.toDateString()) {
                data.streak++;
            } else if (lastActive !== today) {
                data.streak = 1;
            }
            
            data.last_active_date = today;
            await this.save(data);
        }
        
        return data.streak;
    },
    
    // Record exercise result
    async recordExercise(themeId, exerciseType, correct, wordOrSentence) {
        const data = this.userData || await this.load();
        
        data.stats.totalExercises++;
        if (correct) data.stats.correctAnswers++;
        
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 5) {
            data.stats.studiedLateNight = true;
        }
        
        if (!data.stats.themesExplored.includes(themeId)) {
            data.stats.themesExplored.push(themeId);
        }
        
        const history = data.exercise_history || data.exerciseHistory || [];
        history.push({
            theme: themeId,
            type: exerciseType,
            correct,
            item: wordOrSentence,
            timestamp: Date.now()
        });
        
        data.exercise_history = history.slice(-100);
        
        await this.save(data);
        return data;
    },
    
    // Update theme progress
    async updateThemeProgress(themeId, progress) {
        const data = this.userData || await this.load();
        const themeProgress = data.theme_progress || data.themeProgress || {};
        themeProgress[themeId] = Math.min(100, Math.max(0, progress));
        data.theme_progress = themeProgress;
        await this.save(data);
        return data;
    },
    
    // Complete a lesson
    async completeLesson(themeId, accuracy) {
        const data = this.userData || await this.load();
        data.stats.lessonsCompleted++;
        
        const themeProgress = data.theme_progress || data.themeProgress || {};
        const currentProgress = themeProgress[themeId] || 0;
        themeProgress[themeId] = Math.min(100, currentProgress + 15);
        data.theme_progress = themeProgress;
        
        if (accuracy === 100) {
            data.stats.hasPerfectLesson = true;
        }
        
        await this.save(data);
        return data;
    },
    
    // Flashcard spaced repetition
    async updateFlashcard(cardId, difficulty) {
        const data = this.userData || await this.load();
        
        if (!data.flashcards) data.flashcards = {};
        
        if (!data.flashcards[cardId]) {
            data.flashcards[cardId] = {
                easeFactor: 2.5,
                interval: 1,
                repetitions: 0,
                nextReview: Date.now()
            };
            data.stats.flashcardsLearned++;
        }
        
        const card = data.flashcards[cardId];
        
        if (difficulty === 'easy') {
            card.repetitions++;
            card.interval = card.interval * card.easeFactor;
            card.easeFactor = Math.min(2.5, card.easeFactor + 0.15);
        } else if (difficulty === 'medium') {
            card.repetitions++;
            card.interval = card.interval * 1.2;
        } else {
            card.repetitions = 0;
            card.interval = 1;
            card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
        }
        
        card.nextReview = Date.now() + (card.interval * 24 * 60 * 60 * 1000);
        
        await this.save(data);
        return data;
    },
    
    // Get weak points
    getWeakPoints() {
        const data = this.userData || this.loadFromLocalStorage();
        const history = data.exercise_history || data.exerciseHistory || [];
        const mistakes = {};
        
        history.filter(e => !e.correct).forEach(e => {
            const key = `${e.theme}:${e.item}`;
            mistakes[key] = (mistakes[key] || 0) + 1;
        });
        
        return Object.entries(mistakes)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([key]) => {
                const [theme, item] = key.split(':');
                return { theme, item };
            });
    },
    
    // Get flashcards due for review
    getDueFlashcards(themeId) {
        const data = this.userData || this.loadFromLocalStorage();
        const now = Date.now();
        const flashcards = data.flashcards || {};
        
        return Object.entries(flashcards)
            .filter(([id, card]) => {
                if (themeId && !id.startsWith(themeId)) return false;
                return card.nextReview <= now;
            })
            .map(([id, card]) => ({ id, ...card }));
    },
    
    // Unlock achievement
    async unlockAchievement(achievementId) {
        const data = this.userData || await this.load();
        
        if (!data.achievements) data.achievements = [];
        
        if (!data.achievements.includes(achievementId)) {
            data.achievements.push(achievementId);
            await this.save(data);
            return true;
        }
        
        return false;
    },
    
    // Check all achievements
    async checkAchievements() {
        const data = this.userData || await this.load();
        const newlyUnlocked = [];
        
        if (!data.achievements) data.achievements = [];
        
        const checks = {
            'first_lesson': () => data.stats.lessonsCompleted >= 1,
            'streak_3': () => data.streak >= 3,
            'streak_7': () => data.streak >= 7,
            'xp_100': () => (data.total_xp || data.totalXP) >= 100,
            'xp_500': () => (data.total_xp || data.totalXP) >= 500,
            'xp_1000': () => (data.total_xp || data.totalXP) >= 1000,
            'perfect_lesson': () => data.stats.hasPerfectLesson,
            'all_themes': () => data.stats.themesExplored.length >= 7,
            'horse_master': () => (data.theme_progress || data.themeProgress)['horses'] >= 100,
            'party_animal': () => (data.theme_progress || data.themeProgress)['going-out'] >= 100,
            'flashcard_master': () => data.stats.flashcardsLearned >= 50,
            'night_owl': () => data.stats.studiedLateNight
        };
        
        for (const [id, check] of Object.entries(checks)) {
            if (!data.achievements.includes(id) && check()) {
                data.achievements.push(id);
                const achievement = typeof ACHIEVEMENTS !== 'undefined' 
                    ? ACHIEVEMENTS.find(a => a.id === id) 
                    : { id };
                newlyUnlocked.push(achievement);
            }
        }
        
        if (newlyUnlocked.length > 0) {
            await this.save(data);
        }
        
        return newlyUnlocked;
    },
    
    // Reset all progress
    async reset() {
        localStorage.removeItem('camikaze_dutch_progress');
        
        if (this.userId) {
            const defaultData = this.getDefaultData();
            await supabase
                .from('camikaze_users')
                .update(defaultData)
                .eq('id', this.userId);
        }
        
        this.userData = this.getDefaultData();
        return this.userData;
    }
};
