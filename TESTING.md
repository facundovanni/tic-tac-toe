# 🧪 Tic-Tac-Toe Pro: Logic & State Validation

This document outlines the critical logic paths and state transitions validated to ensure game engine integrity, turn synchronization, and data persistence.

## 1. Core Engine Logic (Model & Business Rules)

### Optimized Win Condition Algorithm
* **Activation Threshold ($2n - 1$):** Verify that the `checkWin` algorithm remains dormant until the minimum number of moves required for a victory is met (e.g., move 5 for a 3x3 board).
* **Directional Scan ($O(n)$):** Validate that the engine only checks the specific row, column, and diagonals intersecting with the last move, avoiding unnecessary full-board iterations ($O(n^2)$).
* **Dynamic Board Scaling:** Ensure the win logic scales accurately for boards from 3x3 up to 10x10.
* **Draw State:** Confirm the `isDraw` flag is only triggered when `moveCount` equals the total board capacity ($size^2$) and no winner is detected.

### Turn Management & Input Integrity
* **Turn Switching:** Verify that the `GameController` toggles the active player correctly after each valid move.
* **Input Locking (Race Conditions):** * **Crucial:** Validate that the board is physically locked (`pointer-events-none`) during the AI's "thinking" phase to prevent out-of-turn moves.
    * Ensure occupied cells cannot be overwritten or trigger additional events.

---

## 2. Lifecycle & Session Navigation

### Setup Validation
* **Identity Conflict:** Ensure the game prevents start-up if `player1.name === player2.name` (Case Insensitive).
* **Configuration Mapping:** Verify that chosen board sizes and player types are correctly injected into the `GameController` instance.

### Persistence & Data Integrity
* **Rematch (Session Continuity):** * Verify that clicking "Rematch" resets the board but preserves player names, board size, and the current score accumulation.
    * **Score Tracking:** Confirm the `GameStore` correctly increments the win count in `localStorage` only after a confirmed victory.
* **Full Reset (New Session):**
    * Verify that "Back to Menu" clears session data and resets scores to 0.
    * Validate that new player identities are correctly processed as a fresh session.

---

## 3. Mocking & Execution Strategy

* **Event Spies:** Use spies to ensure cell clicks call `handleMove` with the correct coordinates.
* **UI Spies:** Instead of rendering the full DOM, we will use `vi.spyOn` to verify that the Controller correctly calls UI methods (e.g., `updateTurn`, `showResult`).
* **Fake Timers:** Use `vi.useFakeTimers` to bypass the bot's 800ms delay and validate immediate game state transitions during testing.
* **Storage Mock:** Simulate a clean vs. a pre-populated `localStorage` to test first-run vs. returning-user scenarios.

## 4. Recommended Tooling
* **Vitest:** For native ESM support and lightning-fast execution.
* **JSDOM:** To provide a lightweight browser environment for testing the Setup Form and UI triggers.