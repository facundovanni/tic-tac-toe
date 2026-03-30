import "./styles.css";
import { Player } from "./models/Player";
import { SetupMenu } from "./view/SetupMenu";
import { GameUI } from "./view/GameUI";
import { GameBoard } from "./models/GameBoard";

class TicTacToeGame {
  #size;
  #players;
  #currentPlayerIndex;
  #ui;
  #app;
  #boardLogic;
  #isGameOver;

  constructor(size = 3) {
    this.#size = size;
    this.#players = [];
    this.#currentPlayerIndex = 0;
    this.#app = document.querySelector("#app");
    this.#isGameOver = false;
    this.#app.className = "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8";

    this.init();
  }

  init() {
    const menu = new SetupMenu(this.#app, (config) => this.#handleStart(config));
    menu.render();
  }

  #handleStart(config) {
    this.#isGameOver = false;
    this.#players = [
      new Player(config.player1.name, "X", true),
      new Player(config.player2.name, "O", config.player2.isHuman)
    ];
    this.#currentPlayerIndex = Math.floor(Math.random() * 2);
    this.#boardLogic = new GameBoard(this.#size);
    this.#renderGameBoard();
  }

  #renderGameBoard() {
    this.#ui = new GameUI(this.#app);

    const startingPlayer = this.#players[this.#currentPlayerIndex];
    
    this.#ui.render(this.#size, this.#players, (row, col, element) => {
      this.#handleMove(row, col, element);
    });
    
    this.#ui.updateTurn(startingPlayer, true);
  }

  #handleMove(row, col, element) {
    if (this.#isGameOver) return;

    const currentPlayer = this.#players[this.#currentPlayerIndex];

    const moveAccepted = this.#boardLogic.setMove(row, col, currentPlayer.symbol);
    if (!moveAccepted) return;

    this.#ui.updateCell(element, currentPlayer.symbol);

    if (this.#boardLogic.checkWin(row, col, currentPlayer.symbol)) {
      this.#isGameOver = true;
      this.#ui.showResult(true, `¡${currentPlayer.name} ha vencido!`, () => this.init());
      return;
    }

    if (this.#boardLogic.isDraw()) {
      this.#isGameOver = true;
      this.#ui.showResult(false, "No hay más movimientos posibles.", () => this.init());
      return;
    }

    this.#currentPlayerIndex = this.#currentPlayerIndex === 0 ? 1 : 0;
    this.#ui.updateTurn(this.#players[this.#currentPlayerIndex]);
  }


}

new TicTacToeGame(3);