/**
 * WORDLE CLONE - STUDENT IMPLEMENTATION
 *
 * Complete the functions below to create a working Wordle game.
 * Each function has specific requirements and point values.
 *
 * GRADING BREAKDOWN:
 * - Core Game Functions (60 points): initializeGame, handleKeyPress, submitGuess, checkLetter, updateGameState
 * - Advanced Features (30 points): updateKeyboardColors, processRowReveal, showEndGameModal, validateInput
 */

// ========================================
// CORE GAME FUNCTIONS (60 POINTS TOTAL)
// ========================================

/**
 * Initialize a new game
 * POINTS: 10
 *
 * TODO: Complete this function to:
 * - Reset all game state variables
 * - Get a random word from the word list
 * - Clear the game board
 * - Hide any messages or modals
 */
function initializeGame() {
    // TODO: Reset game state variables
    currentWord = WordleWords.getRandomWord();  // Set this to a random word
    currentGuess = '';
    currentRow = 0;
    gameOver = false;
    gameWon = false;

    // TODO: Get a random word from the word list
    // HINT: Use WordleWords.getRandomWord()
    // TODO: Reset the game board
    // HINT: Use resetBoard()
    resetBoard();
    // TODO: Hide any messages
    // HINT: Use hideModal() and ensure message element is hidden
    hideModal();
}

/**
 * Handle keyboard input
 * POINTS: 15
 *
 * TODO: Complete this function to:
 * - Process letter keys (A-Z)
 * - Handle ENTER key for word submission
 * - Handle BACKSPACE for letter deletion
 * - Update the display when letters are added/removed
 */
function handleKeyPress(key) {
    // TODO: Check if game is over - if so, return early
    if (gameOver) return;

    key = key.toUpperCase();
    // TODO: Handle letter keys (A-Z)
    if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < WORD_LENGTH) {
            currentGuess += key;
            const tile = getTile(currentRow, currentGuess.length - 1);
            updateTileDisplay(tile, key);
        }
        return;
    }

    // TODO: Handle ENTER key
    if (key === 'ENTER') {
        if (isGuessComplete()) {
            submitGuess();
        } else {
            showMessage('Not enough letters', 'error', 1200);
            shakeRow(currentRow);
        }
        return;
    }

    // TODO: Handle BACKSPACE key
    if (key === 'BACKSPACE') {
        if (currentGuess.length > 0) {
            const tile = getTile(currentRow, currentGuess.length - 1);
            currentGuess = currentGuess.slice(0, -1);
            updateTileDisplay(tile, '');
        }
        return;
    }
}

/**
 * Submit and process a complete guess
 * POINTS: 20
 *
 * TODO: Complete this function to:
 * - Validate the guess is a real word
 * - Check each letter against the target word
 * - Update tile colors and keyboard
 * - Handle win/lose conditions
 */
function submitGuess() {
    // TODO: Validate guess is complete
    if (!isGuessComplete()) {
        showMessage('Not enough letters', 'error', 1200);
        return;
    }

    // TODO: Validate guess is a real word
    if (!WordleWords.isValidWord(currentGuess)) {
        showMessage('Not in word list', 'error', 1200);
        shakeRow(currentRow);
        return;
    }

    // TODO: Check each letter and get results
    const results = [];
    for (let i = 0; i < WORD_LENGTH; i++) {
        results.push(checkLetter(currentGuess[i], i, currentWord));
    }

    // TODO: Update tile colors immediately
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = getTile(currentRow, i);
        setTileState(tile, results[i]);
    }

    // TODO: Update keyboard colors
    updateKeyboardColors(currentGuess, results);

    // TODO: Check if guess was correct
    const isCorrect = currentGuess === currentWord;

    // TODO: Update game state
    updateGameState(isCorrect);

    // TODO: Move to next row if game continues
    if (!gameOver) {
        currentRow++;
        currentGuess = '';
    }
}

