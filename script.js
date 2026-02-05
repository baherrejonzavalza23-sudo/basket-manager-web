/* --- DATA --- */
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
const SEASON_DAYS = 82;

/* --- STATE --- */
let GAME = {
    userTeamId: null,
    day: 1,
    year: 2024,
    phase: 'regular',
    teams: [],
    schedule: [],
    news: []
};

/* --- MENU LOGIC --- */
window.onload = function() {
    initMainMenu();
};

function initMainMenu() {
    const select = document.getElementById('team-select-dropdown');
    select.innerHTML = "";
    TEAMS_DATA.forEach((t, i) => {
        select.innerHTML += `<option value="${i}">${t.name}</option>`;
    });

    // Load Slots
    for(let i=1; i<=3; i++) {
        let save = localStorage.getItem('bm_save_' + i);
        let el = document.getElementById(`slot-${i}-info`);
        let card = document.getElementById(`slot-${i}-card`);
        
        if(save) {
            let data = JSON.parse(save);
            let tName = data.teams[data.userTeamId].name;
            el.innerHTML = `<span style="color:#00e676">${tName}</span><br>Year ${data.year} - Day ${data.day}`;
            card.classList.add('filled');
        } else {
            el.innerText = "NO SAVE DATA";
            card.classList.remove('filled');
        }
    }
    
    updateTeamPreview();
}

function updateTeamPreview() {
    const idx = document.getElementById('team-select-dropdown').value;
    const data = TEAMS_DATA[idx];
    
    document.getElementById('preview-name').innerText = data.name;
    document.getElementById('preview-stars').innerText = data.stars.join(", ");
    
    // Simulate Ratings for Preview (Since actual roster isn't gen'd yet)
    // We calculate based on position in array (assuming top teams are top) or random variance for demo
    // Ideally we'd gen roster temp, but for UI speed we approximate:
    let baseOvr = 90 - (idx % 10); // Pseudo rating
    if (["LAL", "BOS", "DEN", "MIL"].includes(data.abbr)) baseOvr = 95;
    
    document.getElementById('preview-ovr').innerText = baseOvr;
    document.getElementById('preview-ovr').style.backgroundColor = data.color;
    document.getElementById('preview-header').style.borderLeft = `5px solid ${data.color}`;
    
    document.getElementById('bar-off').style.width = `${baseOvr}%`;
    document.getElementById('bar-off').style.backgroundColor = data.color;
    document.getElementById('bar-def').style.width = `${baseOvr - 5}%`;
}

function startNewGame() {
    const select = document.getElementById('team-select-dropdown');
    GAME.userTeamId = parseInt(select.value);
    GAME.day = 1;
    GAME.year = 2024;
    GAME.teams = generateTeams();
    GAME.schedule = generateSchedule();
    GAME.news = [`Welcome GM! The ${GAME.year} season begins.`];
    
    enterGame();
}

function loadSave(slot) {
    let save = localStorage.getItem('bm_save_' + slot);
    if(save) {
        GAME = JSON.parse(save);
        enterGame();
    } else {
        alert("This slot is empty. Start a new career.");
    }
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
    alert("Progress saved to Slot 1");
}

/* --- GAME LOGIC --- */
function generateTeams() {
    return TEAMS_DATA.map((data, index) => ({
        id: index,
        name: data.name,
        abbr: data.abbr,
        color: data.color,
        wins: 0, losses: 0,
        roster: generateRoster(data.stars)
    }));
}

function generateRoster(stars) {
    let roster = [];
    // Add Stars
    stars.forEach(name => roster.push(createPlayer(name, true)));
    // Add Role Players
    while(roster.length < 13) roster.push(createPlayer(null, false));
    
    // Assign Pos & Minutes
    roster.forEach((p, i) => {
        p.pos = p.pos || POSITIONS[i%5];
        p.minutes = i < 5 ? 34 : (i < 9 ? 16 : 0);
        if(i >= 9) p.minutes = 0; // Reserves
    });
    return roster.sort((a,b) => b.rating - a.rating);
}

