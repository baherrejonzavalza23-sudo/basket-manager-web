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
const REGULAR_SEASON_WEEKS = 20; // Shortened season for gameplay speed

/* --- STATE --- */
let LEAGUE = {
    year: 2024,
    phase: 'regular', // regular, playoffs, offseason, draft
    week: 1,
    teams: [],
    playoffMatches: [], // Stores current round matchups
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

function generateRoster(teamId) {
    let roster = [];
    for (let pos of POSITIONS) {
        for (let i = 0; i < 3; i++) {
            roster.push(createRandomPlayer(pos));
        }
    }
    return roster.sort((a, b) => b.rating - a.rating);
}

function createRandomPlayer(pos, isRookie = false) {
    const names = ["James", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Curry", "Doncic", "Jokic"];
    const first = ["Le", "De", "Ja", "Ma", "Ka", "Ty", "Ky", "Lu", "Ste", "Chris"];
    
    // Rookies are 19-22, Veterans 20-38
    let age = isRookie ? Math.floor(Math.random() * 4) + 19 : Math.floor(Math.random() * 18) + 20;
    
    // Rating calculation
    let base = isRookie ? 65 : 70;
    let rating = Math.floor(Math.random() * 30) + base; 
    if (rating > 99) rating = 99;

    // Salary based on rating
    let salary = Math.floor(Math.pow(rating - 55, 3) * 100) + 900000;
    if(salary < 900000) salary = 900000;

    return {
        name: first[Math.floor(Math.random()*first.length)] + ". " + names[Math.floor(Math.random()*names.length)],
        pos: pos,
        age: age,
        rating: rating,
        salary: salary
    };
}

/* --- NAVIGATION & UI --- */
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    
    if (pageId === 'roster') renderRoster();
    if (pageId === 'standings') renderStandings();
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    // Handle hidden buttons becoming active
    const activeBtn = document.querySelector(`button[onclick="navigate('${pageId}')"]`);
    if(activeBtn) activeBtn.classList.add('active');
}

function updateUI() {
    document.getElementById('season-year').innerText = "Year: " + LEAGUE.year;
    document.getElementById('league-phase').innerText = LEAGUE.phase.toUpperCase();
    
    // Update Play/Sim Info
    if (LEAGUE.phase === 'regular') {
        document.getElementById('next-opponent').innerText = "Week " + LEAGUE.week;
        document.getElementById('sim-info').innerText = "Regular Season Action";
        document.getElementById('sim-btn').innerText = "Simulate Week";
        document.getElementById('sim-btn').style.display = "block";
    } else if (LEAGUE.phase === 'playoffs') {
        document.getElementById('sim-btn').style.display = "none";
        document.getElementById('btn-playoffs').style.display = "inline-block";
    } else if (LEAGUE.phase === 'draft') {
        document.getElementById('sim-btn').style.display = "none";
        document.getElementById('btn-draft').style.display = "inline-block";
    }
}

function renderRoster() {
    const list = document.getElementById('roster-list');
    list.innerHTML = "";
    
    const myTeam = LEAGUE.teams[USER_TEAM_ID];
    let totalSal = myTeam.roster.reduce((a,b)=>a+b.salary,0);
    document.getElementById('salary-cap').innerText = "Cap: $" + ((SALARY_CAP - totalSal)/1e6).toFixed(1) + "M";
    document.getElementById('roster-count').innerText = `${myTeam.roster.length}/15 Players`;

    myTeam.roster.forEach(p => {
        list.innerHTML += `
            <div class="player-row">
                <span class="pos-badge">${p.pos}</span>
                <span class="player-name">${p.name}</span>
                <span class="player-age">${p.age}yo</span>
                <span class="player-rating ${p.rating > 89 ? 'elite' : ''}">${p.rating}</span>
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

/* --- GAME LOGIC --- */
function getTeamRating(team) {
    let top8 = team.roster.sort((a,b) => b.rating - a.rating).slice(0, 8);
    return top8.reduce((sum, p) => sum + p.rating, 0) / 8;
}

function simulateWeek() {
    if (LEAGUE.week > REGULAR_SEASON_WEEKS) {
        startPlayoffs();
        return;
    }

    let indices = LEAGUE.teams.map(t => t.id).sort(() => Math.random() - 0.5);
    for (let i = 0; i < indices.length; i += 2) {
        simulateGame(LEAGUE.teams[indices[i]], LEAGUE.teams[indices[i+1]]);
    }
    
    logNews(`Week ${LEAGUE.week} completed.`);
    LEAGUE.week++;
    updateUI();
    
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

function logNews(msg, type="neutral") {
    const feed = document.getElementById('news-feed');
    feed.innerHTML = `<div class="news-item ${type}">${msg}</div>` + feed.innerHTML;
}

/* --- PLAYOFFS --- */
function startPlayoffs() {
    LEAGUE.phase = 'playoffs';
    navigate('playoffs');
    
    // Sort top 16 teams
    let sorted = [...LEAGUE.teams].sort((a,b) => b.wins - a.wins).slice(0, 16);
    
    // Create Round 1 Matchups (1 vs 16, 2 vs 15...)
    LEAGUE.playoffMatches = [];
    for(let i=0; i<8; i++) {
        LEAGUE.playoffMatches.push({
            team1: sorted[i],
            team2: sorted[15-i]
        });
    }
    renderBracket();
    updateUI();
}

function renderBracket() {
    const container = document.getElementById('bracket-display');
    container.innerHTML = "<h3>Current Round Matchups</h3>";
    
    if(LEAGUE.playoffMatches.length === 1 && LEAGUE.playoffMatches[0].winner) {
         container.innerHTML = `<div class="champ-banner">🏆 CHAMPION: ${LEAGUE.playoffMatches[0].winner.name} 🏆</div>`;
         document.getElementById('sim-playoff-btn').innerText = "Start Offseason";
         document.getElementById('sim-playoff-btn').onclick = startOffseason;
         return;
    }

    LEAGUE.playoffMatches.forEach(m => {
        container.innerHTML += `
            <div class="matchup-box">
                <div class="${m.team1.id===USER_TEAM_ID?'user-text':''}">${m.team1.name} (${m.team1.wins})</div>
                <div class="vs">VS</div>
                <div class="${m.team2.id===USER_TEAM_ID?'user-text':''}">${m.team2.name} (${m.team2.wins})</div>
            </div>`;
    });
}

function simPlayoffRound() {
    let nextRound = [];
    let winners = [];
    
    LEAGUE.playoffMatches.forEach(m => {
        let score1 = getTeamRating(m.team1) + Math.random()*15;
        let score2 = getTeamRating(m.team2) + Math.random()*15;
        let winner = score1 > score2 ? m.team1 : m.team2;
        
        logNews(`${winner.name} eliminates ${score1>score2 ? m.team2.name : m.team1.name}`, "playoff");
        winners.push(winner);
    });

    if (winners.length === 1) {
        LEAGUE.playoffMatches = [{winner: winners[0]}]; // Mark champion
        renderBracket();
    } else {
        // Pair up next round
        for(let i=0; i<winners.length; i+=2) {
            nextRound.push({ team1: winners[i], team2: winners[i+1] });
        }
        LEAGUE.playoffMatches = nextRound;
        renderBracket();
    }
}

/* --- OFFSEASON & DRAFT --- */
function startOffseason() {
    LEAGUE.phase = 'draft';
    navigate('draft');
    
    // Generate Draft Class
    LEAGUE.draftClass = [];
    for(let i=0; i<60; i++) {
        LEAGUE.draftClass.push(createRandomPlayer(POSITIONS[Math.floor(Math.random()*5)], true));
    }
    
    // Draft Order: Reverse Standings
    LEAGUE.draftOrder = [...LEAGUE.teams].sort((a,b) => a.wins - b.wins);
    
    renderDraft();
    updateUI();
}

function renderDraft() {
    const list = document.getElementById('draft-list');
    list.innerHTML = "";
    
    // Find User Pick Index
    let userPickIndex = LEAGUE.draftOrder.findIndex(t => t.id === USER_TEAM_ID);
    document.getElementById('draft-pick-info').innerText = `You pick at #${userPickIndex + 1}`;

    LEAGUE.draftClass.forEach((p, idx) => {
        list.innerHTML += `
            <div class="player-row">
                <span class="pos-badge">${p.pos}</span>
                <span class="player-name">${p.name}</span>
                <span class="player-rating" style="color:#aaa;">Pot: ${p.rating + Math.floor(Math.random()*10)}</span>
                <span class="player-rating">${p.rating}</span>
                <button class="sign-btn" onclick="draftPlayer(${idx})">Draft</button>
            </div>`;
    });
}

function draftPlayer(playerIdx) {
    let userPickIndex = LEAGUE.draftOrder.findIndex(t => t.id === USER_TEAM_ID);
    
    // Sim picks before user
    for(let i=0; i<userPickIndex; i++) {
        let team = LEAGUE.draftOrder[i];
        let pick = LEAGUE.draftClass.shift(); // Remove top player
        team.roster.push(pick
