const textDisplay = document.getElementById('text-display');
const textInput = document.getElementById('text-input');
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const themeButton = document.getElementById('theme-button');
const timerDisplay = document.getElementById('timer');
const resultsDisplay = document.getElementById('results');
const highScoreDisplay = document.getElementById('high-score');
const wpmDisplay = document.getElementById('wpm-display');

const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "The early bird catches the worm.",
    "Actions speak louder than words.",
    "Every cloud has a silver lining.",
    "You can't judge a book by its cover.",
    "When in Rome, do as the Romans do.",
    "Fortune favors the bold.",
    "Better late than never.",
    "Birds of a feather flock together.",
    "A picture is worth a thousand words.",
    "Beauty is in the eye of the beholder.",
    "Necessity is the mother of invention.",
    "A watched pot never boils.",
    "Beggars can't be choosers.",
    "A rolling stone gathers no moss.",
    "Absence makes the heart grow fonder.",
    "Actions speak louder than words.",
    "A penny saved is a penny earned.",
    "A stitch in time saves nine.",
    "All good things must come to an end.",
    "All work and no play makes Jack a dull boy.",
    "An apple a day keeps the doctor away.",
    "You can lead a horse to water, but you can't make it drink.",
    "A bird in the hand is worth two in the bush.",
    "A fool and his money are soon parted.",
    "A friend in need is a friend indeed.",
    "A journey of a thousand miles begins with a single step.",
    "A leopard cannot change its spots.",
    "A little knowledge is a dangerous thing.",
    "A picture is worth a thousand words.",
    "A watched pot never boils.",
    "Actions speak louder than words.",
    "All good things must come to an end.",
    "All that glitters is not gold.",
    "All work and no play makes Jack a dull boy.",
    "An apple a day keeps the doctor away.",
    "An ounce of prevention is worth a pound of cure.",
    "As you sow, so shall you reap.",
    "Beauty is in the eye of the beholder.",
    "Better late than never.",
    "Birds of a feather flock together.",
    "Cleanliness is next to godliness.",
    "Don't count your chickens before they hatch.",
    "Don't put all your eggs in one basket.",
    "Early to bed and early to rise makes a man healthy, wealthy, and wise.",
    "Every cloud has a silver lining.",
    "Fortune favors the bold.",
    "Good things come to those who wait.",
    "Haste makes waste.",
    "Honesty is the best policy.",
    "If it ain't broke, don't fix it.",
    "Ignorance is bliss.",
    "Knowledge is power.",
    "Laughter is the best medicine.",
    "Look before you leap.",
    "No man is an island.",
    "One man's trash is another man's treasure.",
    "Patience is a virtue.",
    "Practice makes perfect.",
    "The early bird catches the worm.",
    "The pen is mightier than the sword."
];

let currentText = '';
let timer = null;
let timeLeft = 60;
let totalTypedChars = 0;
let totalWordsTyped = 0;
let correctWords = 0;
let incorrectWords = 0;
let isPaused = false;
let highScore = 0;

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', pauseGame);
themeButton.addEventListener('click', changeTheme);

function startGame() {
    resetGame();
    startButton.disabled = true;
    pauseButton.disabled = false;
    textInput.disabled = false;
    textInput.value = '';
    textInput.focus();
    loadNextSentence();
    timer = setInterval(updateTimer, 1000);
}

function resetGame() {
    clearInterval(timer);
    timeLeft = 60;
    totalTypedChars = 0;
    totalWordsTyped = 0;
    correctWords = 0;
    incorrectWords = 0;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    resultsDisplay.textContent = '';
    textDisplay.innerHTML = '';
    wpmDisplay.textContent = 'WPM: 0';
    textInput.disabled = true;
    startButton.disabled = false;
    pauseButton.disabled = true;
    isPaused = false;
}

function getRandomText() {
    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
}

function loadNextSentence() {
    if (timeLeft > 0) {
        currentText = getRandomText();
        displayText(currentText);
        textInput.value = '';
        textInput.focus();
    }
}

function displayText(text) {
    textDisplay.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.innerText = char;
        textDisplay.appendChild(span);
    });
}

textInput.addEventListener('input', () => {
    const textArray = textDisplay.querySelectorAll('span');
    const inputValue = textInput.value.split('');

    textArray.forEach((charSpan, index) => {
        const typedChar = inputValue[index];

        if (typedChar == null) {
            charSpan.classList.remove('correct', 'incorrect');
        } else if (typedChar === charSpan.innerText) {
            charSpan.classList.add('correct');
            charSpan.classList.remove('incorrect');
        } else {
            charSpan.classList.add('incorrect');
            charSpan.classList.remove('correct');
        }
    });

    // Check if the user has typed the entire sentence
    if (inputValue.length === textArray.length) {
        // Update total typed characters
        totalTypedChars += currentText.length;

        // Count total words typed
        const typedWordsArray = currentText.trim().split(/\s+/);
        totalWordsTyped += typedWordsArray.length;

        // Calculate correct and incorrect words
        const userInput = textInput.value.trim();
        const userWords = userInput.split(/\s+/);
        const referenceWords = currentText.trim().split(/\s+/);

        correctWords += userWords.filter((word, index) => word === referenceWords[index]).length;
        incorrectWords += userWords.filter((word, index) => word !== referenceWords[index]).length;

        // Load the next sentence
        loadNextSentence();
    }

    // Calculate real-time WPM
    updateWPM();
});

function updateTimer() {
    if (!isPaused) {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            endGame();
        }
    }
}

function pauseGame() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
}

function endGame() {
    clearInterval(timer);
    textInput.disabled = true;
    startButton.disabled = false;
    pauseButton.disabled = true;

    // Calculate WPM
    const timeTaken = (60 - timeLeft) / 60; // Time taken in minutes
    const grossWPM = Math.round((totalTypedChars / 5) / timeTaken);
    const netWPM = Math.max(0, grossWPM - incorrectWords);

    // Update high score
    if (netWPM > highScore) {
        highScore = netWPM;
        highScoreDisplay.textContent = `High Score: ${highScore} WPM`;
    }

    // Calculate accuracy
    const accuracy = ((correctWords) / (correctWords + incorrectWords)) * 100;

    resultsDisplay.innerHTML = `
        <strong>Time's up!</strong><br>
        Gross WPM: ${grossWPM}<br>
        Net WPM: ${netWPM}<br>
        Correct Words: ${correctWords}<br>
        Incorrect Words: ${incorrectWords}<br>
        Accuracy: ${accuracy.toFixed(2)}%
    `;
}

function updateWPM() {
    const timeTaken = (60 - timeLeft) / 60; // Time taken in minutes
    const grossWPM = Math.round((totalTypedChars / 5) / timeTaken);
    const netWPM = Math.max(0, grossWPM - incorrectWords);
    wpmDisplay.textContent = `WPM: ${netWPM}`;
    timerDisplay.textContent = `Time: ${timeLeft}s | WPM: ${netWPM}`;
}

function changeTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
}