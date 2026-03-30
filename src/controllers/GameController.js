import { gameStore } from "../store/GameStore";

export class GameController {
  #boardLogic;
  #ui;
  #players;
  #currentPlayerIndex;
  #isGameOver;
  #isInputLocked;
  #onGameEnd;
  #onReplay;

  constructor(boardLogic, ui, players, startingIndex, onRestart, onReplay) {
    this.#boardLogic = boardLogic;
    this.#ui = ui;
    this.#players = players;
    this.#currentPlayerIndex = startingIndex;
    this.#onGameEnd = onRestart;
    this.#onReplay = onReplay;
    this.#isGameOver = false;
    this.#isInputLocked = false;
    this.#isInputLocked = false;
  }

  handleMove(row, col, element) {
    if (this.#isGameOver || this.#isInputLocked) return;

    const player = this.#players[this.#currentPlayerIndex];
    if (!this.#boardLogic.setMove(row, col, player.symbol)) return;

    this.#ui.updateCell(element, player.symbol);

    const { isGameOver, winner } = this.#boardLogic.getGameState(row, col, player.symbol);

    if (isGameOver) {
      this.#finishGame(winner ? `¡${player.name} ha vencido!` : "Empate técnico.", !!winner, player.symbol);
      return;
    }

    this.#nextTurn();
  }

  #finishGame(message, isWin, winnerSymbol) {
    this.#isGameOver = true;
    this.#isInputLocked = true;
    this.#ui.setBoardLock(true);

    if (isWin && winnerSymbol) {
      gameStore.saveWinner(winnerSymbol);
    }

    setTimeout(() => {
      this.#ui.showResult(isWin, message, this.#onGameEnd, this.#onReplay);
    }, 600);
  }

  #nextTurn() {
    this.#currentPlayerIndex = (this.#currentPlayerIndex + 1) % 2;
    const nextPlayer = this.#players[this.#currentPlayerIndex];
    this.#ui.updateTurn(nextPlayer);

    if (!nextPlayer.isHuman && !this.#isGameOver) {
      this.#isInputLocked = true;
      this.#ui.setBoardLock(true);
      this.#handleAIMove();
    } else {
      this.#isInputLocked = false;
      this.#ui.setBoardLock(false);
    }
  }

  #handleAIMove() {
    const availableMoves = this.#boardLogic.getAvailableMoves();
    if (availableMoves.length === 0) return;

    const { row, col } = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    setTimeout(() => {
      if (this.#isGameOver) return;

      const cellElement = document.querySelector(`button[data-row="${row}"][data-col="${col}"]`);

      this.#isInputLocked = false;
      this.handleMove(row, col, cellElement);
    }, 800);
  }

  start() {
    const startingPlayer = this.#players[this.#currentPlayerIndex];
    this.#ui.updateTurn(startingPlayer, true);

    if (!startingPlayer.isHuman) {
      this.#handleAIMove();
    }
  }
}