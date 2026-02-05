/* --- CONFIGURATION --- */
const TEAMS_DATA = [
    { name: "Atlanta Hawks", abbr: "ATL", color: "#E03A3E", stars: ["T. Young", "D. Murray"] },
    { name: "Boston Celtics", abbr: "BOS", color: "#007A33", stars: ["J. Tatum", "J. Brown"] },
    { name: "Brooklyn Nets", abbr: "BKN", color: "#000000", stars: ["M. Bridges", "C. Thomas"] },
    { name: "Charlotte Hornets", abbr: "CHA", color: "#1D1160", stars: ["L. Ball", "B. Miller"] },
    { name: "Chicago Bulls", abbr: "CHI", color: "#CE1141", stars: ["Z. LaVine", "D. DeRozan"] },
    { name: "Cleveland Cavaliers", abbr: "CLE", color: "#860038", stars: ["D. Mitchell", "D. Garland"] },
    { name: "Dallas Mavericks", abbr: "DAL", color: "#00538C", stars: ["L. Doncic", "K. Irving"] },
    { name: "Denver Nuggets", abbr: "DEN", color: "#0E2240", stars: ["N. Jokic", "J. Murray"] },
    { name: "Detroit Pistons", abbr: "DET", color: "#C8102E", stars: ["C. Cunningham", "J. Ivey"] },
    { name: "Golden State Warriors", abbr: "GSW", color: "#1D428A", stars: ["S. Curry", "K. Thompson"] },
    { name: "Houston Rockets", abbr: "HOU", color: "#CE1141", stars: ["A. Sengun", "J. Green"] },
    { name: "Indiana Pacers", abbr: "IND", color: "#002D62", stars: ["T. Haliburton", "P. Siakam"] },
    { name: "LA Clippers", abbr: "LAC", color: "#C8102E", stars: ["K. Leonard", "P. George"] },
    { name: "LA Lakers", abbr: "LAL", color: "#552583", stars: ["L. James", "A. Davis"] },
    { name: "Memphis Grizzlies", abbr: "MEM", color: "#5D76A9", stars: ["J. Morant", "J. Jackson Jr."] },
    { name: "Miami Heat", abbr: "MIA", color: "#98002E", stars: ["J. Butler", "B. Adebayo"] },
    { name: "Milwaukee Bucks", abbr: "MIL", color: "#00471B", stars: ["G. Antetokounmpo", "D. Lillard"] },
    { name: "Minnesota Timberwolves", abbr: "MIN", color: "#0C2340", stars: ["A. Edwards", "K. Towns"] },
    { name: "NO Pelicans", abbr: "NOP", color: "#0C2340", stars: ["Z. Williamson", "B. Ingram"] },
    { name: "NY Knicks", abbr: "NYK", color: "#006BB6", stars: ["J. Brunson", "J. Randle"] },
    { name: "OKC Thunder", abbr: "OKC", color: "#007AC1", stars: ["S. Gilgeous-Alexander", "C. Holmgren"] },
    { name: "Orlando Magic", abbr: "ORL", color: "#0077C0", stars: ["P. Banchero", "F. Wagner"] },
    { name: "Philly 76ers", abbr: "PHI", color: "#006BB6", stars: ["J. Embiid", "T. Maxey"] },
    { name: "Phoenix Suns", abbr: "PHX", color: "#1D1160", stars: ["K. Durant", "D. Booker"] },
    { name: "Portland Blazers", abbr: "POR", color: "#E03A3E", stars: ["A. Simons", "S. Henderson"] },
    { name: "Sacramento Kings", abbr: "SAC", color: "#5A2D81", stars: ["D. Fox", "D. Sabonis"] },
    { name: "San Antonio Spurs", abbr: "SAS", color: "#C4CED4", stars: ["V. Wembanyama", "D. Vassell"] },
    { name: "Toronto Raptors", abbr: "TOR", color: "#CE1141", stars: ["S. Barnes", "R. Barrett"] },
    { name: "Utah Jazz", abbr: "UTA", color: "#002B5C", stars: ["L. Markkanen", "J. Collins"] },
    { name: "Wash Wizards", abbr: "WAS", color: "#002B5C", stars: ["K. Kuzma", "J. Poole"] }
];

