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
const USER_TEAM_ID = 13; // LA Lakers
const SALARY_CAP = 140000000;
const REGULAR_SEASON_WEEKS = 20;

const LEGENDS_POOL = [
    {name: "M. Jordan", pos: "SG"}, {name: "K. Bryant", pos: "SG"}, {name: "L. James", pos: "SF"},
    {name: "S. O'Neal", pos: "C"}, {name: "M. Johnson", pos: "PG"}, {name: "L. Bird", pos: "SF"},
    {name: "T. Duncan", pos: "PF"}, {name: "W. Chamberlain", pos: "C"}, {name: "A. Iverson", pos: "SG"}
];

/* --- SETTINGS STATE --- */
let SETTINGS = {
    draftQuality: 50,
    tradeFreq: 30, // Chance of CPU trade per week
    aggression: 50, // Ease of accepting trades
    youthVal: 50, // 0 = Value Rating, 100 = Value Potential/Picks
    legends: false
};

/* --- LEAGUE STATE --- */
let LEAGUE = {
    year: 2024,
    phase: 'regular',
    week: 1,
    teams: [],
    playoffMatches: [],
    draftClass: [],
    draftOrder: []
};

/* --- INITIALIZATION --- */
window.onload = function() {
    initLeague();
    updateUI();
};

function initLeague() {
    LEAGUE.teams = TEAM_NAMES.map((name, index) => ({
        id: index,
        name: name,
        wins: 0,
        losses: 0,
        roster: generateRoster(index)
    }));
}

function resetLeague() {
    if(confirm("Are you sure? This will delete your current save.")) {
        LEAGUE.year = 2024;
        LEAGUE.phase = 'regular';
        LEAGUE.week = 1;
        initLeague();
        updateUI();
        navigate('roster');
    }
}

function updateSetting(key, val) {
    SETTINGS[key] = key === 'legends' ? val : parseInt(val);
    if(key !== 'legends') document.getElementById('val-' + key).innerText = val;
}

function generateRoster(teamId) {
    let roster = [];
    // Add 13 Players
    for (let pos of POSITIONS) {
        for (let i = 0; i < 2; i++) roster.push(createRandomPlayer(pos));
    }
    while(roster.length < 13) roster.push(createRandomPlayer(POSITIONS[Math.floor(Math.random()*5)]));
    
    // Add Future Picks (Simulated as players for trade logic)
    roster.push({name: "1st Round Pick", pos: "PICK", age: 0, rating: 75, salary: 0, isPick: true});
    
    return roster.sort((a, b) => b.rating - a.rating);
}

function createRandomPlayer(pos, isRookie = false) {
    const names = ["James", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Curry", "Doncic", "Jokic"];
    const first = ["Le", "De", "Ja", "Ma", "Ka", "Ty", "Ky", "Lu", "Ste", "Chris"];
    
    let age = isRookie ? 19 + Math.floor(Math.random()*4) : 20 + Math.floor(Math.random()*18);
    
    // Base Rating Calculation adjusted by Settings
    let base = isRookie ? 65 : 70;
    
    // Apply Draft Quality Setting to Rookies
    if(isRookie) {
        base += (SETTINGS.draftQuality - 50) / 2; // +/- 25 rating swing
    }

    let rating = Math.floor(Math.random() * 30) + base; 
    if (rating > 99) rating = 99;
    if (rating < 40) rating = 40;

    let salary = Math.floor(Math.pow(rating - 55, 3) * 100) + 900000;
    if(salary < 900000) salary = 900000;

    return {
        name: first[Math.floor(Math.random()*first.length)] + ". " + names[Math.floor(Math.random()*names.length)],
        pos: pos,
        age: age,
        rating: Math.floor(rating),
        salary: salary,
        isPick: false
    };
}

/* --- NAVIGATION --- */
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    
    if (pageId === 'roster') renderRoster();
    if (pageId === 'standings') renderStandings();
    if (pageId === 'trades') setupTradeView();
    if (pageId === 'play') updatePlayUI();
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    let activeBtn = document.querySelector(`button[onclick="navigate('${pageId}')"]`);
    if(activeBtn) activeBtn.classList.add('active');
}

