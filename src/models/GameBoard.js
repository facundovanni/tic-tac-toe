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

  checkWin(row, col, symbol) {
    const n = this.#size;
    const minMoves = (2 * n) - 1;
    
    if (this.#moveCount < minMoves) return false;

    // 1. Fila
    if (this.#grid[row].every(cell => cell === symbol)) return true;
    // 2. Columna
    if (this.#grid.every(r => r[col] === symbol)) return true;
    // 3. Diagonal Principal
    if (row === col && this.#grid.every((r, i) => r[i] === symbol)) return true;
    // 4. Diagonal Inversa
    if (row + col === n - 1 && this.#grid.every((r, i) => r[n - 1 - i] === symbol)) return true;

    return false;
  }

  isDraw() {
    return this.#moveCount === (this.#size * this.#size);
  }
}