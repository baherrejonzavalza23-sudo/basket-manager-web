/* --- CONFIGURATION & GLOBALS --- */
const POSITIONS = ["PG", "SG", "SF", "PF", "C"];
const SEASON_DAYS = 82;
const TRADE_DEADLINE = 50; 

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
    freeAgents: [],
    availableStaff: { coaches: [], scouts: [] },
    playoffMatchups: [],
    draftClass: []
};

/* --- INITIALIZATION --- */
window.onload = function() {
    initMainMenu();
    document.getElementById('team-select-dropdown').addEventListener('change', updateTeamPreview);
};

function initMainMenu() {
    const select = document.getElementById('team-select-dropdown');
    select.innerHTML = "";
    REAL_ROSTERS.forEach((t, i) => {
        select.innerHTML += `<option value="${i}">${t.name}</option>`;
    });

    for(let i=1; i<=3; i++) {
        let save = localStorage.getItem('bm_save_' + i);
        let el = document.getElementById(`slot-${i}-info`);
        let card = document.getElementById(`slot-${i}-card`);
        if(save) {
            let data = JSON.parse(save);
            let tName = data.teams[data.userTeamId].name;
            el.innerHTML = `<span style="color:#00e676">${tName}</span><br>${data.year} - Day ${data.day}`;
            card.classList.add('filled');
        } else {
            el.innerText = "EMPTY";
            card.classList.remove('filled');
        }
    }
    updateTeamPreview();
}

function updateTeamPreview() {
    const idx = document.getElementById('team-select-dropdown').value;
    const data = REAL_ROSTERS[idx];
    document.getElementById('preview-name').innerText = data.name;
    document.getElementById('preview-stars').innerText = data.players.slice(0, 3).join(", ");
    document.getElementById('preview-ovr').innerText = "8" + Math.floor(Math.random()*9);
    document.getElementById('preview-header').style.borderLeft = `5px solid ${data.color}`;
}

function startNewGame() {
    const select = document.getElementById('team-select-dropdown');
    SETTINGS.useLegends = document.getElementById('legends-toggle').checked;
    
    GAME.userTeamId = parseInt(select.value);
    GAME.day = 1;
    GAME.year = 2024;
    GAME.phase = 'regular';
    
    generateLeagueData();
    
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

function saveGame() {
    localStorage.setItem('bm_save_1', JSON.stringify(GAME));
    alert("Saved to Slot 1");
}

function enterGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    navigate('dashboard');
}

function exitToMenu() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('main-menu').style.display = 'flex';
    initMainMenu();
}

/* --- GENERATION --- */
function generateLeagueData() {
    // Teams
    GAME.teams = REAL_ROSTERS.map((data, index) => ({
        id: index,
        name: data.name,
        abbr: data.abbr,
        color: data.color,
        wins: 0, losses: 0,
        roster: generateRoster(data.players),
        staff: { 
            coach: createStaff('Coach'), 
            scout: createStaff('Scout') 
        },
        strategy: index < 10 ? 'Contending' : 'Rebuilding'
    }));

    // Free Agents
    GAME.freeAgents = [];
    for(let i=0; i<30; i++) GAME.freeAgents.push(createPlayer(null, false));

    // Available Staff
    GAME.availableStaff.coaches = [createStaff('Coach'), createStaff('Coach'), createStaff('Coach')];
    GAME.availableStaff.scouts = [createStaff('Scout'), createStaff('Scout'), createStaff('Scout')];

    // Schedule
    generateSchedule();
}

function generateRoster(playerNames) {
    let roster = playerNames.map((name, i) => createPlayer(name, i < 3)); // First 3 are stars
    // Minutes
    roster.forEach((p, i) => {
        p.pos = POSITIONS[i%5];
        p.minutes = i < 5 ? 35 : (i < 10 ? 13 : 0);
    });
    return roster.sort((a,b) => b.rating - a.rating);
}