const POSITIONS = ["PG", "SG", "SF", "PF", "C"];
const LEGENDS = ["M. Jordan", "K. Bryant", "L. Bird", "M. Johnson", "S. O'Neal", "T. Duncan"];
const SEASON_DAYS = 82;

let SETTINGS = { draftQuality: 50, tradeDiff: 50, useLegends: false };
let TRADE_ASSETS = { my: new Set(), their: new Set() };

let GAME = {
    userTeamId: 0,
    day: 1,
    year: 2024,
    phase: 'regular',
    teams: [],
    schedule: [],
    news: [],
    playoffMatchups: [],
    draftClass: []
};

/* --- INITIALIZATION --- */
window.onload = function() {
    initMainMenu();
    // Add event listener to dropdown manually to ensure it works
    document.getElementById('team-select-dropdown').addEventListener('change', updateTeamPreview);
};

function initMainMenu() {
    const select = document.getElementById('team-select-dropdown');
    select.innerHTML = "";
    TEAMS_DATA.forEach((t, i) => {
        select.innerHTML += `<option value="${i}">${t.name}</option>`;
    });

    // Update Slots
    for(let i=1; i<=3; i++) {
        let save = localStorage.getItem('bm_save_' + i);
        let el = document.getElementById(`slot-${i}-info`);
        let card = document.getElementById(`slot-${i}-card`);
        if(save) {
            let data = JSON.parse(save);
            let tName = data.teams[data.userTeamId].name;
            el.innerHTML = `<span style="color:#00e676">${tName}</span><br>${data.year}`;
            card.classList.add('filled');
        }
    }
    updateTeamPreview();
}

function updateTeamPreview() {
    const idx = document.getElementById('team-select-dropdown').value;
    const data = TEAMS_DATA[idx];
    document.getElementById('preview-name').innerText = data.name;
    document.getElementById('preview-stars').innerText = data.stars.join(", ");
    document.getElementById('preview-ovr').innerText = "8" + (Math.floor(Math.random()*9)); // Random preview ovr
    document.getElementById('preview-header').style.borderLeft = `5px solid ${data.color}`;
}

function startNewGame() {
    const select = document.getElementById('team-select-dropdown');
    SETTINGS.useLegends = document.getElementById('legends-toggle').checked;
    
    GAME.userTeamId = parseInt(select.value);
    GAME.day = 1;
    GAME.year = 2024;
    GAME.phase = 'regular';
    GAME.teams = generateTeams();
    GAME.schedule = generateSchedule();
    GAME.news = ["Welcome to the League!"];
    
    enterGame();
}

function loadSave(slot) {
    let save = localStorage.getItem('bm_save_' + slot);
    if(save) {
        GAME = JSON.parse(save);
        enterGame();
    } else alert("Empty Slot");
}

function enterGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    updateUI();
}

function exitToMenu() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
    initMainMenu();
}

function saveGame() {
    localStorage.setItem('bm_save_1', JSON.stringify(GAME));
    alert("Saved to Slot 1");
}

/* --- DATA GENERATION --- */
function generateTeams() {
    return TEAMS_DATA.map((data, index) => ({
        id: index,
        name: data.name,
        abbr: data.abbr,
        color: data.color,
        wins: 0, losses: 0,
        roster: generateRoster(data.stars),
        staff: { coach: Math.floor(Math.random()*5), scout: Math.floor(Math.random()*5) },
        strategy: Math.random() > 0.5 ? 'Contending' : 'Rebuilding'
    }));
}

