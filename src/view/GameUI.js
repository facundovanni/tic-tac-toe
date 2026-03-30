import { gameStore } from "../store/GameStore";

export class GameUI {
  #container;
  #boardElement;
  #turnIndicator;

  constructor(container) {
    this.#container = container;
  }

  render(size, players, onCellClick) {
    this.#container.innerHTML = "";
    const scores = gameStore.getScores();

    const header = document.createElement("div");
    header.className = "text-center mb-10 animate-fade-in";
    header.innerHTML = `
      <h2 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase tracking-tighter mb-4">
        Tic Tac Toe
      </h2>
      <div class="flex items-center justify-center gap-4 text-slate-400 font-medium">
        <div class="flex flex-col items-center">
            <span class="px-3 py-1 bg-slate-800 rounded-md border border-slate-700 text-cyan-400">${players[0].name} (X)</span>
            <span class="text-xs mt-1 font-bold text-cyan-600">${scores.x} Victorias</span>
        </div>
        <span class="text-slate-600 font-black text-xl">VS</span>
        <div class="flex flex-col items-center">
            <span class="px-3 py-1 bg-slate-800 rounded-md border border-slate-700 text-pink-500">${players[1].name} (O)</span>
            <span class="text-xs mt-1 font-bold text-pink-600">${scores.o} Victorias</span>
        </div>
      </div>
      <div id="turn-indicator" aria-live="polite" class="mt-6 text-sm uppercase tracking-widest text-slate-500 font-bold"></div>
    `;

    this.#container.appendChild(header);
    this.#turnIndicator = document.getElementById("turn-indicator");

    this.#boardElement = document.createElement("div");
    this.#boardElement.id = "game-board";
    this.#boardElement.className = "grid gap-3 bg-slate-800/50 p-4 rounded-3xl shadow-2xl border border-slate-700/50 w-full max-w-md aspect-square mb-8";

    this.#boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    this.#boardElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    this.#container.appendChild(this.#boardElement);

    this.#generateCells(size, onCellClick);
  }

  updateTurn(player, isFirstTurn = false) {
    if (!this.#turnIndicator) return;

    const colorClass = player.symbol === "X" ? "text-cyan-400" : "text-pink-500";
    const badge = isFirstTurn
      ? `<span class="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] rounded border border-yellow-500/50 animate-pulse">¡EMPIEZA!</span>`
      : "";

    const thinkingIA = !player.isHuman
      ? `<span class="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] rounded border border-yellow-500/50 animate-pulse">PENSANDO...</span>`
      : "";
    this.#turnIndicator.innerHTML = `
      Esperando jugada de <span class="${colorClass} font-black">${player.name}</span>${badge} ${thinkingIA}
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


  showResult(isWin, message, onRestart, onReplay) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300";

    const modal = document.createElement("div");
    modal.className = "bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center scale-90 animate-in zoom-in-95 duration-300";

    modal.innerHTML = `
    <div class="text-6xl mb-4">${isWin ? '🏆' : '🤝'}</div>
    <h2 class="text-3xl font-black text-white mb-2 uppercase tracking-tight">
      ${isWin ? '¡Victoria!' : '¡Empate!'}
    </h2>
    <p class="text-slate-400 mb-8 text-lg font-medium">${message}</p>
    
    <div class="flex flex-col gap-3">
      <button id="modal-replay-btn" 
        class="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest">
        Revancha
      </button>
      <button id="modal-menu-btn" 
        class="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 rounded-xl transition-all active:scale-95 uppercase tracking-widest text-sm">
        Volver al Menú
      </button>
    </div>
  `;

    overlay.appendChild(modal);
    this.#container.appendChild(overlay);

    document.getElementById("modal-replay-btn").onclick = () => {
      overlay.remove();
      onReplay();
    };

    document.getElementById("modal-menu-btn").onclick = () => {
      overlay.remove();
      onRestart();
    };
  }

  setBoardLock(locked) {
    if (!this.#boardElement) return;

    if (locked) {
      this.#boardElement.classList.add("pointer-events-none", "opacity-80");
      this.#boardElement.style.cursor = "wait";
    } else {
      this.#boardElement.classList.remove("pointer-events-none", "opacity-80");
      this.#boardElement.style.cursor = "default";
    }
  }
}