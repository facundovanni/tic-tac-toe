export class GameController {
  #boardLogic;
  #ui;
  #players;
  #currentPlayerIndex;
  #isGameOver;
  #onGameEnd;

  constructor(boardLogic, ui, players, startingIndex, onGameEnd) {
    this.#boardLogic = boardLogic;
    this.#ui = ui;
    this.#players = players;
    this.#currentPlayerIndex = startingIndex;
    this.#onGameEnd = onGameEnd;
    this.#isGameOver = false;
  }

  handleMove(row, col, element) {
    if (this.#isGameOver) return;

    const currentPlayer = this.#players[this.#currentPlayerIndex];

    if (!this.#boardLogic.setMove(row, col, currentPlayer.symbol)) return;

    this.#ui.updateCell(element, currentPlayer.symbol);

    if (this.#checkGameState(row, col, currentPlayer)) return;

    this.#nextTurn();
  }

  #checkGameState(row, col, player) {
    if (this.#boardLogic.checkWin(row, col, player.symbol)) {
      this.#isGameOver = true;
      this.#ui.showResult(true, `¡${player.name} ha vencido!`, this.#onGameEnd);
      return true;
    }

    if (this.#boardLogic.isDraw()) {
      this.#isGameOver = true;
      this.#ui.showResult(false, "No hay más movimientos posibles.", this.#onGameEnd);
      return true;
    }
    return false;
  }

  #nextTurn() {
    this.#currentPlayerIndex = this.#currentPlayerIndex === 0 ? 1 : 0;
    const nextPlayer = this.#players[this.#currentPlayerIndex];
    this.#ui.updateTurn(nextPlayer);
  }
}