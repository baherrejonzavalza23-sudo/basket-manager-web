/* --- CONFIGURATION --- */
const TEAM_NAMES = [
    "Atlanta Birds", "Boston Green", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls",
    "Cleveland Cavs", "Dallas Mavs", "Denver Nuggets", "Detroit Pistons", "Golden State",
    "Houston Rockets", "Indiana Pacers", "LA Clippers", "LA Lakers", "Memphis Bears",
    "Miami Heat", "Milwaukee Bucks", "Minnesota Wolves", "NO Pelicans", "NY Knicks",
    "OKC Thunder", "Orlando Magic", "Philly 76ers", "Phoenix Suns", "Portland Blazers",
    "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors", "Utah Jazz", "Wash Wizards"
];
const POSITIONS = ["PG", "SG", "SF", "PF", "C"];
const USER_TEAM_ID = 13; 
const SALARY_CAP = 140000000;
const TRADE_DEADLINE_WEEK = 15;
const SEASON_LENGTH = 25; // Shortened for gameplay

/* --- STATE --- */
let LEAGUE = {
    week: 1,
    day: 1,
    year: 2024,
    phase: 'regular', // regular, playoffs, offseason
    teams: [],
    news: []
};

let TRADE_STATE = { myAssets: new Set(), theirAssets: new Set() };

/* --- INITIALIZATION --- */
window.onload = function() {
    // Try auto-load slot 1, else init
    if(localStorage.getItem('bm_save_1')) {
        loadGame(1);
    } else {
        initLeague();
    }
    updateUI();
};

function initLeague() {
    LEAGUE.teams = TEAM_NAMES.map((name, index) => ({
        id: index,
        name: name,
        wins: 0,
        losses: 0,
        roster: generateRoster(),
        coach: createStaff('Head Coach'),
        scout: createStaff('Scout'),
        picks: generatePicks(index),
        rotation: { starters: [], bench: [], reserves: [] } // Will be filled
    }));
    
    LEAGUE.teams.forEach(t => autoSetRotation(t));
}

/* --- DATA GENERATION --- */
function generateRoster() {
    let roster = [];
    for(let i=0; i<13; i++) roster.push(createPlayer(POSITIONS[i%5]));
    return roster.sort((a,b) => b.rating - a.rating);
}

function createPlayer(pos) {
    let rating = 65 + Math.floor(Math.random()*30);
    return {
        id: Math.random().toString(36).substr(2, 9),
        name: "Player " + Math.floor(Math.random()*9000+1000),
        pos: pos,
        age: 19 + Math.floor(Math.random()*15),
        rating: rating,
        salary: Math.floor(Math.pow(rating-55, 3)*100) + 900000,
        mood: 100
    };
}

function createStaff(role) {
    const grades = ["D", "C", "B", "A", "S"];
    let val = Math.floor(Math.random()*5);
    return {
        role: role,
        name: (role==='Scout'?'Scout ':'Coach ') + Math.floor(Math.random()*500),
        grade: grades[val],
        rating: val + 1, // 1-5
        salary: (val+1) * 500000
    };
}

function generatePicks(teamId) {
    return [
        { year: LEAGUE.year, round: 1, originalOwner: teamId },
        { year: LEAGUE.year+1, round: 1, originalOwner: teamId }
    ];
}

/* --- ROTATION LOGIC --- */
function autoSetRotation(team) {
    // Simple logic: Best 5 are starters, next 5 bench, rest reserves
    let sorted = [...team.roster].sort((a,b) => b.rating - a.rating);
    team.rotation.starters = sorted.slice(0, 5).map(p => p.id);
    team.rotation.bench = sorted.slice(5, 10).map(p => p.id);
    team.rotation.reserves = sorted.slice(10).map(p => p.id);
}

function getTeamStrength(team) {
    // Weighted Rating: Starters 70%, Bench 30% + Coach
    let startSum = 0, benchSum = 0;
    
    team.rotation.starters.forEach(id => {
        let p = team.roster.find(x => x.id === id);
        if(p) startSum += p.rating;
    });
    
    team.rotation.bench.forEach(id => {
        let p = team.roster.find(x => x.id === id);
        if(p) benchSum += p.rating;
    });

    let sAvg = startSum / 5;
    let bAvg = benchSum / 5;
    
    return (sAvg * 0.7) + (bAvg * 0.3) + (team.coach.rating * 2);
}