function generateRoster(stars) {
    let roster = [];
    stars.forEach(name => roster.push(createPlayer(name, true)));
    while(roster.length < 13) roster.push(createPlayer(null, false));
    
    roster.forEach((p, i) => {
        p.pos = p.pos || POSITIONS[i%5];
        p.minutes = i < 5 ? 35 : (i < 10 ? 13 : 0);
    });
    return roster.sort((a,b) => b.rating - a.rating);
}

function createPlayer(name, isStar) {
    let rating = isStar ? 86 + Math.floor(Math.random()*13) : 72 + Math.floor(Math.random()*8);
    if(!isStar && Math.random() > 0.8) rating -= 10;
    return {
        id: Math.random().toString(36).substr(2,9),
        name: name || `Player ${Math.floor(Math.random()*1000)}`,
        rating: rating,
        age: isStar ? 24 + Math.floor(Math.random()*10) : 20 + Math.floor(Math.random()*15),
        contract: Math.floor(Math.random()*4)+1,
        salary: Math.floor(rating * 300000),
        stamina: 80 + Math.floor(Math.random()*20),
        fatigue: 0,
        minutes: 0
    };
}

function generateSchedule() {
    let sched = [];
    for(let d=1; d<=SEASON_DAYS; d++) {
        let dayGames = [];
        let indices = Array.from({length:30}, (_,i)=>i).sort(()=>Math.random()-0.5);
        for(let i=0; i<30; i+=2) dayGames.push({t1:indices[i], t2:indices[i+1]});
        sched.push(dayGames);
    }
    return sched;
}

/* --- SIMULATION --- */
function simDay() {
    if(GAME.phase !== 'regular') return;
    if(GAME.day > SEASON_DAYS) { startPlayoffs(); return; }

    GAME.schedule[GAME.day-1].forEach(g => playGame(GAME.teams[g.t1], GAME.teams[g.t2]));
    GAME.teams.forEach(t => t.roster.forEach(p => p.fatigue = Math.max(0, p.fatigue - 15)));
    
    GAME.day++;
    if(GAME.day > SEASON_DAYS) startPlayoffs();
    updateUI();
}

function simWeek() {
    for(let i=0; i<7; i++) { if(GAME.phase === 'regular') simDay(); }
}

function simToPlayoffs() {
    while(GAME.phase === 'regular') simDay();
}

function playGame(t1, t2) {
    let s1 = getTeamStrength(t1);
    let s2 = getTeamStrength(t2) + 3; // Home Court
    if(s1 + Math.random()*20 > s2 + Math.random()*20) { t1.wins++; t2.losses++; }
    else { t2.wins++; t1.losses++; }
    
    // Fatigue
    [t1, t2].forEach(t => t.roster.forEach(p => p.fatigue += (p.minutes * 0.4)));
    
    if(t1.id === GAME.userTeamId || t2.id === GAME.userTeamId) {
        let win = (t1.id===GAME.userTeamId && s1>s2) || (t2.id===GAME.userTeamId && s2>s1);
        let opp = t1.id === GAME.userTeamId ? t2.name : t1.name;
        GAME.news.unshift(`Day ${GAME.day}: ${win ? "WIN" : "LOSS"} vs ${opp}`);
    }
}

function getTeamStrength(t) {
    let str = 0;
    t.roster.forEach(p => {
        let effective = p.rating - (p.fatigue > 50 ? (p.fatigue-50)*0.5 : 0);
        str += effective * (p.minutes/48);
    });
    return str * 2 + t.staff.coach;
}

/* --- PLAYOFFS & DRAFT --- */
function startPlayoffs() {
    GAME.phase = 'playoffs';
    let sorted = [...GAME.teams].sort((a,b)=>b.wins-a.wins).slice(0, 16);
    GAME.playoffMatchups = [];
    for(let i=0; i<8; i++) GAME.playoffMatchups.push({t1:sorted[i], t2:sorted[15-i]});
    GAME.news.unshift("--- PLAYOFFS BEGIN ---");
    updateUI();
}

