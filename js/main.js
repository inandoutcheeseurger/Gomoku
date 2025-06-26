// Select the board element
const boardElement = document.getElementById("board");
const boardSize = 15;
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));

let currentPlayer = 'white'; // white goes second

// Create the board cells
for (let row = 0; row < boardSize; row++) {
  for (let col = 0; col < boardSize; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    if(row === 7 && col ===7){
      const piece = document.createElement("div");
      piece.classList.add("piece");
      piece.classList.add("black");
      cell.appendChild(piece);
    }
    cell.addEventListener("click", handleCellClick);
    boardElement.appendChild(cell);
  }
}

function handleCellClick(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col); 

  // If the cell is already occupied, do nothing
  if (board[row][col] !== null) return;

  // Place the piece
  board[row][col] = currentPlayer;

  // Create a piece (circle)
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(currentPlayer);
  event.target.appendChild(piece);

  // Check for a winner
  if (checkWin(row, col)) {
    alert(`${currentPlayer} wins!`);
    resetGame();
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

function checkWin(row, col) {
  // Directions: horizontal, vertical, and two diagonals
  const directions = [
    [[0, 1], [0, -1]], // Horizontal
    [[1, 0], [-1, 0]], // Vertical
    [[1, 1], [-1, -1]], // Diagonal \
    [[1, -1], [-1, 1]]  // Diagonal /
  ];

  for (let direction of directions) {
    let count = 1;

    for (let [dr, dc] of direction) {
      let r = row + dr;
      let c = col + dc;
      while (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c] === currentPlayer) {
        count++;
        r += dr;
        c += dc;
      }
    }
    console.log(count);
    if (count >= 5) return true;
  }

  return false;
}

function resetGame() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.innerHTML = ''); // Clear the board
}
