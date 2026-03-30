import "./styles.css";
import { Player } from "./models/Player";
import { SetupMenu } from "./view/SetupMenu";
import { GameUI } from "./view/GameUI";
import { GameBoard } from "./models/GameBoard";
import { GameController } from "./controllers/GameController";

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
    const menu = new SetupMenu(this.#app, (config) => this.#handleStart(config));
    menu.render();
  }

  #handleStart(config) {
    const players =[
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
      () => this.init()
    );

    ui.render(this.#size, players, (r, c, el) => controller.handleMove(r, c, el));
    ui.updateTurn(players[startingIndex], true);
  }

}

new TicTacToeGame(3);