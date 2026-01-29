// ==========================================
// Camikaze Goes Dutch - Storage Manager
// Supabase cloud storage with localStorage fallback
// ==========================================

const SUPABASE_URL = 'https://ctupvrjuayydshscyvne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dXB2cmp1YXl5ZHNoc2N5dm5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNzQwMzAsImV4cCI6MjA4NDg1MDAzMH0.Y7RxEnZMhvt4vpFlzxXFH-lCc11JRc8dytwj7wyAdGI';

const storage = {
    LOCAL_STORAGE_KEY: 'camikaze_dutch_progress',
    userId: null,
    isOnline: navigator.onLine,
    syncQueue: [], // Queue for offline changes
    
    // Initialize storage system
    async init() {
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Try to get or create user
        await this.initUser();
        
        // Sync any pending changes
        if (this.isOnline) {
            await this.syncPendingChanges();
        }
        
        return this;
    },
    
    // Initialize user (check localStorage for existing session)
    async initUser() {
        // Check for existing user ID in localStorage
        let userId = localStorage.getItem('camikaze_user_id');
        
        if (!userId) {
            // Create or get default user (Camille)
            try {
                const { data, error } = await this.supabaseQuery('GET', 'camikaze_users', {
                    username: 'eq.camille',
                    select: 'id'
                });
                
                if (data && data.length > 0) {
                    userId = data[0].id;
                } else {
                    // Create new user
                    const { data: newUser } = await this.supabaseQuery('POST', 'camikaze_users', null, {
                        username: 'camille',
                        display_name: 'Camikaze',
                        avatar: '🦊'
                    });
                    if (newUser && newUser.length > 0) {
                        userId = newUser[0].id;
                    }
                }
                
                if (userId) {
                    localStorage.setItem('camikaze_user_id', userId);
                }
            } catch (e) {
                console.warn('Could not connect to Supabase, using offline mode:', e);
            }
        }
        
        this.userId = userId;
        return userId;
    },
    
    // Supabase REST API query helper
    async supabaseQuery(method, table, params = {}, body = null) {
        const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
        
        // Add query params
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }
        
        const headers = {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': method === 'POST' ? 'return=representation' : 'return=minimal'
        };
        
        if (method === 'PATCH' || method === 'PUT') {
            headers['Prefer'] = 'return=representation';
        }
        
        const options = {
            method,
            headers
        };
        
        if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(url.toString(), options);
        
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Supabase error: ${response.status} - ${error}`);
        }
        
        // Return data for GET/POST with return=representation
        if (method === 'GET' || headers['Prefer'] === 'return=representation') {
            const data = await response.json();
            return { data, error: null };
        }
        
        return { data: null, error: null };
    },
    
    // Get default data structure
    getDefaultData() {
        return {
            username: 'Camikaze',
            avatar: '🦊',
            level: 1,
            totalXP: 0,
            currentLevelXP: 0,
            xpToNextLevel: 100,
            streak: 0,
            lastActiveDate: null,
            stats: {
                totalExercises: 0,
                correctAnswers: 0,
                lessonsCompleted: 0,
                flashcardsLearned: 0,
                themesExplored: [],
                totalStudyTime: 0,
                hasPerfectLesson: false,
                studiedLateNight: false
            },
            themeProgress: {
                'horses': 0,
                'going-out': 0,
                'house': 0,
                'animals': 0,
                'music': 0,
                'bar-restaurant': 0,
                'grammar': 0
            },
            achievements: [],
            settings: {
                soundEnabled: true,
                ttsEnabled: true
            }
        };
    },
    
    // Load data (from Supabase or localStorage)
    async load() {
        // Try Supabase first
        if (this.isOnline && this.userId) {
            try {
                const data = await this.loadFromSupabase();
                // Also save to localStorage for offline access
                this.saveToLocalStorage(data);
                return data;
            } catch (e) {
                console.warn('Failed to load from Supabase, using localStorage:', e);
            }
        }
        
        // Fallback to localStorage
        return this.loadFromLocalStorage();
    },
    
    // Load from Supabase
    async loadFromSupabase() {
        const data = this.getDefaultData();
        
        // Load progress
        const { data: progress } = await this.supabaseQuery('GET', 'camikaze_progress', {
            user_id: `eq.${this.userId}`,
            select: '*'
        });
        
        if (progress && progress.length > 0) {
            const p = progress[0];
            data.level = p.level;
            data.totalXP = p.total_xp;
            data.currentLevelXP = p.current_level_xp;
            data.xpToNextLevel = p.xp_to_next_level;
            data.streak = p.streak;
            data.lastActiveDate = p.last_active_date;
            data.stats.totalExercises = p.total_exercises;
            data.stats.correctAnswers = p.correct_answers;
            data.stats.lessonsCompleted = p.lessons_completed;
            data.stats.flashcardsLearned = p.flashcards_learned;
            data.stats.hasPerfectLesson = p.has_perfect_lesson;
            data.stats.studiedLateNight = p.studied_late_night;
            data.stats.totalStudyTime = p.total_study_time;
            data.settings.soundEnabled = p.sound_enabled;
            data.settings.ttsEnabled = p.tts_enabled;
        }
        
        // Load theme progress
        const { data: themeProgress } = await this.supabaseQuery('GET', 'camikaze_theme_progress', {
            user_id: `eq.${this.userId}`,
            select: 'theme_id,progress'
        });
        
        if (themeProgress) {
            themeProgress.forEach(tp => {
                data.themeProgress[tp.theme_id] = tp.progress;
            });
        }
        
        // Load themes explored
        const { data: themesExplored } = await this.supabaseQuery('GET', 'camikaze_themes_explored', {
            user_id: `eq.${this.userId}`,
            select: 'theme_id'
        });
        
        if (themesExplored) {
            data.stats.themesExplored = themesExplored.map(t => t.theme_id);
        }
        
        // Load achievements
        const { data: achievements } = await this.supabaseQuery('GET', 'camikaze_achievements', {
            user_id: `eq.${this.userId}`,
            select: 'achievement_id'
        });
        
        if (achievements) {
            data.achievements = achievements.map(a => a.achievement_id);
        }
        
        return data;
    },
    
    // Load from localStorage
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                return { ...this.getDefaultData(), ...data };
            }
        } catch (e) {
            console.error('Error loading from localStorage:', e);
        }
        return this.getDefaultData();
    },
    
    // Save to localStorage
    saveToLocalStorage(data) {
        try {
            localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving to localStorage:', e);
        }
    },
    
    // Save progress to Supabase
    async saveProgress(data) {
        // Always save to localStorage first (instant)
        this.saveToLocalStorage(data);
        
        if (!this.isOnline || !this.userId) {
            // Queue for later sync
            this.queueChange('progress', data);
            return;
        }
        
        try {
            // Upsert progress
            await this.supabaseQuery('POST', 'camikaze_progress', null, {
                user_id: this.userId,
                level: data.level,
                total_xp: data.totalXP,
                current_level_xp: data.currentLevelXP,
                xp_to_next_level: data.xpToNextLevel,
                streak: data.streak,
                last_active_date: data.lastActiveDate,
                total_exercises: data.stats.totalExercises,
                correct_answers: data.stats.correctAnswers,
                lessons_completed: data.stats.lessonsCompleted,
                flashcards_learned: data.stats.flashcardsLearned,
                has_perfect_lesson: data.stats.hasPerfectLesson,
                studied_late_night: data.stats.studiedLateNight,
                total_study_time: data.stats.totalStudyTime,
                sound_enabled: data.settings.soundEnabled,
                tts_enabled: data.settings.ttsEnabled
            });
        } catch (e) {
            console.error('Error saving to Supabase:', e);
            this.queueChange('progress', data);
        }
    },
    
    // Add XP and handle level ups
    async addXP(amount) {
        const data = await this.load();
        data.totalXP += amount;
        data.currentLevelXP += amount;
        
        let leveledUp = false;
        
        while (data.currentLevelXP >= data.xpToNextLevel) {
            data.currentLevelXP -= data.xpToNextLevel;
            data.level++;
            data.xpToNextLevel = this.calculateXPForLevel(data.level);
            leveledUp = true;
        }
        
        await this.saveProgress(data);
        return { data, leveledUp };
    },
    
    // Calculate XP needed for a level
    calculateXPForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    },
    
    // Update streak
    async updateStreak() {
        const data = await this.load();
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (data.lastActiveDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (data.lastActiveDate === yesterdayStr) {
                data.streak++;
            } else if (data.lastActiveDate !== today) {
                data.streak = 1;
            }
            
            data.lastActiveDate = today;
            await this.saveProgress(data);
        }
        
        return data.streak;
    },
    
    // Record exercise result
    async recordExercise(themeId, exerciseType, correct, wordOrSentence) {
        const data = await this.load();
        
        // Update stats
        data.stats.totalExercises++;
        if (correct) {
            data.stats.correctAnswers++;
        }
        
        // Check late night
        const hour = new Date().getHours();
        if (hour >= 22 || hour < 5) {
            data.stats.studiedLateNight = true;
        }
        
        // Add theme explored
        if (!data.stats.themesExplored.includes(themeId)) {
            data.stats.themesExplored.push(themeId);
            
            // Save to Supabase
            if (this.isOnline && this.userId) {
                try {
                    await this.supabaseQuery('POST', 'camikaze_themes_explored', null, {
                        user_id: this.userId,
                        theme_id: themeId
                    });
                } catch (e) {
                    console.warn('Failed to save theme explored:', e);
                }
            }
        }
        
        // Save exercise history to Supabase
        if (this.isOnline && this.userId) {
            try {
                await this.supabaseQuery('POST', 'camikaze_exercise_history', null, {
                    user_id: this.userId,
                    theme_id: themeId,
                    exercise_type: exerciseType,
                    item: wordOrSentence,
                    correct: correct
                });
            } catch (e) {
                console.warn('Failed to save exercise history:', e);
            }
        }
        
        await this.saveProgress(data);
        return data;
    },
    
    // Update theme progress
    async updateThemeProgress(themeId, progress) {
        const data = await this.load();
        data.themeProgress[themeId] = Math.min(100, Math.max(0, progress));
        
        // Save to Supabase
        if (this.isOnline && this.userId) {
            try {
                // Use upsert via POST with conflict handling
                await this.supabaseQuery('POST', 'camikaze_theme_progress', {
                    on_conflict: 'user_id,theme_id'
                }, {
                    user_id: this.userId,
                    theme_id: themeId,
                    progress: data.themeProgress[themeId]
                });
            } catch (e) {
                console.warn('Failed to save theme progress:', e);
            }
        }
        
        await this.saveProgress(data);
        return data;
    },
    
    // Complete a lesson
    async completeLesson(themeId, accuracy) {
        const data = await this.load();
        data.stats.lessonsCompleted++;
        
        const currentProgress = data.themeProgress[themeId] || 0;
        data.themeProgress[themeId] = Math.min(100, currentProgress + 15);
        
        if (accuracy === 100) {
            data.stats.hasPerfectLesson = true;
        }
        
        await this.updateThemeProgress(themeId, data.themeProgress[themeId]);
        await this.saveProgress(data);
        return data;
    },
    
    // Update flashcard (spaced repetition)
    async updateFlashcard(cardId, difficulty) {
        const data = await this.load();
        
        // Calculate new values
        let card = {
            easeFactor: 2.5,
            interval: 1,
            repetitions: 0
        };
        
        // Try to get existing card data from Supabase
        if (this.isOnline && this.userId) {
            try {
                const { data: existing } = await this.supabaseQuery('GET', 'camikaze_flashcards', {
                    user_id: `eq.${this.userId}`,
                    card_id: `eq.${cardId}`,
                    select: '*'
                });
                
                if (existing && existing.length > 0) {
                    card = {
                        easeFactor: parseFloat(existing[0].ease_factor),
                        interval: existing[0].interval_days,
                        repetitions: existing[0].repetitions
                    };
                } else {
                    data.stats.flashcardsLearned++;
                }
            } catch (e) {
                console.warn('Failed to load flashcard:', e);
            }
        }
        
        // SM-2 algorithm
        if (difficulty === 'easy') {
            card.repetitions++;
            card.interval = Math.ceil(card.interval * card.easeFactor);
            card.easeFactor = Math.min(2.5, card.easeFactor + 0.15);
        } else if (difficulty === 'medium') {
            card.repetitions++;
            card.interval = Math.ceil(card.interval * 1.2);
        } else {
            card.repetitions = 0;
            card.interval = 1;
            card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
        }
        
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + card.interval);
        
        // Save to Supabase
        if (this.isOnline && this.userId) {
            try {
                await this.supabaseQuery('POST', 'camikaze_flashcards', {
                    on_conflict: 'user_id,card_id'
                }, {
                    user_id: this.userId,
                    card_id: cardId,
                    ease_factor: card.easeFactor,
                    interval_days: card.interval,
                    repetitions: card.repetitions,
                    next_review: nextReview.toISOString()
                });
            } catch (e) {
                console.warn('Failed to save flashcard:', e);
            }
        }
        
        await this.saveProgress(data);
        return data;
    },
    
    // Get weak points (frequently wrong)
    async getWeakPoints() {
        if (this.isOnline && this.userId) {
            try {
                const { data: history } = await this.supabaseQuery('GET', 'camikaze_exercise_history', {
                    user_id: `eq.${this.userId}`,
                    correct: 'eq.false',
                    select: 'theme_id,item',
                    order: 'created_at.desc',
                    limit: '50'
                });
                
                if (history) {
                    const mistakes = {};
                    history.forEach(e => {
                        const key = `${e.theme_id}:${e.item}`;
                        mistakes[key] = (mistakes[key] || 0) + 1;
                    });
                    
                    return Object.entries(mistakes)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 10)
                        .map(([key]) => {
                            const [theme, item] = key.split(':');
                            return { theme, item };
                        });
                }
            } catch (e) {
                console.warn('Failed to load weak points:', e);
            }
        }
        
        return [];
    },
    
    // Get flashcards due for review
    async getDueFlashcards(themeId) {
        if (this.isOnline && this.userId) {
            try {
                const params = {
                    user_id: `eq.${this.userId}`,
                    next_review: `lte.${new Date().toISOString()}`,
                    select: 'card_id'
                };
                
                if (themeId) {
                    params.card_id = `like.${themeId}:*`;
                }
                
                const { data: cards } = await this.supabaseQuery('GET', 'camikaze_flashcards', params);
                
                return cards || [];
            } catch (e) {
                console.warn('Failed to load due flashcards:', e);
            }
        }
        
        return [];
    },
    
    // Unlock achievement
    async unlockAchievement(achievementId) {
        const data = await this.load();
        
        if (!data.achievements.includes(achievementId)) {
            data.achievements.push(achievementId);
            
            // Save to Supabase
            if (this.isOnline && this.userId) {
                try {
                    await this.supabaseQuery('POST', 'camikaze_achievements', null, {
                        user_id: this.userId,
                        achievement_id: achievementId
                    });
                } catch (e) {
                    console.warn('Failed to save achievement:', e);
                }
            }
            
            await this.saveProgress(data);
            return true;
        }
        
        return false;
    },
    
    // Check all achievements
    async checkAchievements() {
        const data = await this.load();
        const newlyUnlocked = [];
        
        ACHIEVEMENTS.forEach(achievement => {
            if (data.achievements.includes(achievement.id)) return;
            
            let unlocked = false;
            
            switch (achievement.id) {
                case 'first_lesson':
                    unlocked = data.stats.lessonsCompleted >= 1;
                    break;
                case 'streak_3':
                    unlocked = data.streak >= 3;
                    break;
                case 'streak_7':
                    unlocked = data.streak >= 7;
                    break;
                case 'xp_100':
                    unlocked = data.totalXP >= 100;
                    break;
                case 'xp_500':
                    unlocked = data.totalXP >= 500;
                    break;
                case 'xp_1000':
                    unlocked = data.totalXP >= 1000;
                    break;
                case 'perfect_lesson':
                    unlocked = data.stats.hasPerfectLesson;
                    break;
                case 'all_themes':
                    unlocked = data.stats.themesExplored.length >= 7;
                    break;
                case 'horse_master':
                    unlocked = data.themeProgress['horses'] >= 100;
                    break;
                case 'party_animal':
                    unlocked = data.themeProgress['going-out'] >= 100;
                    break;
                case 'flashcard_master':
                    unlocked = data.stats.flashcardsLearned >= 50;
                    break;
                case 'night_owl':
                    unlocked = data.stats.studiedLateNight;
                    break;
            }
            
            if (unlocked) {
                this.unlockAchievement(achievement.id);
                newlyUnlocked.push(achievement);
            }
        });
        
        return newlyUnlocked;
    },
    
    // Queue change for offline sync
    queueChange(type, data) {
        this.syncQueue.push({
            type,
            data,
            timestamp: Date.now()
        });
        localStorage.setItem('camikaze_sync_queue', JSON.stringify(this.syncQueue));
    },
    
    // Sync pending changes when back online
    async syncPendingChanges() {
        const queueStr = localStorage.getItem('camikaze_sync_queue');
        if (!queueStr) return;
        
        try {
            this.syncQueue = JSON.parse(queueStr);
            
            for (const change of this.syncQueue) {
                if (change.type === 'progress') {
                    await this.saveProgress(change.data);
                }
            }
            
            // Clear queue after successful sync
            this.syncQueue = [];
            localStorage.removeItem('camikaze_sync_queue');
            
            console.log('✅ Synced pending changes to Supabase');
        } catch (e) {
            console.error('Failed to sync pending changes:', e);
        }
    },
    
    // Handle coming online
    async handleOnline() {
        console.log('🌐 Back online!');
        this.isOnline = true;
        
        // Ensure we have a user ID
        if (!this.userId) {
            await this.initUser();
        }
        
        // Sync pending changes
        await this.syncPendingChanges();
        
        // Show toast
        if (typeof gamification !== 'undefined') {
            gamification.showToast('success', '🌐', 'Connecté! Données synchronisées.');
        }
    },
    
    // Handle going offline
    handleOffline() {
        console.log('📴 Offline mode');
        this.isOnline = false;
        
        // Show toast
        if (typeof gamification !== 'undefined') {
            gamification.showToast('info', '📴', 'Mode hors-ligne. Tes progrès seront synchronisés.');
        }
    },
    
    // Reset all progress
    async reset() {
        // Clear localStorage
        localStorage.removeItem(this.LOCAL_STORAGE_KEY);
        localStorage.removeItem('camikaze_sync_queue');
        
        // Note: Supabase data preserved (would need DELETE queries to remove)
        
        return this.getDefaultData();
    }
};

// Initialize storage when script loads
storage.init().catch(e => console.error('Storage init failed:', e));
