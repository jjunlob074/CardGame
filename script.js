const gameBoard = document.getElementById('game-board');
const levelDisplay = document.getElementById('level');
const attemptsDisplay = document.getElementById('attempts');
const restartButton = document.getElementById('restart');
const matchSound = new Audio('./correct.mp3');
const levelComplete = new Audio('./success.mp3');
const failSound = new Audio('./wrong.mp3');
let level = 1;
let attempts = 10;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Lista extensa de íconos modernos
const icons = [
  '🎨', '🚀', '🛠', '🎯', '💻', '📱', '📷', '🌟', '🔋', '🔗', 
  '🧩', '📊', '📈', '📉', '🗂', '🎧', '🎤', '🎥', '🕹', '📡',
  '💡', '📥', '📤', '🗑', '📦', '📁', '🌐', '🖥', '⌚', '🖱',
  '🖲', '🖋', '📌', '🧾', '🎟', '🗺', '🖼', '📎', '🗳', '🔒',
  '🔓', '🔍', '🔎', '🔔', '📶', '📀', '💿', '📺', '💾', '💰',
  '🔑', '📇', '📬', '📭', '📧', '📩', '📨', '✉', '📮', '📪',
  '📫', '📬', '📤', '📥', '🗂', '🗃', '🗄', '🔐', '🔏', '🖍',
  '🖌', '🖊', '🖋', '✏', '✂', '🗂', '🗞', '🗒', '🗳', '📉',
  '📈', '📊', '📂', '📁', '📇', '📔', '📒', '📕', '📖', '📗',
  '📘', '📙', '📚', '📜', '📝', '🖋', '🖊', '🔎', '🖥', '💻'
];

// Genera un color aleatorio
function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Genera las cartas para el nivel actual
function generateCards() {
  const levelCards = [];
  const numPairs = level + 2;
  const chosenIcons = icons.slice(0, numPairs); // Selecciona los íconos necesarios para el nivel

  for (let i = 0; i < numPairs; i++) {
    const cardData = {
      color: getRandomColor(), // Genera un color aleatorio
      icon: chosenIcons[i]
    };
    levelCards.push({ ...cardData });
    levelCards.push({ ...cardData }); // Duplicado para la pareja
  }

  return shuffleArray(levelCards);
}

// Baraja las cartas
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Crea las cartas en el tablero
function renderCards() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(3, 1fr)`;
  
    cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.index = index;
  
      // Se mantiene la estructura con front y back
      const front = document.createElement('div');
      front.classList.add('front');
      front.style.backgroundColor = '#FFFFFF';
     
  
      const back = document.createElement('div');
      back.classList.add('back');
      back.style.backgroundColor = card.color;
      back.textContent = card.icon;
  
      // Se agregan las partes al cardElement
      cardElement.appendChild(front);
      cardElement.appendChild(back);
  
      cardElement.addEventListener('click', handleCardClick);
      gameBoard.appendChild(cardElement);
    });
  }
  

// Maneja el clic en una carta
function handleCardClick(e) {
    const cardElement = e.target.closest('.card');
    const index = cardElement.dataset.index;
  
    if (flippedCards.length < 2 && !cardElement.classList.contains('flipped')) {
      cardElement.classList.add('flipped');
      flippedCards.push({ ...cards[index], element: cardElement });
  
      // Anula backface-visibility para las partes frontal y trasera
      const front = cardElement.querySelector('.front');
      const back = cardElement.querySelector('.back');
      
      // Asegura que la parte trasera sea visible al voltear
      front.style.backfaceVisibility = 'visible';
      back.style.backfaceVisibility = 'visible';
  
      if (flippedCards.length === 2) {
        checkMatch();
      }
    }
  }
  

// Comprueba si las cartas coinciden
function checkMatch() {
    const [card1, card2] = flippedCards;
  
    if (card1.color === card2.color && card1.icon === card2.icon) {
      // Reproducir el sonido de acierto
      matchSound.play();
  
      // Si las cartas coinciden, mantenemos el backface visible
      matchedPairs++;
      flippedCards = [];
  
      // Si hemos emparejado todas las cartas, avanzamos al siguiente nivel
      if (matchedPairs === cards.length / 2) {
        levelComplete.play();
        setTimeout(nextLevel, 1000);
      }
    } else {
      // Reproducir el sonido de fallo
      failSound.play();
  
      // Si no coinciden, decrementamos los intentos
      attempts--;
      attemptsDisplay.textContent = attempts;
  
      // Después de 1 segundo, restauramos el backface-visibility a 'hidden' para las cartas no coincidentes
      setTimeout(() => {
        flippedCards.forEach(({ element }) => {
          element.classList.remove('flipped');
          const back = element.querySelector('.back');
          const front = element.querySelector('.front');
          back.style.backfaceVisibility = 'hidden';
          front.style.backfaceVisibility = 'hidden';
        });
        flippedCards = [];
      }, 1000);
  
      // Si no quedan intentos, el juego termina
      if (attempts === 0) {
        setTimeout(gameOver, 1000);
      }
    }
  }
  

// Avanza al siguiente nivel
function nextLevel() {
  level++;
  levelDisplay.textContent = level;
  attempts = 10; // Intentos fijos para cada nivel
  attemptsDisplay.textContent = attempts;
  matchedPairs = 0;
  initGame();
}

// Termina el juego
function gameOver() {
  alert('Fin del juego. has llegado al nivel ' + levelDisplay.textContent);
  level = 1;
  attempts = 10;
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  levelDisplay.textContent = level;
  attemptsDisplay.textContent = attempts;
  initGame();
}

// Inicializa el juego
function initGame() {
  cards = generateCards();
  renderCards();
}

// Reinicia el juego
restartButton.addEventListener('click', gameOver);

// Inicia el juego al cargar
initGame();
