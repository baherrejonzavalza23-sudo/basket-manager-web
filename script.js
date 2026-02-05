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

/* --- STATE --- */
let LEAGUE = {
    year: 2024,
    phase: 'regular',
    week: 1,
    teams: [],
    freeAgents: { coaches: [], scouts: [] },
    draftClass: []
};

let TRADE_STATE = {
    myAssets: new Set(),
    theirAssets: new Set()
};

/* --- INITIALIZATION --- */
window.onload = function() {
    initLeague();
    generateStaffMarket();
    updateUI();
};

function initLeague() {
    LEAGUE.teams = TEAM_NAMES.map((name, index) => ({
        id: index,
        name: name,
        wins: 0,
        losses: 0,
        strategy: 'Balanced', // Rebuilding, Contending, Balanced
        needs: [], // ["C", "PG"]
        coach: generateStaff('coach'),
        scout: generateStaff('scout'),
        roster: generateRoster(index)
    }));
    
    evaluateTeamStrategies();
}

function generateStaff(type) {
    const grades = ['C', 'C+', 'B', 'B+', 'A', 'A+'];
    let tier = Math.floor(Math.random() * 6);
    return {
        type: type,
        name: (type === 'coach' ? "Coach " : "Scout ") + Math.floor(Math.random()*1000),
        rating: tier, // 0-5
        grade: grades[tier],
        specialty: type === 'coach' ? (Math.random()>0.5 ? "Offense" : "Defense") : "Talent"
    };
}

function generateStaffMarket() {
    LEAGUE.freeAgents.coaches = [];
    LEAGUE.freeAgents.scouts = [];
    for(let i=0; i<5; i++) {
        LEAGUE.freeAgents.coaches.push(generateStaff('coach'));
        LEAGUE.freeAgents.scouts.push(generateStaff('scout'));
    }
}

function generateRoster(teamId) {
    let roster = [];
    // 13 Players
    for (let i = 0; i < 13; i++) {
        roster.push(createPlayer(POSITIONS[i % 5]));
    }
    // Add Picks
    roster.push({name: "1st Round Pick", pos: "PICK", age: 0, rating: 75, salary: 0, years: 0, isPick: true, id: Math.random()});
    return roster.sort((a, b) => b.rating - a.rating);
}

function createPlayer(pos, isRookie = false) {
    let age = isRookie ? 19 + Math.floor(Math.random()*4) : 20 + Math.floor(Math.random()*18);
    let rating = Math.floor(Math.random() * 40) + 60; // 60-99
    
    // Contract Logic
    let salary = Math.floor(Math.pow(rating - 55, 3) * 100) + 900000;
    if(salary < 900000) salary = 900000;
    let years = isRookie ? 4 : Math.floor(Math.random() * 4) + 1;

    return {
        id: Math.random(),
        name: "Player " + Math.floor(Math.random()*10000),
        pos: pos,
        age: age,
        rating: rating,
        potential: rating + Math.floor(Math.random()*10), // Hidden true potential
        salary: salary,
        years: years,
        isPick: false
    };
}

function evaluateTeamStrategies() {
    LEAGUE.teams.forEach(t => {
        let avgRating = getTeamRating(t);
        if(avgRating > 80) t.strategy = 'Contending';
        else if(avgRating < 72) t.strategy = 'Rebuilding';
        else t.strategy = 'Balanced';
        
        // Determine Positional Needs
        t.needs = [];
        POSITIONS.forEach(pos => {
            let count = t.roster.filter(p => p.pos === pos).length;
            if(count < 2) t.needs.push(pos);
        });
    });
}

/* --- NAVIGATION & UI --- */
function navigate(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    if (pageId === 'roster') renderRoster();
    if (pageId === 'trades') setupTradeView();
    if (pageId === 'staff') renderStaff();
    if (pageId === 'standings') renderStandings();
}

function updateUI() {
    const myTeam = LEAGUE.teams[USER_TEAM_ID];
    let totalSal = myTeam.roster.reduce((a,b)=>a+b.salary,0);
    
    document.getElementById('season-year').innerText = LEAGUE.year;
    document.getElementById('salary-cap').innerText = "Cap Space: $" + ((SALARY_CAP - totalSal)/1e6).toFixed(1) + "M";
    document.getElementById('team-strategy').innerText = myTeam.strategy;
}

