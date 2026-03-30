import "./styles.css";
import { Player } from "./models/Player.js";
import { SetupMenu } from "./view/SetupMenu.js";
import { GameUI } from "./view/GameUI.js";
import { GameBoard } from "./models/GameBoard.js";
import { GameController } from "./controllers/GameController.js";
import { gameStore } from "./store/GameStore.js";

const GAME_TITLE = "Tic Tac Toe";
class TicTacToeGame {
  #app;

  constructor() {
    this.#app = document.querySelector("#app");
    this.#app.className = "min-h-screen bg-background text-text-main flex flex-col items-center justify-center p-4 sm:p-8 transition-colors duration-500";
    this.init();
  }

  init() {
    gameStore.clearAll();
    const menu = new SetupMenu(this.#app, GAME_TITLE, (config) => {
      gameStore.saveConfig(config);
      this.#handleStart(config);
    });
    menu.render();
  }

  #handleStart(config) {
    const size = config.size || 3;

    const players = [
      new Player(config.player1.name, "X", true),
      new Player(config.player2.name, "O", config.player2.isHuman)
    ];

    const startingIndex = Math.floor(Math.random() * 2);
    const boardLogic = new GameBoard(size);
    const ui = new GameUI(this.#app, GAME_TITLE);

    const controller = new GameController(
      boardLogic,
      ui,
      players,
      startingIndex,
      () => this.init(),
      () => this.#handleStart(config)
    );

    ui.render(size, players, (r, c, el) => controller.handleMove(r, c, el), () => this.init());

    controller.start();
  }

}

new TicTacToeGame();