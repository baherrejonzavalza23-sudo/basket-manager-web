/* Previous CSS remains, adding/modifying: */

body { background: #121212; color: #eee; font-family: sans-serif; margin: 0; }

.overlay-full {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: #111; z-index: 2000;
    display: flex; justify-content: center; align-items: center;
}

.menu-content { width: 90%; max-width: 800px; background: #222; padding: 20px; border-radius: 8px; text-align: center; }
.menu-grid { display: flex; gap: 20px; text-align: left; margin-top: 20px; }
.menu-col { flex: 1; background: #333; padding: 15px; border-radius: 5px; }
.menu-select { width: 100%; padding: 10px; margin: 10px 0; font-size: 1rem; }

.save-slot { 
    background: #444; padding: 12px; margin-bottom: 8px; border-radius: 4px; cursor: pointer;
    display: flex; justify-content: space-between;
}
.save-slot:hover { background: #555; }
.slot-info { color: #888; font-size: 0.9rem; }
.slot-info.filled { color: #00e676; }

/* In-Game UI */
.sim-hub { background: #1e1e1e; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; border: 1px solid #333; }
.bracket-view { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
.bracket-match { background: #333; padding: 10px; border-radius: 4px; text-align: center; }
.user-bold { color: #00e676; font-weight: bold; }

.rotation-card { display: flex; justify-content: space-between; align-items: center; background: #1e1e1e; padding: 10px; margin-bottom: 5px; }
.rot-control { display: flex; align-items: center; gap: 10px; }

/* Responsive */
@media(max-width: 600px) {
    .menu-grid { flex-direction: column; }
    .bracket-view { grid-template-columns: 1fr; }
}