/* --- UI RENDERING --- */
function updatePlayUI() {
    if (LEAGUE.phase === 'regular') {
        document.getElementById('next-opponent').innerText = "Week " + LEAGUE.week;
        document.getElementById('sim-btn').style.display = "block";
    } else if (LEAGUE.phase === 'playoffs') {
        document.getElementById('sim-btn').style.display = "none";
        document.getElementById('btn-playoffs').style.display = "inline-block";
    }
}

function renderRoster() {
    const list = document.getElementById('roster-list');
    list.innerHTML = "";
    const myTeam = LEAGUE.teams[USER_TEAM_ID];
    
    let totalSal = myTeam.roster.filter(p=>!p.isPick).reduce((a,b)=>a+b.salary,0);
    document.getElementById('salary-cap').innerText = "Cap: $" + ((SALARY_CAP - totalSal)/1e6).toFixed(1) + "M";
    document.getElementById('roster-count').innerText = `${myTeam.roster.length} Assets`;

    myTeam.roster.forEach(p => {
        let displayRating = p.isPick ? "UNK" : p.rating;
        let styleClass = p.isPick ? "pick-row" : "player-row";
        
        list.innerHTML += `
            <div class="${styleClass}">
                <span class="pos-badge">${p.pos}</span>
                <span class="player-name">${p.name}</span>
                <span class="player-age">${p.age > 0 ? p.age+'yo' : '-'}</span>
                <span class="player-rating ${p.rating > 89 ? 'elite' : ''}">${displayRating}</span>
                <span class="player-salary">$${(p.salary/1e6).toFixed(1)}M</span>
            </div>`;
    });
}

function renderStandings() {
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = "";
    const sorted = [...LEAGUE.teams].sort((a,b) => b.wins - a.wins);
    
    sorted.forEach((t, index) => {
        let isUser = t.id === USER_TEAM_ID ? "user-row" : "";
        tbody.innerHTML += `<tr class="${isUser}"><td>${index + 1}</td><td>${t.name}</td><td>${t.wins}</td><td>${t.losses}</td></tr>`;
    });
}

/* --- SIMULATION CORE --- */
function getTeamRating(team) {
    let players = team.roster.filter(p => !p.isPick);
    let top8 = players.sort((a,b) => b.rating - a.rating).slice(0, 8);
    return top8.reduce((sum, p) => sum + p.rating, 0) / 8;
}

function simulateWeek() {
    if (LEAGUE.week > REGULAR_SEASON_WEEKS) {
        startPlayoffs();
        return;
    }

    // 1. Play Games
    let indices = LEAGUE.teams.map(t => t.id).sort(() => Math.random() - 0.5);
    for (let i = 0; i < indices.length; i += 2) {
        simulateGame(LEAGUE.teams[indices[i]], LEAGUE.teams[indices[i+1]]);
    }
    
    // 2. CPU Trades
    if(Math.random() * 100 < SETTINGS.tradeFreq) {
        simulateCpuTrade();
    }

    logNews(`Week ${LEAGUE.week} completed.`);
    LEAGUE.week++;
    updatePlayUI();
    
    if (LEAGUE.week > REGULAR_SEASON_WEEKS) {
        document.getElementById('sim-btn').innerText = "Start Playoffs";
        document.getElementById('sim-btn').onclick = startPlayoffs;
    }
}

function simulateGame(teamA, teamB) {
    let scoreA = Math.floor(getTeamRating(teamA) + (Math.random() * 20));
    let scoreB = Math.floor(getTeamRating(teamB) + (Math.random() * 20));
    if(scoreA === scoreB) scoreA++;
    if(scoreA > scoreB) { teamA.wins++; teamB.losses++; }
    else { teamB.wins++; teamA.losses++; }
}

