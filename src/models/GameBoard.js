export class GameBoard {
  #size;
  #grid;
  #moveCount;

  constructor(size) {
    this.#size = size;
    this.#moveCount = 0;
    this.#grid = Array.from({ length: size }, () => Array(size).fill(null));
  }

  get size() { return this.#size; }

  setMove(row, col, symbol) {
    if (this.#grid[row][col] !== null) return false;
    this.#grid[row][col] = symbol;
    this.#moveCount++;
    return true;
  }

  getGameState(row, col, symbol) {
    const isWin = this.#checkWin(row, col, symbol);
    if (isWin) return { isGameOver: true, winner: symbol, isDraw: false };

    const isDraw = this.#moveCount === (this.#size * this.#size);
    if (isDraw) return { isGameOver: true, winner: null, isDraw: true };

    return { isGameOver: false, winner: null, isDraw: false };
  }

  #checkWin(row, col, symbol) {
    const n = this.#size;
    if (this.#moveCount < (2 * n - 1)) return false;

    return (
      this.#grid[row].every(cell => cell === symbol) ||
      this.#grid.every(r => r[col] === symbol) ||
      (row === col && this.#grid.every((r, i) => r[i] === symbol)) ||
      (row + col === n - 1 && this.#grid.every((r, i) => r[n - 1 - i] === symbol))
    );
  }

  getAvailableMoves() {
    const moves = [];
    this.#grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) moves.push({ row: rowIndex, col: colIndex });
      });
    });
    return moves;
  }
}