/* --- SIMULATION --- */
function simDay() {
    if(checkSeasonEnd()) return;
    
    // Simulate 1-3 games per day logic
    // For simplicity, we just sim a "round" of games for random teams
    let teamsPlayed = new Set();
    
    // Pick pairs
    for(let i=0; i<30; i++) {
        if(teamsPlayed.has(i)) continue;
        
        // Find opponent
        let opp = Math.floor(Math.random()*30);
        if(opp !== i && !teamsPlayed.has(opp)) {
            playGame(LEAGUE.teams[i], LEAGUE.teams[opp]);
            teamsPlayed.add(i);
            teamsPlayed.add(opp);
        }
    }
    
    LEAGUE.day++;
    if(LEAGUE.day > 7) {
        LEAGUE.day = 1;
        LEAGUE.week++;
        handleWeeklyProgression();
    }
    updateUI();
}

function playGame(t1, t2) {
    let s1 = getTeamStrength(t1) + (Math.random()*20);
    let s2 = getTeamStrength(t2) + (Math.random()*20); // Home court could be added here
    
    if(s1 > s2) { t1.wins++; t2.losses++; }
    else { t2.wins++; t1.losses++; }
    
    // Log if user team
    if(t1.id === USER_TEAM_ID || t2.id === USER_TEAM_ID) {
        let res = t1.id === USER_TEAM_ID ? (s1>s2?'W':'L') : (s2>s1?'W':'L');
        let oppName = t1.id === USER_TEAM_ID ? t2.name : t1.name;
        logNews(`Game vs ${oppName}: ${res}`);
    }
}

function simWeek() {
    for(let i=0; i<7; i++) simDay();
}

function simMonth() {
    for(let i=0; i<4; i++) simWeek();
}

function simToDeadline() {
    while(LEAGUE.week < TRADE_DEADLINE_WEEK) simWeek();
    alert("Trade Deadline has arrived!");
}

function handleWeeklyProgression() {
    // In-season progression: small chance to change rating
    LEAGUE.teams.forEach(t => {
        t.roster.forEach(p => {
            let roll = Math.random();
            if(roll < 0.02 && p.age < 25) { // 2% chance improvement for youth
                p.rating++;
                if(t.id === USER_TEAM_ID) logNews(`${p.name} improved to ${p.rating}!`);
            }
            if(roll > 0.99 && p.age > 32) { // 1% chance decline for old
                p.rating--;
            }
        });
    });
}

function checkSeasonEnd() {
    if(LEAGUE.week > SEASON_LENGTH) {
        alert("Regular Season Over! Playoffs starting...");
        // Here you would trigger playoff logic (omitted for brevity)
        return true;
    }
    return false;
}

/* --- UI UPDATES --- */
function navigate(page) {
    document.querySelectorAll('.page').forEach(e => e.classList.remove('active-page'));
    document.getElementById(page).classList.add('active-page');
    
    document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('active'));
    // Find button with onclick that matches and add active
    // Simplified:
    updateUI(); 
}

function updateUI() {
    // Header
    const userTeam = LEAGUE.teams[USER_TEAM_ID];
    document.getElementById('date-display').innerText = `Week ${LEAGUE.week} | Day ${LEAGUE.day}`;
    document.getElementById('team-record').innerText = `${userTeam.wins}-${userTeam.losses}`;
    
    let totalCap = userTeam.roster.reduce((a,b)=>a+b.salary,0);
    document.getElementById('salary-cap').innerText = `Cap Space: $${((SALARY_CAP-totalCap)/1e6).toFixed(1)}M`;
    
    // Dashboard
    document.getElementById('news-feed').innerHTML = LEAGUE.news.map(n => `<div class="news-item">${n}</div>`).join('');
    
    // Render Active Tab
    const activePage = document.querySelector('.active-page').id;
    if(activePage === 'roster') renderRosterUI();
    if(activePage === 'rotation') renderRotationUI();
    if(activePage === 'front-office') renderFOUI();
    if(activePage === 'standings') renderStandingsUI();
    if(activePage === 'trades') setupTradeUI();
}