/**
 * Check a single letter against the target word
 * POINTS: 10
 *
 * TODO: Complete this function to:
 * - Return 'correct' if letter matches position exactly
 * - Return 'present' if letter exists but wrong position
 * - Return 'absent' if letter doesn't exist in target
 * - Handle duplicate letters correctly (this is the tricky part!)
 */
function checkLetter(guessLetter, position, targetWord) {
    guessLetter = guessLetter.toUpperCase();
    targetWord = targetWord.toUpperCase();

    const targetArr = targetWord.split('');
    const guessArr = currentGuess.toUpperCase().split('');
    const result = Array(WORD_LENGTH).fill('absent');

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i] = 'correct';
            targetArr[i] = null; // remove matched letter
        }
    }
    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (result[i] === 'correct') continue;
        const idx = targetArr.indexOf(guessArr[i]);
        if (idx !== -1) {
            result[i] = 'present';
            targetArr[idx] = null; // remove matched letter to avoid duplicates
        }
    }]
    return result[position];
}


/**
 * Update game state after a guess
 * POINTS: 5
 *
 * TODO: Complete this function to:
 * - Check if player won (guess matches target)
 * - Check if player lost (used all attempts)
 * - Show appropriate end game modal
 */
function updateGameState(isCorrect) {
    if (isCorrect) {
        gameWon = true;
        gameOver = true;
        celebrateRow(currentRow);
        showModal(true, currentWord, currentRow + 1);
    } else if (currentRow >= MAX_GUESSES - 1) {
        gameOver = true;
        showModal(false, currentWord);
    }

    updateStats(gameWon);
}

// ========================================
// ADVANCED FEATURES (30 POINTS TOTAL)
// ========================================

/**
 * Update keyboard key colors based on guessed letters
 * POINTS: 10
 *
 * TODO: Complete this function to:
 * - Update each key with appropriate color
 * - Maintain color priority (green > yellow > gray)
 * - Don't downgrade key colors
 */
function updateKeyboardColors(guess, results) {
    for (let i = 0; i < guess.length; i++) {
        const letter = guess[i];
        const result = results[i];

        const keyEl = document.querySelector(`[data-key="${letter}"]`);
        if (!keyEl) continue;

        if (result === 'correct') {
            keyEl.classList.add('correct');
        } else if (result === 'present' && !keyEl.classList.contains('correct')) {
            keyEl.classList.add('present');
        } else if (result === 'absent' && !keyEl.classList.contains('correct') && !keyEl.classList.contains('present')) {
            keyEl.classList.add('absent');
        }
    }
}

/**
 * Process row reveal (simplified - no animations needed)
 * POINTS: 5 (reduced from 15 since animations removed)
 *
 * TODO: Complete this function to:
 * - Check if all letters were correct
 * - Trigger celebration if player won this round
 */
function processRowReveal(rowIndex, results) {
    if (results.every(r => r === 'correct')) {
        celebrateRow(rowIndex);
    }
}

/**
 * Show end game modal with results
 * POINTS: 10
 *
 * TODO: Complete this function to:
 * - Display appropriate win/lose message
 * - Show the target word
 * - Update game statistics
 */
function showEndGameModal(won, targetWord) {
    showModal(won, targetWord, currentRow + 1);
    updateStats(won);
}

/**
 * Validate user input before processing
 * POINTS: 5
 *
 * TODO: Complete this function to:
 * - Check if game is over
 * - Validate letter keys (only if guess not full)
 * - Validate ENTER key (only if guess complete)
 * - Validate BACKSPACE key (only if letters to remove)
 */
function validateInput(key, currentGuess) {
    if (gameOver) return false;

    key = key.toUpperCase();
    if (/^[A-Z]$/.test(key)) return currentGuess.length < WORD_LENGTH;
    if (key === 'ENTER') return currentGuess.length === WORD_LENGTH;
    if (key === 'BACKSPACE') return currentGuess.length > 0;

    return false;
}

// ========================================
// DEBUGGING HELPERS (REMOVE BEFORE SUBMISSION)
// ========================================

// Uncomment these lines for debugging help:
// console.log('Current word:', currentWord);
// console.log('Current guess:', currentGuess);
// console.log('Current row:', currentRow);
