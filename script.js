/* --- CONFIGURATION --- */
const TEAMS_DATA = [
    { name: "Atlanta Hawks", abbr: "ATL", stars: ["T. Young", "D. Murray"] },
    { name: "Boston Celtics", abbr: "BOS", stars: ["J. Tatum", "J. Brown"] },
    { name: "Brooklyn Nets", abbr: "BKN", stars: ["M. Bridges", "C. Thomas"] },
    { name: "Charlotte Hornets", abbr: "CHA", stars: ["L. Ball", "B. Miller"] },
    { name: "Chicago Bulls", abbr: "CHI", stars: ["Z. LaVine", "D. DeRozan"] },
    { name: "Cleveland Cavaliers", abbr: "CLE", stars: ["D. Mitchell", "D. Garland"] },
    { name: "Dallas Mavericks", abbr: "DAL", stars: ["L. Doncic", "K. Irving"] },
    { name: "Denver Nuggets", abbr: "DEN", stars: ["N. Jokic", "J. Murray"] },
    { name: "Detroit Pistons", abbr: "DET", stars: ["C. Cunningham", "J. Ivey"] },
    { name: "Golden State Warriors", abbr: "GSW", stars: ["S. Curry", "K. Thompson"] },
    { name: "Houston Rockets", abbr: "HOU", stars: ["A. Sengun", "J. Green"] },
    { name: "Indiana Pacers", abbr: "IND", stars: ["T. Haliburton", "P. Siakam"] },
    { name: "LA Clippers", abbr: "LAC", stars: ["K. Leonard", "P. George"] },
    { name: "LA Lakers", abbr: "LAL", stars: ["L. James", "A. Davis"] },
    { name: "Memphis Grizzlies", abbr: "MEM", stars: ["J. Morant", "J. Jackson Jr."] },
    { name: "Miami Heat", abbr: "MIA", stars: ["J. Butler", "B. Adebayo"] },
    { name: "Milwaukee Bucks", abbr: "MIL", stars: ["G. Antetokounmpo", "D. Lillard"] },
    { name: "Minnesota Timberwolves", abbr: "MIN", stars: ["A. Edwards", "K. Towns"] },
    { name: "NO Pelicans", abbr: "NOP", stars: ["Z. Williamson", "B. Ingram"] },
    { name: "NY Knicks", abbr: "NYK", stars: ["J. Brunson", "J. Randle"] },
    { name: "OKC Thunder", abbr: "OKC", stars: ["S. Gilgeous-Alexander", "C. Holmgren"] },
    { name: "Orlando Magic", abbr: "ORL", stars: ["P. Banchero", "F. Wagner"] },
    { name: "Philly 76ers", abbr: "PHI", stars: ["J. Embiid", "T. Maxey"] },
    { name: "Phoenix Suns", abbr: "PHX", stars: ["K. Durant", "D. Booker"] },
    { name: "Portland Blazers", abbr: "POR", stars: ["A. Simons", "S. Henderson"] },
    { name: "Sacramento Kings", abbr: "SAC", stars: ["D. Fox", "D. Sabonis"] },
    { name: "San Antonio Spurs", abbr: "SAS", stars: ["V. Wembanyama", "D. Vassell"] },
    { name: "Toronto Raptors", abbr: "TOR", stars: ["S. Barnes", "R. Barrett"] },
    { name: "Utah Jazz", abbr: "UTA", stars: ["L. Markkanen", "J. Collins"] },
    { name: "Wash Wizards", abbr: "WAS", stars: ["K. Kuzma", "J. Poole"] }
];

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];
const SEASON_DAYS = 82;

/* --- STATE --- */
let GAME = {
    userTeamId: 0,
    day: 1,
    teams: [],
    schedule: [], // Array of Days, each Day is Array of Games {t1, t2}
    news: []
};

/* --- INITIALIZATION & MENU --- */
window.onload = function() {
    initMainMenu();
};

function initMainMenu() {
    const select = document.getElementById('team-select-dropdown');
    select.innerHTML = "";
    TEAMS_DATA.forEach((t, i) => {
        select.innerHTML += `<option value="${i}">${t.name}</option>`;
    });
    
    // Check save slots
    for(let i=1; i<=3; i++) {
        let save = localStorage.getItem('bm_save_' + i);
        if(save) {
            let data = JSON.parse(save);
            let teamName = data.teams[data.userTeamId].name;
            document.getElementById(`slot-${i}-info`).innerText = `${teamName} - Day ${data.day}`;
        }
    }
}

function startNewGame() {
    const teamId = parseInt(document.getElementById('team-select-dropdown').value);
    GAME.userTeamId = teamId;
    GAME.day = 1;
    GAME.teams = generateTeams();
    GAME.schedule = generateSchedule();
    GAME.news = ["Welcome to the 2024 Season!"];
    
    closeMainMenu();
    updateUI();
}

function loadSave(slot) {
    let save = localStorage.getItem('bm_save_' + slot);
    if(save) {
        GAME = JSON.parse(save);
        closeMainMenu();
        updateUI();
    } else {
        alert("No save in slot " + slot);
    }
}