function simPlayoffRound() {
    let winners = [];
    GAME.playoffMatchups.forEach(m => {
        let w = getTeamStrength(m.t1) > getTeamStrength(m.t2) ? m.t1 : m.t2;
        winners.push(w);
        GAME.news.unshift(`${w.name} advances!`);
    });
    
    if(winners.length === 1) {
        alert(`${winners[0].name} Wins the Championship!`);
        startDraft();
    } else {
        GAME.playoffMatchups = [];
        for(let i=0; i<winners.length; i+=2) GAME.playoffMatchups.push({t1:winners[i], t2:winners[i+1]});
        updateUI();
    }
}

function startDraft() {
    GAME.phase = 'draft';
    GAME.draftClass = [];
    for(let i=0; i<30; i++) GAME.draftClass.push(createPlayer(null, true));
    
    // Legends
    if(SETTINGS.useLegends) {
        LEGENDS.forEach(n => GAME.draftClass.unshift(createPlayer(n, true)));
    }
    updateUI();
}

function draftPlayer(idx) {
    let p = GAME.draftClass[idx];
    GAME.teams[GAME.userTeamId].roster.push(p);
    alert(`Drafted ${p.name}!`);
    startNewSeason();
}

function startNewSeason() {
    GAME.year++;
    GAME.day = 1;
    GAME.phase = 'regular';
    GAME.schedule = generateSchedule();
    GAME.teams.forEach(t => {
        t.wins = 0; t.losses = 0;
        t.roster.forEach(p => {
            p.age++;
            p.contract--;
            if(p.contract <= 0) p.rating = 0; // Removed/Expired (Simplified)
        });
        t.roster = t.roster.filter(p => p.rating > 0); // Remove expired
    });
    GAME.news = [`${GAME.year} Season Started`];
    updateUI();
}

/* --- TRADES --- */
function updateTradeTarget() {
    TRADE_ASSETS = { my: new Set(), their: new Set() };
    const tid = document.getElementById('target-team-select').value;
    const t = GAME.teams[tid];
    document.getElementById('target-strategy').innerText = `Strategy: ${t.strategy}`;
    renderTradeLists();
}

function renderTradeLists() {
    const user = GAME.teams[GAME.userTeamId];
    const target = GAME.teams[document.getElementById('target-team-select').value];
    
    const mkList = (team, set, el) => {
        document.getElementById(el).innerHTML = team.roster.map(p => `
            <div class="trade-card ${set.has(p.id)?'selected':''}" onclick="toggleTrade('${p.id}', '${el}')">
                <b>${p.name}</b> (${p.rating}) $${(p.salary/1e6).toFixed(1)}M
            </div>
        `).join('');
    };
    mkList(user, TRADE_ASSETS.my, 'my-trade-list');
    mkList(target, TRADE_ASSETS.their, 'their-trade-list');
}

function toggleTrade(pid, side) {
    const set = side === 'my-trade-list' ? TRADE_ASSETS.my : TRADE_ASSETS.their;
    if(set.has(pid)) set.delete(pid); else set.add(pid);
    renderTradeLists();
}

function attemptTrade() {
    const user = GAME.teams[GAME.userTeamId];
    const target = GAME.teams[document.getElementById('target-team-select').value];
    
    let myOffer = user.roster.filter(p => TRADE_ASSETS.my.has(p.id));
    let theirOffer = target.roster.filter(p => TRADE_ASSETS.their.has(p.id));
    
    let myVal = myOffer.reduce((a,b) => a + b.rating + (30-b.age), 0);
    let theirVal = theirOffer.reduce((a,b) => a + b.rating + (30-b.age), 0);
    
    // Strategy Logic
    if(target.strategy === 'Rebuilding') myVal += myOffer.filter(p=>p.age<24).length * 10;
    
    if(myVal >= theirVal) {
        // Execute
        user.roster = user.roster.filter(p => !TRADE_ASSETS.my.has(p.id)).concat(theirOffer);
        target.roster = target.roster.filter(p => !TRADE_ASSETS.their.has(p.id)).concat(myOffer);
        alert("Trade Accepted!");
        TRADE_ASSETS.my.clear(); TRADE_ASSETS.their.clear();
        renderTradeLists();
    } else {
        document.getElementById('trade-msg').innerText = "Trade Rejected: Value too low.";
    }
}