function createPlayer(name, isStar) {
    let rating = isStar ? 88 + Math.floor(Math.random()*11) : 72 + Math.floor(Math.random()*8);
    if(!isStar && Math.random() > 0.8) rating -= 10;
    
    return {
        id: Math.random().toString(36).substr(2,9),
        name: name || `Player ${Math.floor(Math.random()*1000)}`,
        rating: rating,
        stamina: 85 + Math.floor(Math.random()*15),
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
    if(GAME.day > SEASON_DAYS) { alert("Season Over! Check Standings."); return; }
    
    let todaysGames = GAME.schedule[GAME.day-1];
    todaysGames.forEach(g => playGame(GAME.teams[g.t1], GAME.teams[g.t2]));
    
    // Recovery
    GAME.teams.forEach(t => t.roster.forEach(p => p.fatigue = Math.max(0, p.fatigue - 15)));
    
    GAME.day++;
    updateUI();
}

function simWeek() {
    for(let i=0; i<7; i++) {
        if(GAME.day > SEASON_DAYS) break;
        simDay();
    }
}

function playGame(t1, t2) {
    let s1 = getTeamStrength(t1);
    let s2 = getTeamStrength(t2) + 5; // Home court
    
    if(s1 + Math.random()*20 > s2 + Math.random()*20) { t1.wins++; t2.losses++; }
    else { t2.wins++; t1.losses++; }
    
    // Fatigue
    [t1,t2].forEach(t => t.roster.forEach(p => p.fatigue = Math.min(100, p.fatigue + (p.minutes*0.5))));
    
    // Log
    if(t1.id === GAME.userTeamId || t2.id === GAME.userTeamId) {
        let userWon = (t1.id === GAME.userTeamId && s1>s2) || (t2.id === GAME.userTeamId && s2>s1);
        let opp = t1.id === GAME.userTeamId ? t2.name : t1.name;
        GAME.news.unshift(`Day ${GAME.day}: ${userWon ? "WIN" : "LOSS"} vs ${opp}`);
    }
}

function getTeamStrength(t) {
    let str = 0;
    t.roster.forEach(p => {
        let impact = p.rating - (p.fatigue > 50 ? (p.fatigue-50)*0.5 : 0);
        str += impact * (p.minutes/48);
    });
    return str * 2;
}

/* --- UI --- */
function navigate(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
    document.getElementById(page).classList.add('active-page');
    updateUI();
}

function updateUI() {
    const user = GAME.teams[GAME.userTeamId];
    
    // Header
    document.getElementById('team-record').innerText = `${user.wins}-${user.losses}`;
    document.getElementById('date-display').innerText = `DAY ${GAME.day}`;
    document.getElementById('roster-ovr-display').innerText = `TEAM OVR: ${Math.floor(getTeamStrength(user)/2.5)}`; // approx

    // Logos/Colors
    document.getElementById('my-team-logo').innerText = user.abbr;
    document.getElementById('my-team-logo').style.backgroundColor = user.color;
    
    // Next Opponent
    if(GAME.day <= SEASON_DAYS) {
        let next = GAME.schedule[GAME.day-1].find(g => g.t1===user.id || g.t2===user.id);
        let opp = GAME.teams[next.t1===user.id ? next.t2 : next.t1];
        document.getElementById('opp-team-logo').innerText = opp.abbr;
        document.getElementById('opp-team-logo').style.backgroundColor = opp.color;
        document.getElementById('next-opponent-name').innerText = opp.name;
    } else {
        document.getElementById('next-opponent-name').innerText = "SEASON OVER";
    }

    // Roster
    document.getElementById('roster-list').innerHTML = user.roster.map(p => `
        <div class="player-row">
            <span class="pos-badge">${p.pos}</span>
            <span class="player-name">${p.name}</span>
            <span class="stat-box">${p.rating}</span>
            <span class="stat-box" style="color:${p.fatigue>50?'red':'#888'}">${Math.floor(p.fatigue)}%</span>
        </div>
    `).join('');

    // Rotation
    let totalMin = 0;
    document.getElementById('rotation-list').innerHTML = user.roster.map(p => {
        totalMin += parseInt(p.minutes);
        return `
        <div class="rotation-row">
            <div class="rot-info">
                <strong>${p.name}</strong>
                <small>Stamina: ${p.stamina}</small>
            </div>
            <div class="rot-slider-container">
                <input type="range" min="0" max="48" value="${p.minutes}" oninput="updateMinutes('${p.id}', this.value)">
                <span class="min-badge">${p.minutes}m</span>
            </div>
        </div>`;
    }).join('');
    
    let minDisp = document.getElementById('total-minutes');
    minDisp.innerText = `${totalMin} / 240`;
    minDisp.style.color = totalMin > 240 ? '#ff5252' : '#00e676';

    // Standings
    let sorted = [...GAME.teams].sort((a,b)=>b.wins-a.wins);
    document.getElementById('standings-body').innerHTML = sorted.map((t,i) => `
        <tr class="${t.id===user.id?'highlight':''}">
            <td>${i+1}</td>
            <td>${t.abbr}</td>
            <td>${t.wins}</td>
            <td>${t.losses}</td>
            <td>${t.wins-t.losses}</td>
        </tr>
    `).join('');
    
    // News
    document.getElementById('news-feed').innerHTML = GAME.news.slice(0,6).map(n => `<div class="news-item">${n}</div>`).join('');
}

function updateMinutes(pid, val) {
    let p = GAME.teams[GAME.userTeamId].roster.find(x => x.id === pid);
    if(p) p.minutes = parseInt(val);
    updateUI();
}
