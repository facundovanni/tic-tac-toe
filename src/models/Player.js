export class Player {
  
  constructor(name, symbol, isHuman = true) {
    this.name = name;
    this.symbol = symbol;
    this.isHuman = isHuman;
    this.wins = 0;
  }

  async getMove(availableMoves) {
    if (this.isHuman) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }
}