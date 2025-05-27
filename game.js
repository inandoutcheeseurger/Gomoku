const boardSize = 15; // 15x15 Gomoku board
let board = [];
let currentPlayer = 'X'; // Player X goes first

// Create the board structure
const boardElement = document.getElementById('board');
const resetButton = document.getElementById('reset');

function createBoard() {
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.addEventListener('click', () => handleCellClick(i, j));
      boardElement.appendChild(cell);
      row.push(cell);
    }
    board.push(row);
  }
}

// Handle the cell click
function handleCellClick(i, j) {
  if (!board[i][j].textContent) {
    board[i][j].textContent = currentPlayer;
    board[i][j].style.color = currentPlayer === 'X' ? 'black' : 'white';

    if (checkWinner(i, j)) {
      alert(currentPlayer + ' wins!');
      return;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
}

// Check if there's a winner
function checkWinner(row, col) {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal
  ];

  for (let [dx, dy] of directions) {
    let count = 1;

    for (let i = 1; i < 5; i++) {
      const x = row + dx * i;
      const y = col + dy * i;
      if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y].textContent === currentPlayer) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      const x = row - dx * i;
      const y = col - dy * i;
      if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && board[x][y].textContent === currentPlayer) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) return true;
  }
  return false;
}

// Reset the game
resetButton.addEventListener('click', () => {
  board = [];
  boardElement.innerHTML = '';
  createBoard();
  currentPlayer = 'X'; // Reset to player X
});

// Initialize the board
createBoard();
