import './sudoku.css';
import { getSudoku } from 'sudoku-gen';

const sudokuContainer = document.getElementById("sudoku-container");
const numberPad = document.getElementById('number-pad');
let selectedCell = null;
let currentValue = null;

let sudokuBoard = [];
let sudokuBoardHistory = [];
let redoStack = [];

// Check if placing a number is valid
// Unused, but leaving for now as an alternative way to check if solution is good.
function isValidMove(board, row, col, num) {
  // Check row and column
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) {
      return false;
    }
  }

  // Check 3x3 grid
  let startRow = Math.floor(row / 3) * 3;
  let startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) {
        return false;
      }
    }
  }
  return true;
}

function displayBoard(difficulty) {
  sudokuContainer.innerHTML = "";
  let sudoku = getSudoku(difficulty);
  let prefilledCells = sudoku.puzzle;
  let i = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('div');
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (prefilledCells[i] !== '-') {
        cell.textContent = prefilledCells[i];
        cell.disabled = true;
        cell.classList.add("prefilled");
        Object.defineProperty(cell, "textContent", {
          set: function (value) {
            console.log("Attempt to change textContent is blocked.");
          },
          get: function () {
            return this.innerHTML;
          }
        });
      }
      cell.addEventListener('click', () => selectCell(cell));

      sudokuContainer.appendChild(cell);
      i++;
    }
  }

  saveBoardState();

  let solution = sudoku.solution;
  const solutionDiv = document.getElementById('solution');
  solutionDiv.style.display = 'none';
  solutionDiv.textContent = solution;
}

function selectCell(cell) {
  if (selectedCell) {
    selectedCell.classList.remove('selected');
  }
  selectedCell = cell;
  selectedCell.classList.add('selected');
}

numberPad.addEventListener('click', (e) => {
  const button = e.target;
  if (button.classList.contains('num-button')) {
    currentValue = button.dataset.value;
    if (selectedCell) {
      selectedCell.textContent = currentValue;
    }
  }
  saveBoardState();
});

function startNewGame(difficulty) {
  displayBoard(difficulty);
}

function getBoardValues() {
  let boardValues = [];
  let cells = document.querySelectorAll('.cell');

  cells.forEach(cell => {
    boardValues.push(cell.textContent);
  });

  return boardValues.join('');
}

function checkSolution() {
  sudokuBoard = getBoardValues();
  let solution = document.querySelector('#solution').textContent;
  if (sudokuBoard == solution) {
    showModal("Congratulations! You solved the Sudoku puzzle!");
  } else {
    showModal("Solution is incorrect. Keep trying!");
  }
}

document.getElementById('easy-button').addEventListener('click', () => startNewGame('easy'));
document.getElementById('medium-button').addEventListener('click', () => startNewGame('medium'));
document.getElementById('hard-button').addEventListener('click', () => startNewGame('hard'));
document.getElementById('expert-button').addEventListener('click', () => startNewGame('expert'));
document.getElementById('check-solution').addEventListener('click', checkSolution);
document.getElementById('start-game').addEventListener('click', startNewGame('easy'));
document.getElementById('clear-cell-button').addEventListener('click', clearCell);

//Add undo/redo button
document.getElementById('undo-button').addEventListener('click', undoLastMove);
document.getElementById('redo-button').addEventListener('click', redoLastMove);

function saveBoardState() {
  const currentBoardState = [];
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    currentBoardState.push(cell.textContent);
  });

  sudokuBoardHistory.push(currentBoardState);
  redoStack = [];
}

function undoLastMove() {
  if (sudokuBoardHistory.length > 1) {
    const currentState = sudokuBoardHistory.pop();
    redoStack.push(currentState);

    const previousState = sudokuBoardHistory[sudokuBoardHistory.length - 1];
    applyBoardState(previousState);
  }
}

function redoLastMove() {
  if (redoStack.length > 0) {
    const redoState = redoStack.pop();
    sudokuBoardHistory.push(redoState);
    applyBoardState(redoState);
  }
}

function applyBoardState(state) {
  let index = 0;
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    const value = state[index];
    if (!cell.disabled) {
      cell.textContent = value;
    }
    index++;
  });
}

//Add solve button
document.getElementById('solve-button').addEventListener('click', solve);

function solve() {
  let cells = document.querySelectorAll('.cell');
  let solution = document.querySelector('#solution').textContent;

  cells.forEach((cell, i) => {
    if (!cell.textContent) {
      if (!cell.classList.contains('prefilled')) {
        cell.textContent = solution[i];
        cell.style.backgroundColor = 'green';
      }
    }
  });
}
//Add clear board
document.getElementById('clear-board-button').addEventListener('click', clearBoard);

function clearBoard() {
  let cells = document.querySelectorAll('.cell');

  cells.forEach((cell, i) => {
    cell.textContent = '';
    cell.style.backgroundColor = 'white';
  });
}

//Add hint button
document.getElementById('hint-button').addEventListener('click', hint);

//Some issue in logic. The smaller amount of empty cells the more probable it becomes that hint will not actually input a value somewhere on the board.
function hint() {
  let cells = document.querySelectorAll('.cell');
  let solution = document.querySelector('#solution').textContent;
  let emptyCells = [];

  for (let i = 0; i < 81; i++) {
    if (!cells[i].textContent) {
      emptyCells.push(i);
    }
  }

  let cellNumber = getRandom(emptyCells);

  if (cellNumber || cellNumber == 0) {
    cells[cellNumber].textContent = solution[cellNumber];
    cells[cellNumber].style.backgroundColor = 'orange';
  }
}

function getRandom(list) {
  return list[Math.floor((Math.random() * list.length))];
}

function showModal(message) {
  const modal = document.getElementById('error-modal');
  const modalMessage = document.getElementById('modal-message');
  const closeBtn = document.getElementById('close-modal-btn');

  // Set the message inside the modal
  modalMessage.textContent = message;

  // Show the modal
  modal.style.display = 'flex';

  // Close the modal when the user clicks the close button
  closeBtn.onclick = function () {
    modal.style.display = 'none';
  };

  // Close the modal if the user clicks anywhere outside of the modal content
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

function clearCell() {

  numberPad.addEventListener('click', (e) => {
    const button = e.target;
    if (button.classList.contains('clear-cell-button')) {
      if (selectedCell) {
        selectedCell.textContent = '';
      }
    }
    saveBoardState();
  });

}

//Need to display difficulty selected
//Display if solved correctly on last cell input
//Timeris