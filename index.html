// --- Game Data (Simulating the CSV files) ---
const GAME_STATE = {
    salaryCap: 15000000, // $15M Budget
    currentCap: 12500000,
    myTeam: [
        { id: 1, name: "J. Smith", pos: "PG", rating: 88, salary: 4000000 },
        { id: 2, name: "M. Johnson", pos: "SG", rating: 91, salary: 5500000 },
        { id: 3, name: "D. Williams", pos: "SF", rating: 84, salary: 3000000 },
        { id: 4, name: "K. Thompson", pos: "PF", rating: 79, salary: 2000000 },
        { id: 5, name: "B. Lopez", pos: "C", rating: 82, salary: 2500000 }
    ],
    opponentTeam: [
        { id: 101, name: "L. James", pos: "SF", rating: 96, salary: 8000000 },
        { id: 102, name: "S. Curry", pos: "PG", rating: 95, salary: 7500000 },
        { id: 103, name: "J. Doe", pos: "SG", rating: 75, salary: 1000000 },
        { id: 104, name: "A. Noname", pos: "C", rating: 72, salary: 900000 }
    ],
    freeAgents: [
        { id: 201, name: "C. Paul", pos: "PG", rating: 85, salary: 3500000 },
        { id: 202, name: "D. Howard", pos: "C", rating: 80, salary: 1500000 },
        { id: 203, name: "Y. Ming", pos: "C", rating: 90, salary: 4500000 },
        { id: 204, name: "R. Allen", pos: "SG", rating: 88, salary: 2200000 }
    ]
};

// --- Initialization ---
window.onload = function() {
    updateUI();
};

function updateUI() {
    updateCapDisplay();
    renderRoster();
    renderTradeSelects();
    renderFreeAgents();
}

// --- Navigation Logic ---
function navigate(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');
    
    // Show selected page
    document.getElementById(pageId).style.display = 'block';

    // Update button styles
    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(b => b.classList.remove('active'));
    event.target.classList.add('active'); // Highlight clicked button
    
    // Clear messages
    document.getElementById('trade-result').innerText = "";
}

// --- Roster Logic ---
function renderRoster() {
    const list = document.getElementById('roster-list');
    list.innerHTML = ""; // Clear current list
    
    GAME_STATE.myTeam.forEach(player => {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.innerHTML = `
            <span class="pos-badge">${player.pos}</span>
            <span class="player-name">${player.name}</span>
            <span class="player-rating">${player.rating}</span>
            <span class="player-salary">$${(player.salary / 1000000).toFixed(1)}M</span>
        `;
        list.appendChild(row);
    });
}

function updateCapDisplay() {
    // Calculate total salary
    let totalSalary = GAME_STATE.myTeam.reduce((sum, p) => sum + p.salary, 0);
    let space = GAME_STATE.salaryCap - totalSalary;
    document.getElementById('salary-cap').innerText = "$" + (space / 1000000).toFixed(2) + "M";
    GAME_STATE.currentSpace = space;
}

// --- Trade Logic ---
function renderTradeSelects() {
    const mySelect = document.getElementById('my-trade-player');
    const theirSelect = document.getElementById('their-trade-player');
    
    mySelect.innerHTML = "";
    theirSelect.innerHTML = "";

    GAME_STATE.myTeam.forEach((p, index) => {
        mySelect.innerHTML += `<option value="${index}">${p.name} (${p.rating})</option>`;
    });

    GAME_STATE.opponentTeam.forEach((p, index) => {
        theirSelect.innerHTML += `<option value="${index}">${p.name} (${p.rating})</option>`;
    });
}

function attemptTrade() {
    const myIdx = document.getElementById('my-trade-player').value;
    const theirIdx = document.getElementById('their-trade-player').value;
    
    const myPlayer = GAME_STATE.myTeam[myIdx];
    const theirPlayer = GAME_STATE.opponentTeam[theirIdx];
    const resultMsg = document.getElementById('trade-result');

    // Simple Trade Logic: Opponent accepts if your player is within 5 rating points
    // OR if their player is low rated (< 80)
    const ratingDiff = theirPlayer.rating - myPlayer.rating;
    
    if (ratingDiff > 5) {
        resultMsg.innerText = "Trade Rejected: They want a better player.";
        resultMsg.style.color = "red";
    } else {
        // Execute Trade
        GAME_STATE.myTeam[myIdx] = theirPlayer;
        GAME_STATE.opponentTeam[theirIdx] = myPlayer;
        
        resultMsg.innerText = "Trade Accepted!";
        resultMsg.style.color = "#4caf50";
        updateUI(); // Refresh lists
    }
}

// --- Free Agency Logic ---
function renderFreeAgents() {
    const list = document.getElementById('fa-list');
    list.innerHTML = "";

    GAME_STATE.freeAgents.forEach((player, index) => {
        const row = document.createElement('div');
        row.className = 'player-row';
        row.innerHTML = `
            <span class="player-name">${player.name}</span>
            <span class="player-rating">${player.rating}</span>
            <span class="player-salary">$${(player.salary / 1000000).toFixed(1)}M</span>
            <button class="sign-btn" onclick="signPlayer(${index})">Sign</button>
        `;
        list.appendChild(row);
    });
}

function signPlayer(index) {
    const player = GAME_STATE.freeAgents[index];
    
    if (GAME_STATE.currentSpace >= player.salary) {
        // Sign player
        GAME_STATE.myTeam.push(player);
        // Remove from FA list
        GAME_STATE.freeAgents.splice(index, 1);
        
        alert("Signed " + player.name + "!");
        updateUI();
    } else {
        alert("Not enough Cap Space!");
    }
}
