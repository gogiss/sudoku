import './sudoku.css';
import { getSudoku } from 'sudoku-gen';

const sudokuContainer = document.getElementById("sudoku-container");
const numberPad = document.getElementById('number-pad');
let selectedCell = null;  // Track the currently selected Sudoku cell
let currentValue = null;  // Store the selected number for input

let sudokuBoard = [];

function generateBlankBoard() {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

// Check if placing a number is valid
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
  sudokuBoard = generateBlankBoard();
  sudokuContainer.innerHTML = "";  
  let sudoku = getSudoku(difficulty);
  let prefilledCells = sudoku.puzzle;
  let i = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('div');
      cell.type = "text";
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      if (prefilledCells[i] !== '-') {
        cell.textContent = prefilledCells[i];
        cell.disabled = true;
        cell.classList.add("prefilled");
      }
      cell.addEventListener('click', () => selectCell(cell));

      sudokuContainer.appendChild(cell);
      i++;
    }
  }
  
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
    currentValue = button.dataset.value;  // Get the selected number
    if (selectedCell) {
      selectedCell.textContent = currentValue;  // Set the value in the selected cell
    }
  }
});

function startNewGame(difficulty) {
  displayBoard(difficulty);
}

function checkSolution() {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const value = sudokuBoard[row][col];
      if (
        value === 0 ||
        !isValidMove(sudokuBoard, row, col, value)
      ) {
        alert("Solution is incorrect. Keep trying!");
        return;
      }
    }
  }
  alert("Congratulations! You solved the Sudoku puzzle!");
}

startNewGame("easy");

document.getElementById('easy-button').addEventListener('click', () => startNewGame('easy'));
document.getElementById('medium-button').addEventListener('click', () => startNewGame('medium'));
document.getElementById('hard-button').addEventListener('click', () => startNewGame('hard'));
document.getElementById('expert-button').addEventListener('click', () => startNewGame('expert'));
document.getElementById('check-solution').addEventListener('click', checkSolution);