/* --- TRADE SYSTEM --- */
function setupTradeView() {
    const teamSelect = document.getElementById('target-team-select');
    if (teamSelect.options.length === 0) {
        LEAGUE.teams.forEach(t => {
            if (t.id !== USER_TEAM_ID) teamSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
        });
    }
    TRADE_STATE.myAssets.clear();
    TRADE_STATE.theirAssets.clear();
    updateTradeLists();
}

function updateTradeTarget() {
    TRADE_STATE.theirAssets.clear();
    updateTradeLists();
}

function updateTradeLists() {
    const myTeam = LEAGUE.teams[USER_TEAM_ID];
    const targetId = document.getElementById('target-team-select').value;
    const targetTeam = LEAGUE.teams[targetId];

    document.getElementById('target-team-info').innerText = `${targetTeam.strategy} | Needs: ${targetTeam.needs.join(', ')}`;
    document.getElementById('target-team-info').className = `team-info-badge ${targetTeam.strategy.toLowerCase()}`;

    renderTradeColumn('my-trade-list', myTeam, TRADE_STATE.myAssets, true);
    renderTradeColumn('their-trade-list', targetTeam, TRADE_STATE.theirAssets, false);
}

function renderTradeColumn(elementId, team, selectionSet, isMyTeam) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";

    team.roster.forEach(p => {
        let isSelected = selectionSet.has(p.id);
        let card = document.createElement('div');
        card.className = `trade-card ${isSelected ? 'selected' : ''}`;
        card.onclick = () => {
            if(isSelected) selectionSet.delete(p.id);
            else selectionSet.add(p.id);
            updateTradeLists(); // Re-render to show selection
        };

        let details = p.isPick 
            ? `<div class="trade-detail">Future Asset</div>`
            : `<div class="trade-detail">Age: ${p.age} | ${p.years}yrs left</div>
               <div class="trade-detail">$${(p.salary/1e6).toFixed(1)}M / yr</div>`;

        card.innerHTML = `
            <div class="trade-card-header">
                <span class="pos-badge">${p.pos}</span>
                <span class="name">${p.name}</span>
                <span class="ovr">${p.isPick ? 'Pick' : p.rating}</span>
            </div>
            ${details}
        `;
        container.appendChild(card);
    });
}

function attemptTrade() {
    const targetId = document.getElementById('target-team-select').value;
    const targetTeam = LEAGUE.teams[targetId];
    const myTeam = LEAGUE.teams[USER_TEAM_ID];
    const msg = document.getElementById('trade-feedback');

    // 1. Get Assets
    let myOffer = myTeam.roster.filter(p => TRADE_STATE.myAssets.has(p.id));
    let theirOffer = targetTeam.roster.filter(p => TRADE_STATE.theirAssets.has(p.id));

    if(myOffer.length === 0 && theirOffer.length === 0) {
        msg.innerText = "Select players to trade.";
        return;
    }

    // 2. Cap Space Check
    let mySalaryOut = myOffer.reduce((a,b)=>a+b.salary,0);
    let theirSalaryIn = theirOffer.reduce((a,b)=>a+b.salary,0);
    
    // 3. Value Calculation with Strategy
    let myValue = calculatePackageValue(myOffer, targetTeam);
    let theirValue = calculatePackageValue(theirOffer, myTeam); // How they value their own players

    // AI Logic: They generally value their own assets slightly higher (endowment effect)
    let acceptanceThreshold = theirValue * 1.05; 

    if (myValue >= acceptanceThreshold) {
        // EXECUTE TRADE
        myTeam.roster = myTeam.roster.filter(p => !TRADE_STATE.myAssets.has(p.id));
        targetTeam.roster = targetTeam.roster.filter(p => !TRADE_STATE.theirAssets.has(p.id));
        
        myTeam.roster.push(...theirOffer);
        targetTeam.roster.push(...myOffer);
        
        msg.innerHTML = `<span style="color:#00e676">TRADE ACCEPTED!</span>`;
        setupTradeView();
        updateUI();
    } else {
        let diff = acceptanceThreshold - myValue;
        let advice = diff > 20 ? "Way off." : "Close. Add a pick or young player.";
        msg.innerHTML = `<span style="color:#ff5252">REJECTED. ${advice}</span>`;
    }
}

