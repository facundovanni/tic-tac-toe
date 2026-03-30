import "./styles.css";
import { Player } from "./models/Player";
import { SetupMenu } from "./view/SetupMenu";
import { GameUI } from "./view/GameUI";
import { GameBoard } from "./models/GameBoard";
import { GameController } from "./controllers/GameController";
import { gameStore } from "./store/GameStore";

class TicTacToeGame {
  #size;
  #app;

  constructor(size = 3) {
    this.#size = size;
    this.#app = document.querySelector("#app");
    this.#app.className = "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8";

    this.init();
  }

  init() {
    gameStore.clearConfig();
    const menu = new SetupMenu(this.#app, (config) => {
      gameStore.saveConfig(config);
      this.#handleStart(config);
    });
    menu.render();
  }

  #handleStart(config) {
    const players = [
      new Player(config.player1.name, "X", true),
      new Player(config.player2.name, "O", config.player2.isHuman)
    ];

    const startingIndex = Math.floor(Math.random() * 2);
    const boardLogic = new GameBoard(this.#size);
    const ui = new GameUI(this.#app);

    const controller = new GameController(
      boardLogic,
      ui,
      players,
      startingIndex,
      () => this.init(),
      () => this.#handleStart(config)
    );

    ui.render(this.#size, players, (r, c, el) => controller.handleMove(r, c, el));

    controller.start();
  }

}

new TicTacToeGame(3);