function renderRotationUI() {
    const t = LEAGUE.teams[USER_TEAM_ID];
    
    const makeCard = (pid, type) => {
        let p = t.roster.find(x => x.id === pid);
        if(!p) return '';
        return `<div class="player-card mini" onclick="movePlayerRotation('${pid}', '${type}')">
            <b>${p.pos}</b> ${p.name} <span class="rating">${p.rating}</span>
        </div>`;
    };

    document.getElementById('starters-list').innerHTML = t.rotation.starters.map(id => makeCard(id, 'starters')).join('');
    document.getElementById('bench-list').innerHTML = t.rotation.bench.map(id => makeCard(id, 'bench')).join('');
    document.getElementById('reserves-list').innerHTML = t.rotation.reserves.map(id => makeCard(id, 'reserves')).join('');
}

function movePlayerRotation(pid, currentList) {
    const t = LEAGUE.teams[USER_TEAM_ID];
    // Simple rotation cycle: Starters -> Bench -> Reserves -> Starters
    let nextList = currentList === 'starters' ? 'bench' : (currentList === 'bench' ? 'reserves' : 'starters');
    
    // Validation: Starters max 5, Bench max 5 (flexible)
    if(nextList === 'starters' && t.rotation.starters.length >= 5) {
        alert("Starters full! Click a starter to move them out first.");
        return;
    }
    
    // Remove from current
    t.rotation[currentList] = t.rotation[currentList].filter(id => id !== pid);
    // Add to next
    t.rotation[nextList].push(pid);
    
    updateUI();
}

function renderFOUI() {
    const t = LEAGUE.teams[USER_TEAM_ID];
    
    // Payroll
    let html = '';
    t.roster.forEach(p => {
        html += `<div class="row-spread"><span>${p.name}</span><span>$${(p.salary/1e6).toFixed(2)}M</span></div>`;
    });
    document.getElementById('payroll-list').innerHTML = html;
    
    // Staff
    let staffHtml = `
        <div class="staff-box">
            <h4>${t.coach.role}</h4>
            <div class="grade">${t.coach.grade}</div>
            <div>${t.coach.name}</div>
            <div class="salary">$${(t.coach.salary/1e6).toFixed(2)}M</div>
        </div>
        <div class="staff-box">
            <h4>${t.scout.role}</h4>
            <div class="grade">${t.scout.grade}</div>
            <div>${t.scout.name}</div>
            <div class="salary">$${(t.scout.salary/1e6).toFixed(2)}M</div>
        </div>
    `;
    document.getElementById('fo-staff-list').innerHTML = staffHtml;
    
    // Picks
    document.getElementById('fo-picks-list').innerHTML = t.picks.map(p => 
        `<div class="row-spread"><span>${p.year} Round ${p.round}</span><span>Original: ${LEAGUE.teams[p.originalOwner].name}</span></div>`
    ).join('');
}

function renderStandingsUI() {
    const tbody = document.getElementById('standings-body');
    let sorted = [...LEAGUE.teams].sort((a,b) => b.wins - a.wins);
    tbody.innerHTML = sorted.map((t, i) => `
        <tr class="${t.id===USER_TEAM_ID ? 'highlight' : ''}">
            <td>${i+1}</td>
            <td>${t.name}</td>
            <td>${t.wins}</td>
            <td>${t.losses}</td>
            <td>${t.wins - t.losses}</td>
        </tr>
    `).join('');
}

/* --- SAVE SYSTEM --- */
function saveGame() {
    const slot = document.getElementById('save-slot-select').value;
    localStorage.setItem(`bm_save_${slot}`, JSON.stringify(LEAGUE));
    alert(`Game saved to Slot ${slot}!`);
}

function loadGame(slotOverride) {
    const slot = slotOverride || document.getElementById('save-slot-select').value;
    const data = localStorage.getItem(`bm_save_${slot}`);
    if(data) {
        LEAGUE = JSON.parse(data);
        alert(`Loaded Slot ${slot}`);
        updateUI();
    } else {
        alert("No save found in this slot.");
    }
}

function logNews(msg) {
    LEAGUE.news.unshift(msg);
    if(LEAGUE.news.length > 20) LEAGUE.news.pop();
}

/* --- TRADES & ROSTER (Simplified for length) --- */
function renderRosterUI() {
    document.getElementById('roster-list').innerHTML = LEAGUE.teams[USER_TEAM_ID].roster.map(p => 
        `<div class="player-card"><b>${p.pos}</b> ${p.name} (${p.rating}) <span style="float:right">$${(p.salary/1e6).toFixed(1)}M</span></div>`
    ).join('');
}
function setupTradeUI() { /* Similar to previous versions */ }