function calculatePackageValue(assets, evaluatingTeam) {
    let totalValue = 0;
    let strategy = evaluatingTeam.strategy;

    assets.forEach(p => {
        if(p.isPick) {
            // Rebuilders LOVE picks. Contenders like them less.
            let base = 75; 
            if(strategy === 'Rebuilding') base = 90;
            if(strategy === 'Contending') base = 60;
            totalValue += base;
        } else {
            let val = p.rating;
            
            // Age/Strategy Modifiers
            if(strategy === 'Rebuilding') {
                if(p.age < 24) val *= 1.3; // Love youth
                if(p.age > 29) val *= 0.7; // Hate old
            } else if (strategy === 'Contending') {
                if(p.rating > 80) val *= 1.2; // Love stars
                if(p.age < 22) val *= 0.9; // Can't wait for youth
            }
            
            // Positional Need Bonus
            if(evaluatingTeam.needs.includes(p.pos)) val += 5;
            
            // Contract Value (Simple: High rating low money = good)
            let valueToSalary = (p.rating * 100000) / p.salary;
            if(valueToSalary > 2) val += 5;

            totalValue += val;
        }
    });
    return totalValue;
}

/* --- STAFF SYSTEM --- */
function renderStaff() {
    const myTeam = LEAGUE.teams[USER_TEAM_ID];
    
    // My Staff
    document.getElementById('my-coach').innerHTML = renderStaffCard(myTeam.coach, false);
    document.getElementById('my-scout').innerHTML = renderStaffCard(myTeam.scout, false);
    
    // Market
    const cMarket = document.getElementById('coach-market');
    const sMarket = document.getElementById('scout-market');
    cMarket.innerHTML = ""; sMarket.innerHTML = "";
    
    LEAGUE.freeAgents.coaches.forEach((s, i) => cMarket.innerHTML += renderStaffCard(s, true, i, 'coach'));
    LEAGUE.freeAgents.scouts.forEach((s, i) => sMarket.innerHTML += renderStaffCard(s, true, i, 'scout'));
}

function renderStaffCard(staff, isFreeAgent, index, type) {
    let btn = isFreeAgent ? `<button class="sign-btn" onclick="hireStaff('${type}', ${index})">Hire</button>` : '';
    return `
    <div class="staff-card-inner">
        <div class="staff-grade">${staff.grade}</div>
        <div>
            <div class="staff-name">${staff.name}</div>
            <div class="staff-spec">${staff.specialty}</div>
        </div>
        ${btn}
    </div>`;
}

function hireStaff(type, index) {
    let myTeam = LEAGUE.teams[USER_TEAM_ID];
    let newStaff = type === 'coach' ? LEAGUE.freeAgents.coaches[index] : LEAGUE.freeAgents.scouts[index];
    
    if(type === 'coach') myTeam.coach = newStaff;
    else myTeam.scout = newStaff;
    
    // Refresh Market
    if(type === 'coach') LEAGUE.freeAgents.coaches.splice(index, 1);
    else LEAGUE.freeAgents.scouts.splice(index, 1);
    
    renderStaff();
}

/* --- GAME & DRAFT LOGIC --- */
function getTeamRating(team) {
    let players = team.roster.filter(p=>!p.isPick).sort((a,b) => b.rating - a.rating).slice(0, 8);
    let rawOvr = players.reduce((sum, p) => sum + p.rating, 0) / 8;
    
    // Coach Boost
    let boost = team.coach.rating; // 0 to 5
    return rawOvr + boost;
}