function createPlayer(name, isStar) {
    let rating = isStar ? 85 + Math.floor(Math.random()*14) : 70 + Math.floor(Math.random()*10);
    if(!name && !isStar) rating -= 8; // Generic FA
    
    return {
        id: Math.random().toString(36).substr(2,9),
        name: name || `Player ${Math.floor(Math.random()*9000)}`,
        rating: rating,
        age: isStar ? 24+Math.floor(Math.random()*10) : 20+Math.floor(Math.random()*15),
        contract: Math.floor(Math.random()*4)+1,
        salary: Math.floor(rating * 250000),
        stamina: 80 + Math.floor(Math.random()*20),
        fatigue: 0,
        minutes: 0
    };
}

function createStaff(type) {
    return {
        type: type,
        name: `${type} ${Math.floor(Math.random()*500)}`,
        rating: Math.floor(Math.random()*5)+1, // 1-5
        salary: 2000000
    };
}

function generateSchedule() {
    GAME.schedule = [];
    for(let d=1; d<=SEASON_DAYS; d++) {
        let dayGames = [];
        let indices = Array.from({length:30}, (_,i)=>i).sort(()=>Math.random()-0.5);
        for(let i=0; i<30; i+=2) dayGames.push({t1:indices[i], t2:indices[i+1]});
        GAME.schedule.push(dayGames);
    }
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

function simMonth() {
    for(let i=0; i<30; i++) { if(GAME.phase === 'regular') simDay(); }
}

function simToDeadline() {
    while(GAME.day < TRADE_DEADLINE && GAME.phase === 'regular') simDay();
}

function simToPlayoffs() {
    while(GAME.phase === 'regular') simDay();
}

function playGame(t1, t2) {
    let s1 = getTeamStrength(t1);
    let s2 = getTeamStrength(t2) + 4; 
    if(s1 + Math.random()*20 > s2 + Math.random()*20) { t1.wins++; t2.losses++; }
    else { t2.wins++; t1.losses++; }
    
    [t1, t2].forEach(t => t.roster.forEach(p => p.fatigue += (p.minutes * 0.4)));
    
    if(t1.id === GAME.userTeamId || t2.id === GAME.userTeamId) {
        let win = (t1.id===GAME.userTeamId && s1>s2) || (t2.id===GAME.userTeamId && s2>s1);
        let opp = t1.id === GAME.userTeamId ? t2.name : t1.name;
        GAME.news.unshift(`Day ${GAME.day}: ${win ? "WIN" : "LOSS"} vs ${opp}`);
    }
}

function getTeamStrength(t) {
    let str = 0;
    t.roster.forEach(p => str += (p.rating - (p.fatigue>50?(p.fatigue-50)*0.5:0)) * (p.minutes/48));
    return str * 2 + (t.staff.coach.rating * 2);
}

/* --- MANAGEMENT --- */
function hireStaff(type, index) {
    let user = GAME.teams[GAME.userTeamId];
    let pool = type === 'Coach' ? GAME.availableStaff.coaches : GAME.availableStaff.scouts;
    let newStaff = pool[index];
    
    if(type === 'Coach') {
        user.staff.coach = newStaff;
        GAME.availableStaff.coaches.splice(index, 1);
        GAME.availableStaff.coaches.push(createStaff('Coach'));
    } else {
        user.staff.scout = newStaff;
        GAME.availableStaff.scouts.splice(index, 1);
        GAME.availableStaff.scouts.push(createStaff('Scout'));
    }
    alert(`Hired ${newStaff.name}`);
    updateUI();
}

function signFreeAgent(index) {
    let user = GAME.teams[GAME.userTeamId];
    if(user.roster.length >= 15) { alert("Roster Full (15)"); return; }
    
    let p = GAME.freeAgents[index];
    user.roster.push(p);
    GAME.freeAgents.splice(index, 1);
    alert(`Signed ${p.name}`);
    updateUI();
}

function cutPlayer(pid) {
    let user = GAME.teams[GAME.userTeamId];
    if(user.roster.length <= 8) { alert("Minimum 8 Players"); return; }
    
    let pIdx = user.roster.findIndex(p => p.id === pid);
    if(pIdx > -1) {
        let p = user.roster[pIdx];
        user.roster.splice(pIdx, 1);
        GAME.freeAgents.push(p);
        alert(`Released ${p.name}`);
        updateUI();
    }
}

/* --- TRADES --- */
function updateTradeTarget() {
    TRADE_ASSETS = { my: new Set(), their: new Set() };
    renderTradeLists();
}

function renderTradeLists() {
    const user = GAME.teams[GAME.userTeamId];
    const target = GAME.teams[document.getElementById('target-team-select').value];
    
    const mkList = (team, set, el) => {
        document.getElementById(el).innerHTML = team.roster.map(p => `
            <div class="trade-card ${set.has(p.id)?'selected':''}" onclick="toggleTrade('${p.id}', '${el}')">
                <b>${p.name}</b> (${p.rating}) | ${p.age}yo | $${(p.salary/1e6).toFixed(1)}M
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
    
    if(myOffer.length === 0 && theirOffer.length === 0) return;

    let myVal = myOffer.reduce((a,b) => a + b.rating + (30-b.age), 0);
    let theirVal = theirOffer.reduce((a,b) => a + b.rating + (30-b.age), 0);
    
    if(target.strategy === 'Rebuilding') myVal += myOffer.filter(p=>p.age<24).length * 15;
    
    if(myVal >= theirVal) {
        user.roster = user.roster.filter(p => !TRADE_ASSETS.my.has(p.id)).concat(theirOffer);
        target.roster = target.roster.filter(p => !TRADE_ASSETS.their.has(p.id)).concat(myOffer);
        alert("Trade Accepted!");
        TRADE_ASSETS.my.clear(); TRADE_ASSETS.their.clear();
        renderTradeLists();
    } else {
        document.getElementById('trade-msg').innerText = "Trade Rejected.";
    }
}

/* --- PLAYOFFS & DRAFT --- */
function startPlayoffs() {
    GAME.phase = 'playoffs';
    let sorted = [...GAME.teams].sort((a,b)=>b.wins-a.wins).slice(0, 16);
    GAME.playoffMatchups = [];
    for(let i=0; i<8; i++) GAME.playoffMatchups.push({t1:sorted[i], t2:sorted[15-i]});
    GAME.news.unshift("Playoffs Started");
    updateUI();
}

function simPlayoffRound() {
    let winners = [];
    GAME.playoffMatchups.forEach(m => {
        let w = getTeamStrength(m.t1) > getTeamStrength(m.t2) ? m.t1 : m.t2;
        winners.push(w);
        GAME.news.unshift(`${w.name} advances`);
    });
    
    if(winners.length === 1) {
        alert(`${winners[0].name} Champion!`);
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
    for(let i=0; i<40; i++) GAME.draftClass.push(createPlayer(null, true));
    if(SETTINGS.useLegends) ["M. Jordan","K. Bryant","L. Bird"].forEach(n => GAME.draftClass.unshift(createPlayer(n, true)));
    updateUI();
}

function draftPlayer(idx) {
    let p = GAME.draftClass[idx];
    GAME.teams[GAME.userTeamId].roster.push(p);
    alert(`Drafted ${p.name}`);
    startNewSeason();
}

function startNewSeason() {
    GAME.year++;
    GAME.day = 1;
    GAME.phase = 'regular';
    generateSchedule();
    GAME.teams.forEach(t => {
        t.wins=0; t.losses=0;
        t.roster.forEach(p => { p.age++; p.fatigue=0; });
    });
    GAME.news = [`${GAME.year} Season`];
    updateUI();
}

/* --- UI --- */
function navigate(p) {
    document.querySelectorAll('.page').forEach(e => e.classList.remove('active-page'));
    document.getElementById(p).classList.add('active-page');
    
    // Update Active Button Color
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    let btn = document.getElementById(`btn-${p}`);
    if(btn) btn.classList.add('active');

    if(p === 'trades') updateTradeTarget();
    updateUI();
}

function updateUI() {
    const user = GAME.teams[GAME.userTeamId];
    document.getElementById('phase-display').innerText = GAME.phase.toUpperCase();
    document.getElementById('date-display').innerText = `DAY ${GAME.day}`;
    document.getElementById('team-record').innerText = `${user.wins}-${user.losses}`;

    // Logos
    document.getElementById('my-team-logo').innerText = user.abbr;
    document.getElementById('my-team-logo').style.backgroundColor = user.color;

    // View Toggles
    document.getElementById('season-view').style.display = GAME.phase==='regular'?'block':'none';
    document.getElementById('playoff-view').style.display = GAME.phase==='playoffs'?'block':'none';
    document.getElementById('draft-view').style.display = GAME.phase==='draft'?'block':'none';

    // Roster
    document.getElementById('roster-list').innerHTML = user.roster.map(p => `
        <div class="player-row">
            <span class="pos-badge">${p.pos}</span>
            <span class="player-name">${p.name}</span>
            <span class="stat-box">${p.age}yo</span>
            <span class="stat-box">${p.rating}</span>
            <span class="stat-box">${Math.floor(p.fatigue)}%</span>
        </div>`).join('');

    // Rotation (Starters Visual)
    document.getElementById('rotation-list').innerHTML = user.roster.map((p,i) => `
        <div class="rotation-row ${i<5 ? 'starter-row' : ''}">
            <div style="width:150px;">
                ${i<5 ? '<span class="starter-tag">S</span>' : ''} 
                <b>${p.name}</b>
            </div>
            <input type="range" max="48" value="${p.minutes}" oninput="this.nextElementSibling.innerText=this.value+'m'; GAME.teams[GAME.userTeamId].roster.find(x=>x.id=='${p.id}').minutes=parseInt(this.value); updateUI();">
            <span style="width:40px; text-align:right;">${p.minutes}m</span>
        </div>`).join('');
    let totMin = user.roster.reduce((a,b)=>a+b.minutes,0);
    document.getElementById('total-minutes').innerText = `${totMin}/240`;
    document.getElementById('total-minutes').style.color = totMin > 240 ? 'red' : 'white';

    // Agency
    document.getElementById('fa-list').innerHTML = GAME.freeAgents.map((p,i) => `
        <div class="player-row">
            <b>${p.name}</b> (${p.rating})
            <button class="sim-btn" style="padding:2px 5px;" onclick="signFreeAgent(${i})">SIGN</button>
        </div>`).join('');
    document.getElementById('cut-list').innerHTML = user.roster.map(p => `
        <div class="player-row">
            ${p.name}
            <button class="sim-btn" style="padding:2px 5px; background:red;" onclick="cutPlayer('${p.id}')">CUT</button>
        </div>`).join('');

    // Office
    document.getElementById('staff-display').innerHTML = `
        <div class="staff-card"><b>HC:</b> ${user.staff.coach.name} (${user.staff.coach.rating}*) <button onclick="alert('Fire coach to hire new')">FIRE</button></div>
        <div class="staff-card"><b>SC:</b> ${user.staff.scout.name} (${user.staff.scout.rating}*) <button onclick="alert('Fire scout to hire new')">FIRE</button></div>
    `;
    document.getElementById('coach-market').innerHTML = GAME.availableStaff.coaches.map((s,i) => `
        <div class="staff-market-card">COACH (${s.rating}*) <br> <button onclick="hireStaff('Coach',${i})">HIRE</button></div>
    `).join('');
    document.getElementById('scout-market').innerHTML = GAME.availableStaff.scouts.map((s,i) => `
        <div class="staff-market-card">SCOUT (${s.rating}*) <br> <button onclick="hireStaff('Scout',${i})">HIRE</button></div>
    `).join('');

    // Standings & News
    document.getElementById('news-feed').innerHTML = GAME.news.slice(0,6).map(n => `<div class="news-item">${n}</div>`).join('');
    let sorted = [...GAME.teams].sort((a,b)=>b.wins-a.wins);
    document.getElementById('standings-body').innerHTML = sorted.map((t,i) => `
        <tr class="${t.id===user.id?'highlight':''}"><td>${i+1}</td><td>${t.abbr}</td><td>${t.wins}</td><td>${t.losses}</td><td>${t.wins-t.losses}</td></tr>
    `).join('');

    if(GAME.phase === 'playoffs') {
         document.getElementById('bracket-container').innerHTML = GAME.playoffMatchups.map(m => `<div>${m.t1.abbr} vs ${m.t2.abbr}</div>`).join('');
    }
}
