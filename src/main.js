import "./styles.css";
import { Player } from "./models/Player";
import { SetupMenu } from "./view/SetupMenu";
import { GameUI } from "./view/GameUI";

class TicTacToeGame {
  #size;
  #players;
  #currentPlayerIndex;
  #app;
  
  constructor(size = 3) {
    this.#size = size;
    this.#players = [];
    this.#currentPlayerIndex = 0;
    this.#app = document.querySelector("#app");

    this.#app.className = "min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8";

    this.init();
  }

  init() {
    const menu = new SetupMenu(this.#app, (config) => this.#handleStart(config));
    menu.render();
  }

  #handleStart(config) {
    this.#players = [
      new Player(config.player1.name, "X", true),
      new Player(config.player2.name, "O", config.player2.isHuman)
    ];

    console.log("Game Starting with:", this.#players);
    this.#renderGameBoard();
  }

  #renderGameBoard() {
        this.#app.innerHTML = `<h1 class="text-white">Tablero de ${this.#size}x${this.#size} listo</h1>`;

    
  }
}

new TicTacToeGame(3);