function saveGame() {
    // Save to slot 1 by default for this simplified version, or add slot selector
    localStorage.setItem('bm_save_1', JSON.stringify(GAME));
    alert("Game saved!");
}

function showMainMenu() { document.getElementById('main-menu').style.display = 'flex'; }
function closeMainMenu() { document.getElementById('main-menu').style.display = 'none'; }

/* --- DATA GENERATION --- */
function generateTeams() {
    return TEAMS_DATA.map((data, index) => {
        return {
            id: index,
            name: data.name,
            abbr: data.abbr,
            wins: 0, 
            losses: 0,
            roster: generateRoster(data.stars)
        };
    });
}

function generateRoster(stars) {
    let roster = [];
    
    // Create Stars
    stars.forEach(name => {
        roster.push(createPlayer(name, true));
    });

    // Fill rest (Total 13 players)
    while(roster.length < 13) {
        roster.push(createPlayer(null, false));
    }
    
    // Assign Positions evenly-ish
    roster.forEach((p, i) => {
        if(!p.pos) p.pos = POSITIONS[i % 5];
        // Set Default Minutes: Starters 30+, Bench 15, Reserves 0
        p.minutes = i < 5 ? 34 : (i < 10 ? 14 : 0);
    });

    return roster.sort((a,b) => b.rating - a.rating);
}

function createPlayer(realName, isStar) {
    let rating = isStar ? 85 + Math.floor(Math.random()*14) : 70 + Math.floor(Math.random()*10);
    if(!isStar && Math.random() > 0.8) rating -= 10; // Some scrubs

    return {
        id: Math.random().toString(36).substr(2, 9),
        name: realName || `Player ${Math.floor(Math.random()*1000)}`,
        rating: rating,
        stamina: 70 + Math.floor(Math.random()*25), // 70-95
        fatigue: 0, // Starts fresh
        minutes: 0, // Assigned in roster gen
        stats: { pts: 0, gp: 0 }
    };
}

function generateSchedule() {
    let sched = [];
    // Round Robin-ish: Every team plays every day for simplicity of simulation
    // A real schedule generator is complex, this ensures 1 game per day per team approx
    for(let d=1; d<=SEASON_DAYS; d++) {
        let dayGames = [];
        let indices = Array.from({length:30}, (_, i) => i).sort(() => Math.random() - 0.5);
        for(let i=0; i<30; i+=2) {
            dayGames.push({ t1: indices[i], t2: indices[i+1] });
        }
        sched.push(dayGames);
    }
    return sched;
}

/* --- SIMULATION ENGINE --- */
function simDay() {
    if(GAME.day > SEASON_DAYS) {
        alert("Season Over!");
        return;
    }

    let todaysGames = GAME.schedule[GAME.day - 1];
    let userPlayed = false;

    todaysGames.forEach(game => {
        let t1 = GAME.teams[game.t1];
        let t2 = GAME.teams[game.t2];
        
        playGame(t1, t2);

        if(t1.id === GAME.userTeamId || t2.id === GAME.userTeamId) userPlayed = true;
    });

    // Recovery for teams that didn't play (if any)
    GAME.teams.forEach(t => {
        let played = todaysGames.some(g => g.t1 === t.id || g.t2 === t.id);
        if(!played) recoverFatigue(t);
    });

    GAME.day++;
    updateUI();
}

function simWeek() {
    for(let i=0; i<7; i++) simDay();
}
function simMonth() {
    for(let i=0; i<30; i++) simDay();
}

function playGame(t1, t2) {
    let s1 = getTeamStrength(t1);
    let s2 = getTeamStrength(t2);
    
    // Home court advantage + Randomness
    let score1 = s1 + Math.floor(Math.random() * 15);
    let score2 = s2 + Math.floor(Math.random() * 15) + 3; 
    
    if(score1 > score2) { t1.wins++; t2.losses++; }
    else { t2.wins++; t1.losses++; }

    // Update Fatigue & Stats
    applyPostGameEffects(t1);
    applyPostGameEffects(t2);

    if(t1.id === GAME.userTeamId || t2.id === GAME.userTeamId) {
        let res = t1.id === GAME.userTeamId ? (score1>score2?'W':'L') : (score2>score1?'W':'L');
        let opp = t1.id === GAME.userTeamId ? t2.name : t1.name;
        GAME.news.unshift(`Day ${GAME.day}: ${res} vs ${opp} (${score1}-${score2})`);
    }
}

function getTeamStrength(team) {
    let totalStrength = 0;
    
    team.roster.forEach(p => {
        // Minutes Factor: A player contributes based on % of game played
        let minFactor = p.minutes / 48; 
        
        // Fatigue Factor: High fatigue reduces effective rating
        let fatiguePenalty = p.fatigue > 50 ? (p.fatigue - 50) * 0.5 : 0; // Max 25 pt penalty
        
        let effectiveRating = p.rating - fatiguePenalty;
        if(effectiveRating < 40) effectiveRating = 40;
        
        totalStrength += effectiveRating * minFactor;
    });

    // Strategy Bonus (Simulated)
    return totalStrength * 1.5; // Scale up to realistic score ranges (e.g., 80 rating -> 120 pts?)
}

