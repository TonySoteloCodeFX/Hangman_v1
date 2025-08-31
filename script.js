/* ====== ASCII art ====== */
const art = [
`  +---+
  |   |
      |
      |
      |
      |
=========

`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========

`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========
`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========
`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========
`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========
`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========
`];

const words = [
  'apple','banana','cherry','dragonfruit','elderberry','fig','grape','honeydew','kiwi','lemon',
  'mango','nectarine','orange','papaya','raspberry','strawberry','vanilla','watermelon','zucchini'
];

/* ====== DOM ====== */
const $art = document.getElementById('art');
const $chancesLeft = document.getElementById('chancesLeft');
const $guessedLetters = document.getElementById('guessedLetters');
const $currentWord = document.getElementById('currentWord');
const $message = document.getElementById('message');
const $guessInput = document.getElementById('guessInput');
const $guessBtn = document.getElementById('guessBtn');
const $restartBtn = document.getElementById('restartBtn');
const $showWordToggle = document.getElementById('showWordToggle');
const $testingWord = document.getElementById('testingWord');

/* ====== Game state ====== */
let chosenWord = '';
let display = [];
let guessedLetters = [];
let chancesLeft = 6;
let artDisplay = 0;
let gameOn = true;

/* ====== Init ====== */
function init() {
  chosenWord = words[Math.floor(Math.random() * words.length)].toLowerCase();
  display = Array.from({ length: chosenWord.length }, () => '_');
  guessedLetters = [];
  chancesLeft = 6;
  artDisplay = 0;
  gameOn = true;

  $message.textContent = '';
  $message.className = 'message';
  $restartBtn.hidden = true;
  $guessInput.disabled = false;
  $guessBtn.disabled = false;
  $guessInput.value = '';
  $guessInput.focus();

  updateTestingWord();
  render();
}

function updateTestingWord() {
  $testingWord.textContent = $showWordToggle.checked ? `Testing Chosen Word: ${chosenWord}` : '';
}

function render() {
  $chancesLeft.textContent = chancesLeft;
  $guessedLetters.textContent = guessedLetters.length ? guessedLetters.join(', ') : '—';
  $art.textContent = art[artDisplay];
  $currentWord.textContent = display.join(' ');
}

/* ====== Game logic ====== */
function handleGuess() {
  if (!gameOn) return;

  const raw = $guessInput.value || '';
  const guess = raw.toLowerCase().trim();
  $guessInput.value = '';

  // Validate: single [a-z]
  if (guess.length !== 1 || !/[a-z]/.test(guess)) {
    toast('You can only guess a single letter (A–Z). Try again.', 'bad');
    return;
  }

  if (guessedLetters.includes(guess)) {
    toast("You already guessed that one! Try again!", 'bad');
    return;
  }

  guessedLetters.push(guess);

  if (chosenWord.includes(guess)) {
    // Reveal letters
    for (let i = 0; i < chosenWord.length; i++) {
      if (chosenWord[i] === guess) display[i] = guess;
    }
    toast('Good guess!', 'ok');
  } else {
    chancesLeft -= 1;
    artDisplay = Math.min(artDisplay + 1, art.length - 1);
    toast(`Nope! "${guess}" is not in the word.`, 'bad');
  }

  // Win/Lose checks
  if (!display.includes('_')) {
    endGame(true);
  } else if (chancesLeft === 0) {
    endGame(false);
  }

  render();
}

function endGame(won) {
  gameOn = false;
  $guessInput.disabled = true;
  $guessBtn.disabled = true;
  $restartBtn.hidden = false;

  if (won) {
    $message.textContent = `You won! You guessed the word: ${chosenWord}. Game over.`;
    $message.className = 'message ok';
  } else {
    // Make sure final art shows the last frame
    artDisplay = art.length - 1;
    render();
    $message.textContent = `You lose! The word was "${chosenWord}". Game over.`;
    $message.className = 'message bad';
  }
}

function toast(text, type) {
  $message.textContent = text;
  $message.className = `message ${type || ''}`;
}

/* ====== Events ====== */
$guessBtn.addEventListener('click', handleGuess);
$guessInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleGuess();
});
$restartBtn.addEventListener('click', init);
$showWordToggle.addEventListener('change', updateTestingWord);

/* START */
init();
