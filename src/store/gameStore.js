class GameStore {
  #state = {
    player1Wins: 0,
    player2Wins: 0,
    lastConfig: null,
  };

  #STORAGE_KEY = "tictactoe_v1_data";

  constructor() {
    this.#loadFromStorage();
  }

  #loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.#STORAGE_KEY);
      if (saved) {
        this.#state = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading from storage", error);
    }
  }

  #saveToStorage() {
    localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(this.#state));
  }

  saveWinner(symbol) {
    if (symbol === "X") this.#state.player1Wins++;
    if (symbol === "O") this.#state.player2Wins++;
    this.#saveToStorage();
  }

  saveConfig(config) {
    this.#state.lastConfig = config;
    this.#saveToStorage();
  }

  clearConfig() {
    this.#state.lastConfig = null;
    this.#saveToStorage();
  }

  getConfig() {
    return this.#state.lastConfig;
  }

  getScores() {
    return {
      x: this.#state.player1Wins,
      o: this.#state.player2Wins,
    };
  }

  resetScores() {
    this.#state.player1Wins = 0;
    this.#state.player2Wins = 0;
    this.#saveToStorage();
  }

  clearAll() {
    localStorage.removeItem(this.#STORAGE_KEY);
    this.#state = {
      player1Wins: 0,
      player2Wins: 0,
      lastConfig: null,
    };
  }
}

export const gameStore = new GameStore();