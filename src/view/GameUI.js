export class GameUI {
  #container;
  #boardElement;
  #turnIndicator;
  
  constructor(container) {
    this.#container = container;
  }

  render(size, players, onCellClick) {
    this.#container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "text-center mb-10 animate-fade-in";
    header.innerHTML = `
      <h2 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-tighter mb-4">
        Tic Tac Toe
      </h2>
      <div class="flex items-center justify-center gap-4 text-slate-400 font-medium">
        <span class="px-3 py-1 bg-slate-800 rounded-md border border-slate-700 text-cyan-400">${players[0].name} (X)</span>
        <span class="text-slate-600 font-black">VS</span>
        <span class="px-3 py-1 bg-slate-800 rounded-md border border-slate-700 text-pink-500">${players[1].name} (O)</span>
      </div>
      <div id="turn-indicator" aria-live="polite" class="mt-6 text-sm uppercase tracking-widest text-slate-500 font-bold"></div>
    `;

    this.#container.appendChild(header);
    this.#turnIndicator = document.getElementById("turn-indicator");

    this.updateTurn(players[0]);

    this.#boardElement = document.createElement("div");
    this.#boardElement.id = "game-board";
    this.#boardElement.className = "grid gap-3 bg-slate-800/50 p-4 rounded-3xl shadow-2xl border border-slate-700/50 w-full max-w-md aspect-square mb-8";

    this.#boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    this.#boardElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    this.#container.appendChild(header);
    this.#container.appendChild(this.#boardElement);

    this.#generateCells(size, onCellClick);
  }

  updateTurn(player) {
    if (!this.#turnIndicator) return;
    
    const colorClass = player.symbol === "X" ? "text-cyan-400" : "text-pink-500";
    this.#turnIndicator.innerHTML = `
      Esperando jugada de <span class="${colorClass} font-black">${player.name}</span>...
    `;
  }

  #generateCells(size, onCellClick) {
    for (let i = 0; i < size * size; i++) {
      const row = Math.floor(i / size);
      const col = i % size;

      const cell = document.createElement("button");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute('aria-label', `Celda fila ${row + 1}, columna ${col + 1}. Vacía.`);

      cell.className = `
        relative group aspect-square bg-slate-800 rounded-2xl 
        flex items-center justify-center text-5xl font-black
        hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50
        transition-all duration-200 border-b-4 border-slate-950 active:translate-y-1 active:border-b-0
      `;

      cell.onclick = () => onCellClick(row, col, cell);
      this.#boardElement.appendChild(cell);
    }
  }

  updateCell(cell, symbol) {
    cell.innerText = symbol;
    cell.disabled = true;
    cell.classList.remove("hover:bg-slate-700", "active:translate-y-1");
    cell.classList.add("cursor-default", "bg-slate-900");
    
    const colorClass = symbol === "X" ? "text-cyan-400" : "text-pink-500";
    cell.classList.add(colorClass);
    cell.setAttribute('aria-label', `Ocupado por ${symbol}`);
  }
}