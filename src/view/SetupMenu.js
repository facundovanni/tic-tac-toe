export class SetupMenu {
  #container;
  #title;
  #onStart;

  constructor(container, title, onStart) {
    this.#container = container;
    this.#title = title;
    this.#onStart = onStart;
  }

  render() {
    this.#container.innerHTML = "";
    const card = document.createElement("form");
    card.id = "setup-form";
    card.className = "bg-surface p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md animate-in fade-in zoom-in duration-300";

    card.innerHTML = `
      <header class="text-center mb-8">
        <h1 class="text-3xl font-black text-primary uppercase tracking-tighter">${this.#title}</h1>
        <p class="text-sm font-bold text-text-muted uppercase tracking-widest mt-1">Configuración de partida</p>
      </header>
      
      <div class="space-y-6">
        <div class="group">
          <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2 group-focus-within:text-primary transition-colors">Jugador 1 (X)</label>
          <input type="text" id="p1-name" name="p1-name" placeholder="Nombre Jugador 1" required
            class="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-main transition-all">
        </div>
        
        <div class="pt-2">
          <label class="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Jugador 2 (O)</label>
          <input type="text" id="p2-name" name="p2-name" placeholder="Nombre Jugador 2" required
            class="w-full bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/50 text-text-main mb-4 transition-all">
          
          <div class="grid grid-cols-2 gap-2 bg-background/50 p-1 rounded-xl border border-white/5">
            <label class="flex items-center justify-center py-2 rounded-lg cursor-pointer has-[:checked]:bg-surface has-[:checked]:text-primary text-text-muted text-xs font-bold transition-all">
              <input type="radio" name="p2-type" value="human" class="hidden"> Humano
            </label>
            <label class="flex items-center justify-center py-2 rounded-lg cursor-pointer has-[:checked]:bg-surface has-[:checked]:text-secondary text-text-muted text-xs font-bold transition-all">
              <input type="radio" name="p2-type" value="bot" checked class="hidden"> Bot (IA)
            </label>
          </div>
        </div>

        <div class="space-y-4 pt-2">
  <label class="text-[10px] font-black uppercase tracking-widest text-text-muted">Dimensión del Tablero</label>
  <div class="grid grid-cols-2 gap-3">
    <button type="button" data-size="3" class="size-btn py-3 rounded-xl bg-primary/10 border-2 border-primary text-primary font-black text-sm transition-all active:scale-95">
      Clásico (3x3)
    </button>
    <button type="button" id="custom-size-toggle" class="py-3 rounded-xl bg-background border-2 border-transparent text-text-muted font-bold hover:bg-surface-hover transition-all text-sm active:scale-95">
      Personalizado
    </button>
  </div>
  
  <div id="custom-size-container" class="hidden animate-in slide-in-from-top-2 duration-200 flex flex-col items-center gap-2">
    <div class="flex items-center gap-3 bg-background border border-white/10 p-2 rounded-xl">
      <span class="text-xs font-bold text-text-muted pl-2 uppercase">Lado:</span>
      <input type="number" id="board-size" min="3" max="10" value="3" 
        class="w-20 bg-surface border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary text-text-main font-black text-center">
    </div>
    <p class="text-[10px] text-text-muted italic">Mín: 3 / Máx: 10</p>
  </div>
</div>

        <button type="submit" id="start-btn" 
          class="w-full bg-primary hover:brightness-110 text-background font-black py-4 rounded-xl shadow-lg shadow-primary/20 transition-all uppercase tracking-widest mt-4 active:scale-95">
          ¡Empezar Juego!
        </button>
      </div>
    `;

    this.#container.appendChild(card);
    this.#setupSizeLogic();

    card.addEventListener("submit", (e) => {
      e.preventDefault();
      const name1 = document.getElementById("p1-name").value.trim();
      const name2 = document.getElementById("p2-name").value.trim();

      if (name1.toLowerCase() === name2.toLowerCase()) {
        alert("Los jugadores deben tener nombres distintos.");
        document.getElementById("p2-name").focus();
        return;
      }

      const isCustom = !document.getElementById('custom-size-container').classList.contains('hidden');
      const sizeValue = isCustom ? document.getElementById("board-size").value : 3;

      const config = {
        player1: {
          name: document.getElementById("p1-name").value.trim(),
          isHuman: true
        },
        player2: {
          name: document.getElementById("p2-name").value.trim(),
          isHuman: document.querySelector('input[name="p2-type"]:checked').value === "human"
        },
        size: parseInt(sizeValue)
      };

      this.#onStart(config);
    });
  }

  #setupSizeLogic() {
    const customToggle = document.getElementById('custom-size-toggle');
    const customContainer = document.getElementById('custom-size-container');
    const classicBtn = document.querySelector('[data-size="3"]');
    const sizeInput = document.getElementById('board-size');

    const resetSelection = () => {
      classicBtn.classList.replace('bg-primary/10', 'bg-background');
      classicBtn.classList.replace('border-primary', 'border-transparent');
      classicBtn.classList.replace('text-primary', 'text-text-muted');

      customToggle.classList.replace('bg-primary/10', 'bg-background');
      customToggle.classList.replace('border-primary', 'border-transparent');
      customToggle.classList.replace('text-primary', 'text-text-muted');
    };

    const selectButton = (btn) => {
      resetSelection();
      btn.classList.replace('bg-background', 'bg-primary/10');
      btn.classList.replace('border-transparent', 'border-primary');
      btn.classList.replace('text-text-muted', 'text-primary');
    };

    customToggle.onclick = () => {
      customContainer.classList.remove('hidden');
      selectButton(customToggle);
      sizeInput.focus();
    };

    classicBtn.onclick = () => {
      customContainer.classList.add('hidden');
      sizeInput.value = 3;
      selectButton(classicBtn);
    };
  }
}