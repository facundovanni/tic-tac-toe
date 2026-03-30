export class Player {
  #name;
  #isHuman;
  #symbol;

  constructor(name, symbol, isHuman = true) {
    this.#name = name;
    this.#isHuman = isHuman;
    this.#symbol = symbol;
  }

  get name() {
    return this.#name;
  }

  get isHuman() {
    return this.#isHuman;
  }

  get symbol() {
    return this.#symbol;
  }
}