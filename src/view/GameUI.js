import { gameStore } from "../store/GameStore";

export class GameUI {
  #container;
  #boardElement;
  #turnIndicator;
  #title;

  constructor(container, title) {
    this.#container = container;
    this.#title = title;
  }

  render(size, players, onCellClick) {
    this.#container.innerHTML = "";
    const scores = gameStore.getScores();

    const header = document.createElement("div");
    header.className = "text-center mb-10 animate-fade-in";
    header.innerHTML = `
      <h2 class="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase tracking-tighter mb-4">
        ${this.#title}
      </h2>
      <div class="flex items-center justify-center gap-4 text-text-muted font-medium">
        <div class="flex flex-col items-center">
            <span class="px-3 py-1 bg-surface rounded-md border border-white/10 text-primary">${players[0].name} (X)</span>
            <span class="text-[10px] mt-1 font-bold text-primary/80 uppercase tracking-widest">${scores.x} Victorias</span>
        </div>
        <span class="text-white/20 font-black text-xl italic">VS</span>
        <div class="flex flex-col items-center">
            <span class="px-3 py-1 bg-surface rounded-md border border-white/10 text-secondary">${players[1].name} (O)</span>
            <span class="text-[10px] mt-1 font-bold text-secondary/80 uppercase tracking-widest">${scores.o} Victorias</span>
        </div>
      </div>
      <div id="turn-indicator" aria-live="polite" class="mt-6 text-sm uppercase tracking-widest text-text-muted font-bold min-h-[24px]"></div>
    `;

    this.#container.appendChild(header);
    this.#turnIndicator = document.getElementById("turn-indicator");

    this.#boardElement = document.createElement("div");
    this.#boardElement.id = "game-board";
    this.#boardElement.className = "grid gap-2 sm:gap-3 bg-surface/30 p-3 sm:p-4 rounded-3xl shadow-2xl border border-white/5 w-full max-w-md aspect-square mb-8 transition-all duration-500";

    this.#boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    this.#boardElement.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    this.#container.appendChild(this.#boardElement);

    this.#generateCells(size, onCellClick);
  }

  updateTurn(player, isFirstTurn = false) {
    if (!this.#turnIndicator) return;

    const colorClass = player.symbol === "X" ? "text-primary" : "text-secondary";
    const badge = (isFirstTurn || !player.isHuman) ?
      `<span class="ml-2 px-2 py-0.5 bg-secondary/20 text-secondary text-[10px] rounded border border-secondary/30 animate-pulse">${isFirstTurn ? '¡EMPIEZA!' : 'PENSANDO'}</span>`
      : "";
    this.#turnIndicator.innerHTML = `
    Esperando jugada de <span class="${colorClass} font-black">${player.name}</span>${badge}
    `;
  }

  #generateCells(size, onCellClick) {
    const fontSize = size > 6 ? 'text-xl' : size > 4 ? 'text-3xl' : 'text-5xl';

    for (let i = 0; i < size * size; i++) {
      const row = Math.floor(i / size);
      const col = i % size;

      const cell = document.createElement("button");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute('aria-label', `Celda ${row + 1}-${col + 1}. Vacía.`);

      cell.className = `
        relative group aspect-square bg-surface rounded-xl sm:rounded-2xl 
        flex items-center justify-center ${fontSize} font-black
        hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/40
        transition-all duration-200 border-b-4 border-background active:translate-y-1 active:border-b-0
      `;

      cell.onclick = () => onCellClick(row, col, cell);
      this.#boardElement.appendChild(cell);
    }
  }

  updateCell(cell, symbol) {
    cell.innerText = symbol;
    cell.disabled = true;
    cell.classList.remove("hover:bg-surface-hover", "active:translate-y-1");
    cell.classList.add("cursor-default", "bg-background/50", "border-b-0");

    const colorClass = symbol === "X" ? "text-primary" : "text-secondary";
    cell.classList.add(colorClass);
    cell.setAttribute('aria-label', `Ocupado por ${symbol}`);
  }

  showResult(isWin, message, onRestart, onReplay) {
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-300";

    const modal = document.createElement("div");
    modal.className = "bg-surface border border-white/10 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center scale-90 animate-in zoom-in-95 duration-300";

    modal.innerHTML = `
      <div class="text-6xl mb-4">${isWin ? '🏆' : '🤝'}</div>
      <h2 class="text-3xl font-black text-text-main mb-2 uppercase tracking-tight">
        ${isWin ? '¡Victoria!' : '¡Empate!'}
      </h2>
      <p class="text-text-muted mb-8 text-lg font-medium">${message}</p>
      
      <div class="flex flex-col gap-3">
        <button id="modal-replay-btn" 
          class="w-full bg-primary hover:brightness-110 text-background font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest">
          Revancha
        </button>
        <button id="modal-menu-btn" 
          class="w-full bg-background hover:bg-surface-hover text-text-muted font-bold py-3 rounded-xl transition-all active:scale-95 uppercase tracking-widest text-xs">
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
    this.#boardElement.classList.toggle("pointer-events-none", locked);
    this.#boardElement.classList.toggle("opacity-60", locked);
  }
}