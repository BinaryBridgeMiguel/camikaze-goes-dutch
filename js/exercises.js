// ==========================================
// Camikaze Goes Dutch - Exercise Engine
// Multiple choice, translation, fill-in, word order
// ==========================================

const exercises = {
    currentLesson: null,
    currentExerciseIndex: 0,
    exercises: [],
    results: [],
    hearts: 3,
    startTime: null,
    
    // Exercise types
    TYPES: {
        MULTIPLE_CHOICE_NL_FR: 'multiple_choice_nl_fr',
        MULTIPLE_CHOICE_FR_NL: 'multiple_choice_fr_nl',
        TRANSLATE_NL_FR: 'translate_nl_fr',
        TRANSLATE_FR_NL: 'translate_fr_nl',
        FILL_BLANK: 'fill_blank',
        WORD_ORDER: 'word_order'
    },
    
    // Start a lesson
    async startLesson(themeId) {
        this.currentLesson = themeId;
        this.currentExerciseIndex = 0;
        this.results = [];
        this.hearts = 3;
        this.startTime = Date.now();
        
        // Generate exercises
        this.exercises = this.generateExercises(themeId);
        
        // Update streak
        await storage.updateStreak();
        
        // Show lesson screen
        app.showScreen('lesson-screen');
        this.updateProgress();
        this.updateHearts();
        this.showCurrentExercise();
    },
    
    // Generate a set of exercises for a theme
    generateExercises(themeId, count = 10) {
        const exercises = [];
        const vocab = VOCABULARY[themeId] || [];
        const sentences = SENTENCES[themeId] || [];
        
        // Mix of exercise types
        const types = [
            this.TYPES.MULTIPLE_CHOICE_NL_FR,
            this.TYPES.MULTIPLE_CHOICE_FR_NL,
            this.TYPES.TRANSLATE_FR_NL,
            this.TYPES.FILL_BLANK,
            this.TYPES.WORD_ORDER
        ];
        
        for (let i = 0; i < count; i++) {
            const type = types[i % types.length];
            let exercise = null;
            
            switch (type) {
                case this.TYPES.MULTIPLE_CHOICE_NL_FR:
                    exercise = this.createMultipleChoice(vocab, 'nl', 'fr');
                    break;
                case this.TYPES.MULTIPLE_CHOICE_FR_NL:
                    exercise = this.createMultipleChoice(vocab, 'fr', 'nl');
                    break;
                case this.TYPES.TRANSLATE_FR_NL:
                    exercise = this.createTranslation(sentences, 'fr', 'nl');
                    break;
                case this.TYPES.FILL_BLANK:
                    exercise = this.createFillBlank(vocab, sentences);
                    break;
                case this.TYPES.WORD_ORDER:
                    exercise = this.createWordOrder();
                    break;
            }
            
            if (exercise) {
                exercises.push(exercise);
            }
        }
        
        // Shuffle
        return this.shuffle(exercises);
    },
    
    // Create multiple choice exercise
    createMultipleChoice(vocab, questionLang, answerLang) {
        if (vocab.length < 4) return null;
        
        const shuffled = this.shuffle([...vocab]);
        const correct = shuffled[0];
        const wrong = shuffled.slice(1, 4);
        
        const options = this.shuffle([
            { text: correct[answerLang], correct: true },
            ...wrong.map(w => ({ text: w[answerLang], correct: false }))
        ]);
        
        return {
            type: questionLang === 'nl' ? this.TYPES.MULTIPLE_CHOICE_NL_FR : this.TYPES.MULTIPLE_CHOICE_FR_NL,
            prompt: correct[questionLang],
            correctAnswer: correct[answerLang],
            options,
            hint: correct.hint || ''
        };
    },
    
    // Create translation exercise
    createTranslation(sentences, fromLang, toLang) {
        if (sentences.length === 0) return null;
        
        const sentence = sentences[Math.floor(Math.random() * sentences.length)];
        
        return {
            type: fromLang === 'fr' ? this.TYPES.TRANSLATE_FR_NL : this.TYPES.TRANSLATE_NL_FR,
            prompt: sentence[fromLang],
            correctAnswer: sentence[toLang],
            alternativeAnswers: [] // Could add alternative translations
        };
    },
    
    // Create fill in the blank exercise
    createFillBlank(vocab, sentences) {
        // Use grammar fill-in-the-blank exercises
        if (GRAMMAR_EXERCISES.fillInTheBlank.length > 0) {
            const exercise = GRAMMAR_EXERCISES.fillInTheBlank[
                Math.floor(Math.random() * GRAMMAR_EXERCISES.fillInTheBlank.length)
            ];
            
            return {
                type: this.TYPES.FILL_BLANK,
                sentence: exercise.sentence,
                correctAnswer: exercise.answer,
                hint: exercise.hint
            };
        }
        
        // Fallback: use vocabulary
        if (vocab.length > 0) {
            const word = vocab[Math.floor(Math.random() * vocab.length)];
            return {
                type: this.TYPES.FILL_BLANK,
                sentence: `De vertaling van "${word.fr}" is ___.`,
                correctAnswer: word.nl,
                hint: word.hint
            };
        }
        
        return null;
    },
    
    // Create word order exercise
    createWordOrder() {
        if (WORD_ORDER.length === 0) return null;
        
        const exercise = WORD_ORDER[Math.floor(Math.random() * WORD_ORDER.length)];
        
        return {
            type: this.TYPES.WORD_ORDER,
            correctOrder: exercise.correct,
            scrambled: this.shuffle([...exercise.correct]),
            translation: exercise.translation
        };
    },
    
    // Show current exercise
    showCurrentExercise() {
        const exercise = this.exercises[this.currentExerciseIndex];
        const container = document.getElementById('exercise-container');
        
        if (!exercise) {
            this.finishLesson();
            return;
        }
        
        let html = '';
        
        switch (exercise.type) {
            case this.TYPES.MULTIPLE_CHOICE_NL_FR:
                html = this.renderMultipleChoice(exercise, 'Traduis en français:', 'nl');
                break;
            case this.TYPES.MULTIPLE_CHOICE_FR_NL:
                html = this.renderMultipleChoice(exercise, 'Traduis en néerlandais:', 'fr');
                break;
            case this.TYPES.TRANSLATE_FR_NL:
                html = this.renderTranslation(exercise, 'Traduis cette phrase en néerlandais:');
                break;
            case this.TYPES.TRANSLATE_NL_FR:
                html = this.renderTranslation(exercise, 'Traduis cette phrase en français:');
                break;
            case this.TYPES.FILL_BLANK:
                html = this.renderFillBlank(exercise);
                break;
            case this.TYPES.WORD_ORDER:
                html = this.renderWordOrder(exercise);
                break;
        }
        
        container.innerHTML = html;
        this.attachEventListeners(exercise);
    },
    
    // Render multiple choice
    renderMultipleChoice(exercise, instruction, lang) {
        const speakBtn = lang === 'nl' ? 
            `<button class="btn-speak" onclick="gamification.speak('${exercise.prompt.replace(/'/g, "\\'")}')">🔊</button>` : '';
        
        return `
            <p class="exercise-type">${instruction}</p>
            <div class="exercise-prompt">
                ${exercise.prompt} ${speakBtn}
            </div>
            ${exercise.hint ? `<p class="exercise-hint">Indice: ${exercise.hint}</p>` : ''}
            <div class="choices-container">
                ${exercise.options.map((opt, i) => `
                    <button class="choice-btn" data-index="${i}" data-correct="${opt.correct}">
                        ${opt.text}
                    </button>
                `).join('')}
            </div>
        `;
    },
    
    // Render translation exercise
    renderTranslation(exercise, instruction) {
        return `
            <p class="exercise-type">${instruction}</p>
            <div class="exercise-prompt">
                ${exercise.prompt}
                <button class="btn-speak" onclick="gamification.speak('${exercise.prompt.replace(/'/g, "\\'")}', '${exercise.type.includes('FR_NL') ? 'fr-FR' : 'nl-NL'}')">🔊</button>
            </div>
            <div class="translation-container">
                <input type="text" class="translation-input" id="translation-input" 
                    placeholder="Tape ta traduction ici..." autocomplete="off">
                <button class="btn btn-primary submit-btn" onclick="exercises.checkTranslation()">
                    Vérifier
                </button>
            </div>
        `;
    },
    
    // Render fill in the blank
    renderFillBlank(exercise) {
        const parts = exercise.sentence.split('___');
        
        return `
            <p class="exercise-type">Complète la phrase:</p>
            <div class="blank-sentence">
                ${parts[0]}<input type="text" class="blank-input" id="blank-input" autocomplete="off">${parts[1] || ''}
            </div>
            ${exercise.hint ? `<p class="exercise-hint">Indice: ${exercise.hint}</p>` : ''}
            <button class="btn btn-primary" onclick="exercises.checkFillBlank()">
                Vérifier
            </button>
        `;
    },
    
    // Render word order
    renderWordOrder(exercise) {
        return `
            <p class="exercise-type">Remets les mots dans l'ordre:</p>
            <p class="exercise-hint">Traduction: ${exercise.translation}</p>
            
            <div class="word-bank answer-zone" id="answer-zone">
                <!-- Dropped words go here -->
            </div>
            
            <div class="word-bank" id="word-bank">
                ${exercise.scrambled.map((word, i) => `
                    <div class="draggable-word" draggable="true" data-word="${word}" data-index="${i}">
                        ${word}
                    </div>
                `).join('')}
            </div>
            
            <button class="btn btn-primary" onclick="exercises.checkWordOrder()">
                Vérifier
            </button>
        `;
    },
    
    // Attach event listeners for current exercise
    attachEventListeners(exercise) {
        switch (exercise.type) {
            case this.TYPES.MULTIPLE_CHOICE_NL_FR:
            case this.TYPES.MULTIPLE_CHOICE_FR_NL:
                document.querySelectorAll('.choice-btn').forEach(btn => {
                    btn.addEventListener('click', () => this.checkMultipleChoice(btn));
                });
                break;
                
            case this.TYPES.TRANSLATE_FR_NL:
            case this.TYPES.TRANSLATE_NL_FR:
                const input = document.getElementById('translation-input');
                if (input) {
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') this.checkTranslation();
                    });
                    input.focus();
                }
                break;
                
            case this.TYPES.FILL_BLANK:
                const blankInput = document.getElementById('blank-input');
                if (blankInput) {
                    blankInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') this.checkFillBlank();
                    });
                    blankInput.focus();
                }
                break;
                
            case this.TYPES.WORD_ORDER:
                this.setupDragAndDrop();
                break;
        }
    },
    
    // Setup drag and drop for word order
    setupDragAndDrop() {
        const words = document.querySelectorAll('.draggable-word');
        const answerZone = document.getElementById('answer-zone');
        const wordBank = document.getElementById('word-bank');
        
        words.forEach(word => {
            word.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.word);
                e.target.classList.add('dragging');
            });
            
            word.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
            
            // Click to move between zones
            word.addEventListener('click', () => {
                const isInAnswer = word.parentElement === answerZone;
                if (isInAnswer) {
                    wordBank.appendChild(word);
                    word.classList.remove('placed');
                } else {
                    answerZone.appendChild(word);
                    word.classList.add('placed');
                }
            });
        });
        
        [answerZone, wordBank].forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                const word = document.querySelector('.dragging');
                if (word) {
                    zone.appendChild(word);
                    word.classList.toggle('placed', zone === answerZone);
                }
            });
        });
    },
    
    // Check multiple choice answer
    checkMultipleChoice(selectedBtn) {
        const isCorrect = selectedBtn.dataset.correct === 'true';
        const exercise = this.exercises[this.currentExerciseIndex];
        
        // Disable all buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = true;
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            } else if (btn === selectedBtn) {
                btn.classList.add('incorrect');
            }
        });
        
        this.handleAnswer(isCorrect, exercise.correctAnswer);
    },
    
    // Check translation answer
    checkTranslation() {
        const input = document.getElementById('translation-input');
        const exercise = this.exercises[this.currentExerciseIndex];
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = exercise.correctAnswer.toLowerCase();
        
        // Simple comparison (could be improved with fuzzy matching)
        const isCorrect = this.compareAnswers(userAnswer, correctAnswer);
        
        input.classList.add(isCorrect ? 'correct' : 'incorrect');
        input.disabled = true;
        
        this.handleAnswer(isCorrect, exercise.correctAnswer);
    },
    
    // Check fill in the blank
    checkFillBlank() {
        const input = document.getElementById('blank-input');
        const exercise = this.exercises[this.currentExerciseIndex];
        const userAnswer = input.value.trim().toLowerCase();
        const correctAnswer = exercise.correctAnswer.toLowerCase();
        
        const isCorrect = userAnswer === correctAnswer;
        
        input.classList.add(isCorrect ? 'correct' : 'incorrect');
        input.disabled = true;
        
        this.handleAnswer(isCorrect, exercise.correctAnswer);
    },
    
    // Check word order
    checkWordOrder() {
        const answerZone = document.getElementById('answer-zone');
        const exercise = this.exercises[this.currentExerciseIndex];
        const userOrder = Array.from(answerZone.children).map(el => el.dataset.word);
        
        const isCorrect = JSON.stringify(userOrder) === JSON.stringify(exercise.correctOrder);
        
        // Visual feedback
        answerZone.style.borderColor = isCorrect ? 'var(--success)' : 'var(--danger)';
        
        this.handleAnswer(isCorrect, exercise.correctOrder.join(' '));
    },
    
    // Compare answers with some tolerance
    compareAnswers(userAnswer, correctAnswer) {
        // Exact match
        if (userAnswer === correctAnswer) return true;
        
        // Remove punctuation and compare
        const cleanUser = userAnswer.replace(/[.,!?]/g, '').trim();
        const cleanCorrect = correctAnswer.replace(/[.,!?]/g, '').trim();
        if (cleanUser === cleanCorrect) return true;
        
        // Allow small typos (Levenshtein distance ≤ 2 for longer answers)
        if (correctAnswer.length > 5) {
            const distance = this.levenshteinDistance(userAnswer, correctAnswer);
            if (distance <= 2) return true;
        }
        
        return false;
    },
    
    // Levenshtein distance for typo tolerance
    levenshteinDistance(a, b) {
        const matrix = [];
        
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[b.length][a.length];
    },
    
    // Handle answer result
    async handleAnswer(isCorrect, correctAnswer) {
        try {
            const exercise = this.exercises[this.currentExerciseIndex];
            
            // Record result
            this.results.push({
                exercise: this.currentExerciseIndex,
                correct: isCorrect,
                answer: correctAnswer
            });
            
            // Update storage (don't await - let it happen in background)
            storage.recordExercise(
                this.currentLesson,
                exercise.type,
                isCorrect,
                exercise.prompt || exercise.sentence || ''
            ).catch(e => console.warn('Failed to record exercise:', e));
            
            // Play sound
            try {
                gamification.playSound(isCorrect ? 'correct' : 'incorrect');
            } catch (e) {
                console.warn('Sound failed:', e);
            }
            
            // Update hearts if wrong
            if (!isCorrect) {
                this.hearts--;
                this.updateHearts();
            } else {
                // Award XP
                try {
                    await gamification.awardXP(gamification.XP_REWARDS.correctAnswer);
                } catch (e) {
                    console.warn('XP award failed:', e);
                }
            }
        } catch (e) {
            console.error('handleAnswer error:', e);
        }
        
        // ALWAYS show feedback
        this.showFeedback(isCorrect, correctAnswer);
    },
    
    // Show feedback panel
    showFeedback(isCorrect, correctAnswer) {
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackContent = document.getElementById('feedback-content');
        
        const encouragement = gamification.getEncouragement(isCorrect);
        
        feedbackContent.className = `feedback-content ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackContent.innerHTML = `
            <div class="feedback-title">
                ${isCorrect ? '✅' : '❌'} ${encouragement}
            </div>
            ${!isCorrect ? `
                <p class="correct-answer">
                    La bonne réponse était: <strong>${correctAnswer}</strong>
                </p>
            ` : ''}
        `;
        
        feedbackContainer.classList.remove('hidden');
        feedbackContainer.classList.add('visible');
    },
    
    // Go to next exercise
    nextExercise() {
        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.classList.remove('visible');
        feedbackContainer.classList.add('hidden');
        
        this.currentExerciseIndex++;
        this.updateProgress();
        
        if (this.currentExerciseIndex >= this.exercises.length) {
            this.finishLesson();
        } else {
            this.showCurrentExercise();
        }
    },
    
    // Update progress bar
    updateProgress() {
        const progress = (this.currentExerciseIndex / this.exercises.length) * 100;
        const progressBar = document.getElementById('lesson-progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    },
    
    // Update hearts display
    updateHearts() {
        const heartsDisplay = document.getElementById('hearts-display');
        if (heartsDisplay) {
            heartsDisplay.innerHTML = '❤️'.repeat(Math.max(0, this.hearts)) + 
                                     '🖤'.repeat(Math.max(0, 3 - this.hearts));
        }
    },
    
    // Finish lesson
    async finishLesson() {
        const correctCount = this.results.filter(r => r.correct).length;
        const totalCount = this.results.length;
        const accuracy = Math.round((correctCount / totalCount) * 100);
        const timeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Calculate bonus XP
        const bonusXP = gamification.calculateLessonBonus(correctCount, totalCount, timeSeconds);
        await gamification.awardXP(bonusXP, 'Leçon terminée!');
        
        // Update theme progress
        await storage.completeLesson(this.currentLesson, accuracy);
        
        // Show results
        app.showResults({
            xp: bonusXP,
            accuracy,
            time: timeSeconds,
            correct: correctCount,
            total: totalCount,
            leveledUp: false // Will be updated by gamification
        });
    },
    
    // Utility: shuffle array
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    // Start practice mode
    async startPractice(mode) {
        let exercisesToUse = [];
        
        switch (mode) {
            case 'weak':
                // Get weak points and generate exercises
                const weakPoints = await storage.getWeakPoints();
                if (weakPoints.length > 0) {
                    // Use weak themes
                    const weakThemes = [...new Set(weakPoints.map(w => w.theme))];
                    weakThemes.forEach(theme => {
                        exercisesToUse.push(...this.generateExercises(theme, 3));
                    });
                } else {
                    // No weak points, do random
                    exercisesToUse = this.generateExercises(THEMES[0].id, 10);
                }
                break;
                
            case 'random':
                // Random mix from all themes
                THEMES.forEach(theme => {
                    exercisesToUse.push(...this.generateExercises(theme.id, 2));
                });
                break;
                
            case 'grammar':
                exercisesToUse = this.generateExercises('grammar', 10);
                break;
        }
        
        this.currentLesson = 'practice';
        this.exercises = this.shuffle(exercisesToUse).slice(0, 10);
        this.currentExerciseIndex = 0;
        this.results = [];
        this.hearts = 3;
        this.startTime = Date.now();
        
        app.showScreen('lesson-screen');
        this.updateProgress();
        this.updateHearts();
        this.showCurrentExercise();
    }
};