function applyPostGameEffects(team) {
    team.roster.forEach(p => {
        // Increase Fatigue: More minutes = More fatigue
        // Lower Stamina = Faster Fatigue
        let fatigueGain = (p.minutes * 1.5) * (100 / p.stamina); 
        p.fatigue = Math.min(100, p.fatigue + fatigueGain);
        
        // Simple Stat Sim for flavor
        if(p.minutes > 10) p.stats.gp++;
    });
    
    // Natural Recovery immediately after game (night's sleep)
    recoverFatigue(team, 20); 
}

function recoverFatigue(team, amount = 30) {
    team.roster.forEach(p => {
        p.fatigue = Math.max(0, p.fatigue - amount);
    });
}

/* --- UI LOGIC --- */
function updateUI() {
    const userTeam = GAME.teams[GAME.userTeamId];
    
    // Status Bar
    document.getElementById('date-display').innerText = `Day ${GAME.day}`;
    document.getElementById('team-record').innerText = `${userTeam.wins}-${userTeam.losses}`;
    
    // High Fatigue Warning
    let tiredPlayers = userTeam.roster.filter(p => p.fatigue > 60).length;
    document.getElementById('fatigue-warn').style.display = tiredPlayers > 0 ? 'inline' : 'none';

    // Next Opponent
    let nextGame = GAME.schedule[GAME.day-1] ? GAME.schedule[GAME.day-1].find(g => g.t1 === GAME.userTeamId || g.t2 === GAME.userTeamId) : null;
    if(nextGame) {
        let oppId = nextGame.t1 === GAME.userTeamId ? nextGame.t2 : nextGame.t1;
        document.getElementById('next-opponent-name').innerText = GAME.teams[oppId].name;
    } else {
        document.getElementById('next-opponent-name').innerText = "Off Day";
    }

    // News
    document.getElementById('news-feed').innerHTML = GAME.news.slice(0, 10).map(n => `<div class="news-item">${n}</div>`).join('');

    // Tabs
    renderRosterList();
    renderRotationList();
    renderStandings();
}

function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(page).classList.add('active-page');
    updateUI();
}

function renderRosterList() {
    const list = document.getElementById('roster-list');
    list.innerHTML = "";
    GAME.teams[GAME.userTeamId].roster.forEach(p => {
        let fatigueColor = p.fatigue > 50 ? 'red' : '#00e676';
        list.innerHTML += `
            <div class="player-row">
                <span class="pos-badge">${p.pos}</span>
                <span class="player-name">${p.name}</span>
                <span>Ovr: ${p.rating}</span>
                <span style="color:${fatigueColor}; font-size:0.8rem;">Fatigue: ${Math.floor(p.fatigue)}%</span>
            </div>
        `;
    });
}

function renderRotationList() {
    const list = document.getElementById('rotation-list');
    list.innerHTML = "";
    let totalMins = 0;
    
    GAME.teams[GAME.userTeamId].roster.forEach(p => {
        totalMins += parseInt(p.minutes);
        list.innerHTML += `
            <div class="rotation-card">
                <div class="rot-info">
                    <b>${p.name}</b> (${p.pos})
                    <br>Stamina: ${p.stamina}
                </div>
                <div class="rot-control">
                    <input type="range" min="0" max="48" value="${p.minutes}" 
                        oninput="updateMinutes('${p.id}', this.value)">
                    <span id="min-val-${p.id}">${p.minutes}m</span>
                </div>
            </div>
        `;
    });
    
    let totalDisplay = document.getElementById('total-minutes');
    totalDisplay.innerText = `${totalMins} / 240 Mins`;
    totalDisplay.style.color = totalMins > 240 ? 'red' : 'white';
}

function updateMinutes(pid, val) {
    let p = GAME.teams[GAME.userTeamId].roster.find(x => x.id === pid);
    if(p) {
        p.minutes = parseInt(val);
        document.getElementById(`min-val-${pid}`).innerText = val + "m";
        
        // Recalc total
        let total = GAME.teams[GAME.userTeamId].roster.reduce((a,b) => a + b.minutes, 0);
        let totalDisplay = document.getElementById('total-minutes');
        totalDisplay.innerText = `${total} / 240 Mins`;
        totalDisplay.style.color = total > 240 ? 'red' : 'white';
    }
}

function renderStandings() {
    const tbody = document.getElementById('standings-body');
    let sorted = [...GAME.teams].sort((a,b) => b.wins - a.wins);
    tbody.innerHTML = sorted.map((t, i) => `
        <tr class="${t.id === GAME.userTeamId ? 'highlight' : ''}">
            <td>${i+1}</td>
            <td>${t.name}</td>
            <td>${t.wins}</td>
            <td>${t.losses}</td>
            <td>${t.wins - t.losses}</td>
        </tr>
    `).join('');
}