function simulateWeek() {
    // Basic Sim
    let indices = LEAGUE.teams.map(t => t.id).sort(() => Math.random() - 0.5);
    for (let i = 0; i < indices.length; i += 2) {
        let tA = LEAGUE.teams[indices[i]], tB = LEAGUE.teams[indices[i+1]];
        let sA = getTeamRating(tA) + (Math.random()*20), sB = getTeamRating(tB) + (Math.random()*20);
        if(sA > sB) { tA.wins++; tB.losses++; } else { tB.wins++; tA.losses++; }
    }
    LEAGUE.week++;
    updateUI();
    document.getElementById('next-opponent').innerText = "Week " + LEAGUE.week;
    
    // Check for Draft
    if(LEAGUE.week > 20) {
        document.getElementById('sim-btn').innerText = "Start Draft";
        document.getElementById('sim-btn').onclick = startDraftPhase;
    }
}

function startDraftPhase() {
    LEAGUE.phase = 'draft';
    navigate('draft');
    // Generate Draft Class
    LEAGUE.draftClass = [];
    for(let i=0; i<40; i++) LEAGUE.draftClass.push(createPlayer(POSITIONS[Math.floor(Math.random()*5)], true));
    renderDraft();
}

function renderDraft() {
    const list = document.getElementById('draft-list');
    list.innerHTML = "";
    
    let myScout = LEAGUE.teams[USER_TEAM_ID].scout;
    document.getElementById('scout-report-msg').innerText = `Scout Report (${myScout.grade}): Accuracy varies based on scout level.`;

    LEAGUE.draftClass.forEach((p, idx) => {
        // FOG OF WAR LOGIC
        // Bad scout (0) sees rating +/- 10. Good scout (5) sees exact.
        let errorMargin = (5 - myScout.rating) * 2; 
        let shownRating = p.rating + Math.floor(Math.random() * errorMargin * 2) - errorMargin;
        let shownPot = p.potential + Math.floor(Math.random() * errorMargin * 2) - errorMargin;
        
        list.innerHTML += `
            <div class="player-row">
                <span class="pos-badge">${p.pos}</span>
                <span class="player-name">${p.name} (Age ${p.age})</span>
                <div style="text-align:right">
                    <div style="font-size:0.8rem; color:#aaa;">Est Pot: ${shownPot}</div>
                    <div style="font-weight:bold;">Est Ovr: ${shownRating}</div>
                </div>
                <button class="sign-btn" onclick="draftPlayer(${idx})">Draft</button>
            </div>`;
    });
}
// (Draft function simplified for brevity - same logic as before but uses updated player objects)
function draftPlayer(idx) {
    let p = LEAGUE.draftClass[idx];
    LEAGUE.teams[USER_TEAM_ID].roster.push(p);
    alert(`Drafted ${p.name}. True Rating: ${p.rating}. True Potential: ${p.potential}`);
    LEAGUE.week = 1; LEAGUE.phase = 'regular';
    LEAGUE.teams.forEach(t => {t.wins=0; t.losses=0;}); // Reset
    navigate('roster');
    document.getElementById('sim-btn').innerText = "Simulate Week";
    document.getElementById('sim-btn').onclick = simulateWeek;
}

/* --- ROSTER RENDER --- */
function renderRoster() {
    const list = document.getElementById('roster-list');
    list.innerHTML = "";
    LEAGUE.teams[USER_TEAM_ID].roster.forEach(p => {
        if(!p.isPick) {
            list.innerHTML += `
            <div class="player-row">
                <span class="pos-badge">${p.pos}</span>
                <span class="player-name">${p.name}</span>
                <span style="color:#888">${p.age}yo</span>
                <span style="font-weight:bold; color:#fff">${p.rating}</span>
                <span style="font-size:0.8rem; color:#aaa">$${(p.salary/1e6).toFixed(1)}M (${p.years}yr)</span>
            </div>`;
        }
    });
}
function renderStandings() {
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = "";
    LEAGUE.teams.sort((a,b)=>b.wins-a.wins).forEach((t,i) => {
        tbody.innerHTML += `<tr><td>${i+1}</td><td>${t.name}</td><td>${t.wins}</td><td>${t.losses}</td><td>${t.strategy.substring(0,4)}</td></tr>`;
    });
}