function simulateCpuTrade() {
    // Pick two random teams (not user)
    let t1 = LEAGUE.teams[Math.floor(Math.random()*30)];
    let t2 = LEAGUE.teams[Math.floor(Math.random()*30)];
    if(t1.id === USER_TEAM_ID || t2.id === USER_TEAM_ID || t1.id === t2.id) return;

    // Pick random assets
    let a1 = t1.roster[Math.floor(Math.random()*t1.roster.length)];
    let a2 = t2.roster[Math.floor(Math.random()*t2.roster.length)];

    // Evaluate
    let val1 = getTradeValue(a1);
    let val2 = getTradeValue(a2);
    
    // Trade if values are close (within 5 + Aggression factor)
    let threshold = 5 + (SETTINGS.aggression / 10);
    
    if(Math.abs(val1 - val2) < threshold) {
        // Swap
        t1.roster = t1.roster.filter(p => p !== a1);
        t2.roster = t2.roster.filter(p => p !== a2);
        t1.roster.push(a2);
        t2.roster.push(a1);
        logNews(`TRADE: ${t1.name} swap ${a1.name} for ${a2.name} from ${t2.name}`, "trade");
    }
}

/* --- TRADE LOGIC --- */
function setupTradeView() {
    const teamSelect = document.getElementById('target-team-select');
    const mySelect = document.getElementById('my-trade-player');
    
    if (teamSelect.options.length === 0) {
        LEAGUE.teams.forEach(t => {
            if (t.id !== USER_TEAM_ID) teamSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }

    mySelect.innerHTML = "";
    LEAGUE.teams[USER_TEAM_ID].roster.forEach((p, idx) => {
        mySelect.innerHTML += `<option value="${idx}">${p.name} (${p.rating})</option>`;
    });
    updateTradeTarget();
}

function updateTradeTarget() {
    const targetId = document.getElementById('target-team-select').value;
    const theirSelect = document.getElementById('their-trade-player');
    theirSelect.innerHTML = "";
    LEAGUE.teams[targetId].roster.forEach((p, idx) => {
        theirSelect.innerHTML += `<option value="${idx}">${p.name} (${p.rating})</option>`;
    });
}

function getTradeValue(player) {
    if(player.isPick) {
        // Pick value is driven by Youth Value setting
        // If Youth Val is 100, Pick = 90 rating. If Youth Val is 0, Pick = 60 rating.
        return 60 + (SETTINGS.youthVal * 0.3);
    }
    
    let value = player.rating;
    
    // Age Modifier based on Settings
    if(player.age < 24) {
        // Boost young players if setting is high
        value += (SETTINGS.youthVal / 10);
    } else if (player.age > 32) {
        // Penalize old players if setting is high
        value -= (SETTINGS.youthVal / 10);
    }
    
    return value;
}

function attemptTrade() {
    const myPIdx = document.getElementById('my-trade-player').value;
    const targetTeamId = document.getElementById('target-team-select').value;
    const theirPIdx = document.getElementById('their-trade-player').value;

    const myTeam = LEAGUE.teams[USER_TEAM_ID];
    const otherTeam = LEAGUE.teams[targetTeamId];
    const myAsset = myTeam.roster[myPIdx];
    const theirAsset = otherTeam.roster[theirPIdx];
    const msg = document.getElementById('trade-result');

    let myVal = getTradeValue(myAsset);
    let theirVal = getTradeValue(theirAsset);
    
    // Aggression helps bridge the gap
    let allowedDiff = 3 + (SETTINGS.aggression / 5);

    if (theirVal > myVal + allowedDiff) {
        msg.innerText = "Rejected: Value mismatch.";
        msg.style.color = "red";
    } else {
        // Swap
        myTeam.roster[myPIdx] = theirAsset;
        otherTeam.roster[theirPIdx] = myAsset;
        msg.innerText = "Trade Accepted!";
        msg.style.color = "#4caf50";
        setupTradeView();
    }
}

function logNews(msg, type="neutral") {
    const feed = document.getElementById('news-feed');
    let colorClass = type === 'trade' ? 'trade-news' : 'neutral';
    feed.innerHTML = `<div class="news-item ${colorClass}">${msg}</div>` + feed.innerHTML;
}

/* --- PLAYOFFS & OFFSEASON --- */
// (Playoff Logic shortened for brevity, largely same as before)
function startPlayoffs() {
    LEAGUE.phase = 'playoffs';
    navigate('playoffs');
    let sorted = [...LEAGUE.teams].sort((a,b) => b.wins - a.wins).slice(0, 16);
    LEAGUE.playoffMatches = [];
    for(let i=0; i<8; i++) LEAGUE.playoffMatches.push({ team1: sorted[i], team2: sorted[15-i] });
    renderBracket();
    updateUI();
}

function renderBracket() {
    const container = document.getElementById('bracket-display');
    container.innerHTML = "";
    if(LEAGUE.playoffMatches.length === 1 && LEAGUE.playoffMatches[0].winner) {
         container.innerHTML = `<div class="champ-banner">🏆 ${LEAGUE.playoffMatches[0].winner.name} 🏆</div>`;
         document.getElementById('sim-playoff-btn').innerText = "Start Offseason";
         document.getElementById('sim-playoff-btn').onclick = startOffseason;
         return;
    }
    LEAGUE.playoffMatches.forEach(m => {
        container.innerHTML += `<div class="matchup-box"><div>${m.team1.name}</div>VS<div>${m.team2.name}</div></div>`;
    });
}

function simPlayoffRound() {
    let next = [];
    let winners = [];
    LEAGUE.playoffMatches.forEach(m => {
        let w = getTeamRating(m.team1) > getTeamRating(m.team2) ? m.team1 : m.team2;
        winners.push(w);
    });
    if(winners.length === 1) LEAGUE.playoffMatches = [{winner: winners[0]}];
    else {
        for(let i=0; i<winners.length; i+=2) next.push({team1: winners[i], team2: winners[i+1]});
        LEAGUE.playoffMatches = next;
    }
    renderBracket();
}

/* --- DRAFT & LEGENDS --- */
function startOffseason() {
    LEAGUE.phase = 'draft';
    navigate('draft');
    
    LEAGUE.draftClass = [];
    // 1. Generate normal players
    for(let i=0; i<55; i++) {
        LEAGUE.draftClass.push(createRandomPlayer(POSITIONS[Math.floor(Math.random()*5)], true));
    }
    
    // 2. Generate Legends if enabled
    if(SETTINGS.legends) {
        for(let i=0; i<3; i++) {
            if(Math.random() > 0.5) {
                let legend = LEGENDS_POOL[Math.floor(Math.random()*LEGENDS_POOL.length)];
                LEAGUE.draftClass.unshift({
                    name: legend.name,
                    pos: legend.pos,
                    age: 19,
                    rating: 85 + Math.floor(Math.random() * 10), // Super high rating
                    salary: 5000000,
                    isPick: false
                });
            }
        }
    }
    
    LEAGUE.draftOrder = [...LEAGUE.teams].sort((a,b) => a.wins - b.wins);
    renderDraft();
    updateUI();
}

function renderDraft() {
    const list = document.getElementById('draft-list');
    list.innerHTML = "";
    let userPickIndex = LEAGUE.draftOrder.findIndex(t => t.id === USER_TEAM_ID);
    document.getElementById('draft-pick-info').innerText = `Pick #${userPickIndex + 1}`;

    LEAGUE.draftClass.forEach((p, idx) => {
        list.innerHTML += `
            <div class="player-row">
                <span class="pos-badge">${p.pos}</span>
                <span class="player-name">${p.name}</span>
                <span class="player-rating">${p.rating}</span>
                <button class="sign-btn" onclick="draftPlayer(${idx})">Draft</button>
            </div>`;
    });
}

function draftPlayer(idx) {
    let userPickIndex = LEAGUE.draftOrder.findIndex(t => t.id === USER_TEAM_ID);
    
    // CPU Picks
    for(let i=0; i<userPickIndex; i++) {
        let pick = LEAGUE.draftClass.shift();
        LEAGUE.draftOrder[i].roster.push(pick);
    }
    
    // User Pick
    let player = LEAGUE.draftClass[idx - userPickIndex];
    LEAGUE.teams[USER_TEAM_ID].roster.push(player);
    alert(`Drafted ${player.name}!`);
    
    // Clean up & Next Season
    LEAGUE.year++;
    LEAGUE.week = 1;
    LEAGUE.phase = 'regular';
    LEAGUE.teams.forEach(t => { t.wins=0; t.losses=0; t.roster.forEach(p=> { p.age++; if(p.age<27)p.rating+=2; if(p.age>32)p.rating-=2; }); });
    navigate('play');
    updateUI();
    document.getElementById('sim-btn').innerText = "Simulate Week";
    document.getElementById('sim-btn').onclick = simulateWeek;
    document.getElementById('btn-playoffs').style.display = "none";
    document.getElementById('btn-draft').style.display = "none";
}
