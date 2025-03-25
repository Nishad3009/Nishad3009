const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const aiToggle = document.getElementById('ai-toggle'); // Add a toggle for AI mode

let currentPlayer = 'X';
let gameActive = true;
let gameState = ['', '', '', '', '', '', '', '', ''];
let isAIEnabled = false; // Default AI mode is off

const winningConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal
  [2, 4, 6]  // Diagonal
];

// Function to handle cell clicks
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  if (gameState[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer.toLowerCase());

  checkForWinner();

  if (gameActive && isAIEnabled && currentPlayer === 'X') {
    // Switch to AI's turn
    currentPlayer = 'O';
    aiMove();
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

// Function to check for a winner or draw
function checkForWinner() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
      continue;
    }
    if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes('')) {
    statusText.textContent = 'It\'s a draw!';
    gameActive = false;
    return;
  }
}

// Function to reset the game
function resetGame() {
  gameState = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  statusText.textContent = `It's ${currentPlayer}'s turn`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });

  if (isAIEnabled && currentPlayer === 'O') {
    aiMove(); // AI makes the first move if it's O's turn
  }
}

// Minimax algorithm for AI
function minimax(board, depth, isMaximizing) {
  const scores = {
    X: -10,
    O: 10,
    draw: 0
  };

  // Check for a winner
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (board[a] !== '' && board[a] === board[b] && board[b] === board[c]) {
      return scores[board[a]];
    }
  }

  // Check for a draw
  if (!board.includes('')) {
    return scores.draw;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        const score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Function for AI to make a move
function aiMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < gameState.length; i++) {
    if (gameState[i] === '') {
      gameState[i] = 'O';
      const score = minimax(gameState, 0, false);
      gameState[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  gameState[bestMove] = 'O';
  cells[bestMove].textContent = 'O';
  cells[bestMove].classList.add('o');

  checkForWinner();
  currentPlayer = 'X';
}

// Toggle AI mode
aiToggle.addEventListener('change', () => {
  isAIEnabled = aiToggle.checked;
  resetGame();
});

// Initialize event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);

// Initialize game status
statusText.textContent = `It's ${currentPlayer}'s turn`;