/* --- UI HELPERS --- */
function navigate(p) {
    document.querySelectorAll('.page').forEach(e => e.classList.remove('active-page'));
    document.getElementById(p).classList.add('active-page');
    if(p === 'trades') {
        const sel = document.getElementById('target-team-select');
        sel.innerHTML = "";
        GAME.teams.forEach(t => { if(t.id!==GAME.userTeamId) sel.innerHTML+=`<option value="${t.id}">${t.name}</option>`; });
        updateTradeTarget();
    }
    updateUI();
}

function updateUI() {
    const user = GAME.teams[GAME.userTeamId];
    document.getElementById('phase-display').innerText = GAME.phase.toUpperCase();
    document.getElementById('date-display').innerText = `DAY ${GAME.day}`;
    
    // View Switching
    ['season-view','playoff-view','draft-view'].forEach(id => document.getElementById(id).style.display='none');
    if(GAME.phase === 'regular') document.getElementById('season-view').style.display='block';
    else if(GAME.phase === 'playoffs') {
        document.getElementById('playoff-view').style.display='block';
        document.getElementById('bracket-container').innerHTML = GAME.playoffMatchups.map(m => `<div>${m.t1.abbr} vs ${m.t2.abbr}</div>`).join('');
    } else {
        document.getElementById('draft-view').style.display='block';
        document.getElementById('draft-pool-list').innerHTML = GAME.draftClass.map((p,i) => `
            <div class="player-row"><button onclick="draftPlayer(${i})">DRAFT</button> ${p.name} (${p.rating})</div>
        `).join('');
    }
    
    // Front Office
    document.getElementById('staff-display').innerHTML = `Coach Lvl: ${user.staff.coach} | Scout Lvl: ${user.staff.scout}`;
    document.getElementById('contract-list').innerHTML = user.roster.map(p => `<div class="player-row">${p.name}: $${(p.salary/1e6).toFixed(1)}M (${p.contract}y)</div>`).join('');
    
    // Roster & Rotation
    document.getElementById('roster-list').innerHTML = user.roster.map(p => `
        <div class="player-row">
            <span class="pos-badge">${p.pos}</span>
            <span class="player-name">${p.name}</span>
            <span class="stat-box">${p.rating}</span>
            <span class="stat-box">${Math.floor(p.fatigue)}%</span>
        </div>`).join('');
        
    document.getElementById('rotation-list').innerHTML = user.roster.map(p => `
        <div class="rotation-row">
            <b>${p.name}</b> <input type="range" max="48" value="${p.minutes}" oninput="this.nextElementSibling.innerText=this.value+'m'; GAME.teams[GAME.userTeamId].roster.find(x=>x.id=='${p.id}').minutes=parseInt(this.value); document.getElementById('total-minutes').innerText=GAME.teams[GAME.userTeamId].roster.reduce((a,b)=>a+b.minutes,0)+'/240'">
            <span>${p.minutes}m</span>
        </div>`).join('');
        
    // News & Standings
    document.getElementById('news-feed').innerHTML = GAME.news.slice(0,6).map(n => `<div class="news-item">${n}</div>`).join('');
    let sorted = [...GAME.teams].sort((a,b)=>b.wins-a.wins);
    document.getElementById('standings-body').innerHTML = sorted.map((t,i) => `
        <tr class="${t.id===user.id?'highlight':''}"><td>${i+1}</td><td>${t.abbr}</td><td>${t.wins}</td><td>${t.losses}</td><td>${t.wins-t.losses}</td></tr>
    `).join('');
}
