// Select the board element
const boardElement = document.getElementById("board");
const utilBox = document.getElementById("addUtil");
let moveStack = [];
const boardSize = 15;
let board = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));

let currentPlayer = 'white'; // white goes second

const resetBut = document.createElement("button");
resetBut.id = "reseetBtn";
resetBut.classList.add("buttons");
resetBut.addEventListener("click", resetGame);
resetBut.innerHTML = "Reset Game";
utilBox.appendChild(resetBut);

const undoBut = document.createElement("button");
undoBut.id = "undoBtn";
undoBut.classList.add("buttons");
undoBut.addEventListener("click", undo);
undoBut.innerHTML = "undo / takeback";
utilBox.appendChild(undoBut);



// Create the board cells
for (let row = 0; row < boardSize; row++) {
  for (let col = 0; col < boardSize; col++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.row = row;
    cell.dataset.col = col;
    if(row === 7 && col ===7){
      const piece = document.createElement("div");
      moveStack.push({row: row, col: col, player: 'black'});
      board[row][col] = 'black';
      piece.classList.add("piece");
      piece.classList.add("black");
      cell.appendChild(piece);
    }
    cell.addEventListener("click", handleCellClick);
    cell.addEventListener("mouseover", handleHover);
    cell.addEventListener("mouseout", clearHover);
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

  // add to moveStack
  moveStack.push({row: row, col: col, player: currentPlayer});

  // Create a piece (circle)
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(currentPlayer);
  event.target.appendChild(piece);
  //remove ghost piece
  const ghost = event.target.querySelector(".ghost");
  if (ghost) ghost.remove();

  // Check for a winner
  if (checkWin(row, col)) {
    alert(`${currentPlayer} wins!`);
    resetGame();
    return;
  }

  // Switch turns
  currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

function handleHover(event) {
  const row = parseInt(event.target.dataset.row);
  const col = parseInt(event.target.dataset.col);

  // Only show preview if the cell is empty
  if (board[row][col] === null) {
    const ghost = document.createElement("div");
    ghost.classList.add("piece", "ghost", currentPlayer);
    ghost.style.pointerEvents = "none"; // Prevent accidental clicks
    event.target.appendChild(ghost);
  }
}

function clearHover(event) {
  const ghost = event.target.querySelector(".ghost");
  if (ghost) ghost.remove();
}



function checkWin(row, col) {
  // Directions: horizontal, vertical, and two diagonals
  console.log("checking winners?");
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
  moveStack = [];
  for (let cell of cells) {
    if(parseInt(cell.dataset.row) === 7 && parseInt(cell.dataset.col) === 7 ){
      board[parseInt(cell.dataset.row)][parseInt(cell.dataset.col)] = 'black';
      moveStack.push({row: 7, col: 7, player: 'black'});
      continue;
    }
    cell.innerHTML = '';
  }
  // second move: white
  currentPlayer = 'white';
}

function undo() {
  if(moveStack.length > 1){
    const lastMove = moveStack.pop();
    board[lastMove.row][lastMove.col] = null;
    // Also remove the visual piece from the DOM
    const cell = document.querySelector(`[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
    cell.innerHTML = "";
    // Restore the turn
    currentPlayer = lastMove.player;
  }
  else{
    alert("changing the first move is not acceptable lil bro go lick my butt");
  }
}
// renju rule part

function isForbiddenMove(row, col) {
  if (currentPlayer !== 'black') return false; // Renju rule only applies to Black
  if (board[row][col] !== null) return false; // Can’t place on occupied space

  // Temporarily place a black stone
  board[row][col] = 'black';

  const counts = {
    threes: 0,
    fours: 0,
    overline: false // 6 or more
  };

  const directions = [
    [0, 1],  // horizontal
    [1, 0],  // vertical
    [1, 1],  // diagonal \
    [1, -1], // diagonal /
  ];

  for (let [dr, dc] of directions) {
    const line = getLine(row, col, dr, dc); // e.g. [null, 'black', 'black', 'black', null]
    const patterns = analyzeLine(line);
    counts.threes += patterns.threes;
    counts.fours += patterns.fours;
    if (patterns.overline) counts.overline = true;
  }

  // Remove the temp move
  board[row][col] = null;

  // 6-moku check
  if (counts.overline) return true;

  // 33 violation
  if (counts.threes >= 2) return true;

  // 44 violation
  if (counts.fours >= 2) return true;

  return false;
}

function getLine(row, col, dr, dc) {
  const line = [];

  for (let i = -4; i <= 4; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
      line.push(board[r][c]);
    } else {
      line.push('wall'); // Treat out-of-bounds as wall
    }
  }

function analyzeLine(line) {
  const str = line.map(cell => {
    if (cell === 'black') return 'b';
    if (cell === null) return '_';
    return 'x'; // white, wall, or any blocking
  }).join('');

  let threes = 0;
  let fours = 0;
  let overline = false;

  // Detect 6 or more in a row
  if (/bbbbb+b/.test(str) || /bbbbbb+/.test(str)) {
    overline = true;
  }

  // Detect open threes (both ends open)
  const threePatterns = [
    /_bbb_/,       // basic open 3
    /_bb_b_/,      // 띈삼 pattern
    /_b_bb_/,      // another 띈삼
  ];
  threePatterns.forEach(pattern => {
    const matches = str.match(new RegExp(pattern, 'g'));
    if (matches) threes += matches.length;
  });

  // Detect open fours
  const fourPatterns = [
    /_bbbb_/,      // standard open 4
    /_bbb_b_/,     // 띈사 gapped four
    /_bb_bb_/,     // another 띈사
    /_b_bbb_/,     // another 띈사
  ];
  fourPatterns.forEach(pattern => {
    const matches = str.match(new RegExp(pattern, 'g'));
    if (matches) fours += matches.length;
  });

  return { threes, fours, overline };
}


  return line;
}
