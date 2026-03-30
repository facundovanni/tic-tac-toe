export class SetupMenu {
  constructor(container, onStart) {
    this.container = container;
    this.onStart = onStart; //player data callback
  }

  render() {
    this.container.innerHTML = "";
    const card = document.createElement("form");
    card.id = "setup-form";
    card.className = "bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md";

    card.innerHTML = `
      <h1 class="text-3xl font-black mb-2 text-cyan-400 text-center uppercase tracking-wider">Avature Tic Tac Toe</h1>
      <h3 class="text-xl font-bold mb-6 text-slate-400 text-center uppercase tracking-wider">Configuración</h3>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-2 text-slate-500 italic">Jugador 1 (X)</label>
          <input type="text" id="p1-name" name="p1-name" placeholder="Nombre Jugador 1" required
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white">
        </div>
        
        <div class="border-t border-slate-700 pt-4">
          <label class="block text-sm font-medium mb-2 text-slate-500 italic">Jugador 2 (O)</label>
          <input type="text" id="p2-name" name="p2-name" placeholder="Nombre Jugador 2" required
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-3 text-white">
          
          <div class="flex gap-6 justify-center bg-slate-900/50 py-3 rounded-lg">
            <label class="flex items-center cursor-pointer hover:text-cyan-400 transition-colors">
              <input type="radio" name="p2-type" value="human" class="mr-2 accent-cyan-500"> Humano
            </label>
            <label class="flex items-center cursor-pointer hover:text-pink-400 transition-colors">
              <input type="radio" name="p2-type" value="bot" checked class="mr-2 accent-pink-500"> Máquina (Bot)
            </label>
          </div>
        </div>

        <button type="submit" id="start-btn" 
          class="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg uppercase tracking-widest mt-4 active:scale-95">
          ¡Empezar Juego!
        </button>
      </div>
    `;

    this.container.appendChild(card);

    card.addEventListener("submit", (e) => {
      e.preventDefault();

      const config = {
        player1: {
          name: document.getElementById("p1-name").value.trim(),
          isHuman: true
        },
        player2: {
          name: document.getElementById("p2-name").value.trim(),
          isHuman: document.querySelector('input[name="p2-type"]:checked').value === "human"
        }
      };
      this.onStart(config);
    });
  }
}