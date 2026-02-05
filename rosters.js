const REAL_ROSTERS = [
    {
        name: "Atlanta Hawks", abbr: "ATL", color: "#E03A3E",
        players: ["Trae Young", "Dejounte Murray", "Bogdan Bogdanovic", "Jalen Johnson", "Clint Capela", "De'Andre Hunter", "Onyeka Okongwu", "Saddiq Bey", "Garrison Mathews", "Bruno Fernando", "Kobe Bufkin", "AJ Griffin", "Trent Forrest", "Wesley Matthews", "Mouhamed Gueye"]
    },
    {
        name: "Boston Celtics", abbr: "BOS", color: "#007A33",
        players: ["Jayson Tatum", "Jaylen Brown", "Kristaps Porzingis", "Derrick White", "Jrue Holiday", "Al Horford", "Payton Pritchard", "Sam Hauser", "Luke Kornet", "Xavier Tillman", "Jaden Springer", "Oshae Brissett", "Svi Mykhailiuk", "Neemias Queta", "Jordan Walsh"]
    },
    {
        name: "Brooklyn Nets", abbr: "BKN", color: "#000000",
        players: ["Mikal Bridges", "Cam Thomas", "Nic Claxton", "Cameron Johnson", "Dennis Schroder", "Ben Simmons", "Dorian Finney-Smith", "Day'Ron Sharpe", "Lonnie Walker IV", "Trendon Watford", "Dennis Smith Jr.", "Noah Clowney", "Jalen Wilson", "Keita Bates-Diop", "Dariq Whitehead"]
    },
    {
        name: "Charlotte Hornets", abbr: "CHA", color: "#1D1160",
        players: ["LaMelo Ball", "Brandon Miller", "Miles Bridges", "Mark Williams", "Grant Williams", "Tre Mann", "Nick Richards", "Vasilije Micic", "Cody Martin", "Seth Curry", "Davis Bertans", "Aleksej Pokusevski", "Nick Smith Jr.", "JT Thor", "Bryce McGowens"]
    },
    {
        name: "Chicago Bulls", abbr: "CHI", color: "#CE1141",
        players: ["DeMar DeRozan", "Zach LaVine", "Nikola Vucevic", "Coby White", "Alex Caruso", "Ayo Dosunmu", "Patrick Williams", "Andre Drummond", "Torrey Craig", "Jevon Carter", "Dalen Terry", "Julian Phillips", "Onuralp Bitim", "Adama Sanogo", "Terry Taylor"]
    },
    {
        name: "Cleveland Cavaliers", abbr: "CLE", color: "#860038",
        players: ["Donovan Mitchell", "Darius Garland", "Evan Mobley", "Jarrett Allen", "Max Strus", "Caris LeVert", "Isaac Okoro", "Georges Niang", "Dean Wade", "Sam Merrill", "Tristan Thompson", "Marcus Morris Sr.", "Craig Porter Jr.", "Damian Jones", "Emoni Bates"]
    },
    {
        name: "Dallas Mavericks", abbr: "DAL", color: "#00538C",
        players: ["Luka Doncic", "Kyrie Irving", "P.J. Washington", "Daniel Gafford", "Dereck Lively II", "Tim Hardaway Jr.", "Derrick Jones Jr.", "Josh Green", "Maxi Kleber", "Dante Exum", "Jaden Hardy", "Dwight Powell", "Markieff Morris", "A.J. Lawson", "Olivier-Maxence Prosper"]
    },
    {
        name: "Denver Nuggets", abbr: "DEN", color: "#0E2240",
        players: ["Nikola Jokic", "Jamal Murray", "Aaron Gordon", "Michael Porter Jr.", "Kentavious Caldwell-Pope", "Reggie Jackson", "Christian Braun", "Peyton Watson", "DeAndre Jordan", "Justin Holiday", "Zeke Nnaji", "Julian Strawther", "Vlatko Cancar", "Jalen Pickett", "Hunter Tyson"]
    },
    {
        name: "Detroit Pistons", abbr: "DET", color: "#C8102E",
        players: ["Cade Cunningham", "Jalen Duren", "Jaden Ivey", "Ausar Thompson", "Isaiah Stewart", "Simone Fontecchio", "Quentin Grimes", "Marcus Sasser", "Evan Fournier", "Troy Brown Jr.", "Malachi Flynn", "James Wiseman", "Chimezie Metu", "Shake Milton", "Taj Gibson"]
    },
    {
        name: "Golden State Warriors", abbr: "GSW", color: "#1D428A",
        players: ["Stephen Curry", "Klay Thompson", "Draymond Green", "Andrew Wiggins", "Jonathan Kuminga", "Chris Paul", "Brandin Podziemski", "Trayce Jackson-Davis", "Kevon Looney", "Gary Payton II", "Moses Moody", "Dario Saric", "Lester Quinones", "Gui Santos", "Usman Garuba"]
    },
    {
        name: "Houston Rockets", abbr: "HOU", color: "#CE1141",
        players: ["Alperen Sengun", "Jalen Green", "Fred VanVleet", "Jabari Smith Jr.", "Dillon Brooks", "Amen Thompson", "Cam Whitmore", "Tari Eason", "Jeff Green", "Jock Landale", "Aaron Holiday", "Jae'Sean Tate", "Reggie Bullock", "Boban Marjanovic", "Nate Hinton"]
    },
    {
        name: "Indiana Pacers", abbr: "IND", color: "#002D62",
        players: ["Tyrese Haliburton", "Pascal Siakam", "Myles Turner", "Aaron Nesmith", "Andrew Nembhard", "Bennedict Mathurin", "Obi Toppin", "T.J. McConnell", "Jalen Smith", "Isaiah Jackson", "Ben Sheppard", "Jarace Walker", "Doug McDermott", "Kendall Brown", "James Johnson"]
    },
    {
        name: "LA Clippers", abbr: "LAC", color: "#C8102E",
        players: ["Kawhi Leonard", "Paul George", "James Harden", "Ivica Zubac", "Terance Mann", "Russell Westbrook", "Norman Powell", "Mason Plumlee", "Daniel Theis", "Amir Coffey", "P.J. Tucker", "Bones Hyland", "Brandon Boston Jr.", "Kobe Brown", "Moussa Diabate"]
    },
    {
        name: "LA Lakers", abbr: "LAL", color: "#552583",
        players: ["LeBron James", "Anthony Davis", "D'Angelo Russell", "Austin Reaves", "Rui Hachimura", "Jarred Vanderbilt", "Taurean Prince", "Spencer Dinwiddie", "Gabe Vincent", "Christian Wood", "Jaxson Hayes", "Cam Reddish", "Max Christie", "Jalen Hood-Schifino", "Maxwell Lewis"]
    },
    {
        name: "Memphis Grizzlies", abbr: "MEM", color: "#5D76A9",
        players: ["Ja Morant", "Jaren Jackson Jr.", "Desmond Bane", "Marcus Smart", "Vince Williams Jr.", "GG Jackson", "Santi Aldama", "Luke Kennard", "Brandon Clarke", "Derrick Rose", "Ziaire Williams", "John Konchar", "Lamar Stevens", "Jake LaRavia", "Yuta Watanabe"]
    },
    {
        name: "Miami Heat", abbr: "MIA", color: "#98002E",
        players: ["Jimmy Butler", "Bam Adebayo", "Tyler Herro", "Terry Rozier", "Jaime Jaquez Jr.", "Duncan Robinson", "Caleb Martin", "Nikola Jovic", "Kevin Love", "Haywood Highsmith", "Josh Richardson", "Delon Wright", "Thomas Bryant", "Patty Mills", "Orlando Robinson"]
    },
    {
        name: "Milwaukee Bucks", abbr: "MIL", color: "#00471B",
        players: ["Giannis Antetokounmpo", "Damian Lillard", "Khris Middleton", "Brook Lopez", "Malik Beasley", "Bobby Portis", "Patrick Beverley", "Jae Crowder", "Pat Connaughton", "AJ Green", "MarJon Beauchamp", "Thanasis Antetokounmpo", "Danilo Gallinari", "Andre Jackson Jr.", "Chris Livingston"]
    },
    {
        name: "Minnesota Timberwolves", abbr: "MIN", color: "#0C2340",
        players: ["Anthony Edwards", "Karl-Anthony Towns", "Rudy Gobert", "Mike Conley", "Jaden McDaniels", "Naz Reid", "Nickeil Alexander-Walker", "Kyle Anderson", "Monte Morris", "Jordan McLaughlin", "Luka Garza", "Josh Minott", "Wendell Moore Jr.", "Leonard Miller", "T.J. Warren"]
    },
    {
        name: "New Orleans Pelicans", abbr: "NOP", color: "#0C2340",
        players: ["Zion Williamson", "Brandon Ingram", "CJ McCollum", "Jonas Valanciunas", "Herb Jones", "Trey Murphy III", "Larry Nance Jr.", "Jose Alvarado", "Naji Marshall", "Dyson Daniels", "Jordan Hawkins", "Matt Ryan", "Jeremiah Robinson-Earl", "Cody Zeller", "E.J. Liddell"]
    },
    {
        name: "New York Knicks", abbr: "NYK", color: "#006BB6",
        players: ["Jalen Brunson", "Julius Randle", "OG Anunoby", "Josh Hart", "Isaiah Hartenstein", "Donte DiVincenzo", "Mitchell Robinson", "Bojan Bogdanovic", "Precious Achiuwa", "Alec Burks", "Miles McBride", "Jericho Sims", "Shake Milton", "Mamadi Diakite", "DaQuan Jeffries"]
    },
    {
        name: "Oklahoma City Thunder", abbr: "OKC", color: "#007AC1",
        players: ["Shai Gilgeous-Alexander", "Chet Holmgren", "Jalen Williams", "Josh Giddey", "Lu Dort", "Isaiah Joe", "Cason Wallace", "Gordon Hayward", "Aaron Wiggins", "Jaylin Williams", "Kenrich Williams", "Ousmane Dieng", "Bismack Biyombo", "Mike Muscala", "Lindy Waters III"]
    },
    {
        name: "Orlando Magic", abbr: "ORL", color: "#0077C0",
        players: ["Paolo Banchero", "Franz Wagner", "Jalen Suggs", "Wendell Carter Jr.", "Markelle Fultz", "Cole Anthony", "Moritz Wagner", "Jonathan Isaac", "Gary Harris", "Joe Ingles", "Goga Bitadze", "Anthony Black", "Caleb Houstan", "Chuma Okeke", "Admiral Schofield"]
    },
    {
        name: "Philadelphia 76ers", abbr: "PHI", color: "#006BB6",
        players: ["Joel Embiid", "Tyrese Maxey", "Tobias Harris", "Kelly Oubre Jr.", "Kyle Lowry", "Buddy Hield", "Nicolas Batum", "De'Anthony Melton", "Paul Reed", "Cameron Payne", "Robert Covington", "Mo Bamba", "KJ Martin", "Ricky Council IV", "Jeff Dowtin"]
    },
    {
        name: "Phoenix Suns", abbr: "PHX", color: "#1D1160",
        players: ["Kevin Durant", "Devin Booker", "Bradley Beal", "Jusuf Nurkic", "Grayson Allen", "Eric Gordon", "Royce O'Neale", "Drew Eubanks", "Bol Bol", "Josh Okogie", "Nassir Little", "Damion Lee", "Thaddeus Young", "Isaiah Thomas", "David Roddy"]
    },
    {
        name: "Portland Trail Blazers", abbr: "POR", color: "#E03A3E",
        players: ["Anfernee Simons", "Jerami Grant", "Deandre Ayton", "Scoot Henderson", "Shaedon Sharpe", "Malcolm Brogdon", "Toumani Camara", "Jabari Walker", "Duop Reath", "Matisse Thybulle", "Dalano Banton", "Kris Murray", "Rayan Rupert", "Moses Brown", "Ashton Hagans"]
    },
    {
        name: "Sacramento Kings", abbr: "SAC", color: "#5A2D81",
        players: ["De'Aaron Fox", "Domantas Sabonis", "Keegan Murray", "Malik Monk", "Harrison Barnes", "Kevin Huerter", "Trey Lyles", "Davion Mitchell", "Keon Ellis", "Alex Len", "Chris Duarte", "Sasha Vezenkov", "JaVale McGee", "Kessler Edwards", "Mason Jones"]
    },
    {
        name: "San Antonio Spurs", abbr: "SAS", color: "#C4CED4",
        players: ["Victor Wembanyama", "Devin Vassell", "Jeremy Sochan", "Tre Jones", "Keldon Johnson", "Zach Collins", "Julian Champagnie", "Malaki Branham", "Cedi Osman", "Blake Wesley", "Sandro Mamukelashvili", "Dominick Barlow", "Devonte' Graham", "Charles Bassey", "Sidy Cissoko"]
    },
    {
        name: "Toronto Raptors", abbr: "TOR", color: "#CE1141",
        players: ["Scottie Barnes", "RJ Barrett", "Immanuel Quickley", "Jakob Poeltl", "Gary Trent Jr.", "Kelly Olynyk", "Bruce Brown", "Gradey Dick", "Ochai Agbaji", "Jordan Nwora", "Chris Boucher", "Jalen McDaniels", "Garrett Temple", "Mouhamadou Gueye", "Javon Freeman-Liberty"]
    },
    {
        name: "Utah Jazz", abbr: "UTA", color: "#002B5C",
        players: ["Lauri Markkanen", "Collin Sexton", "John Collins", "Jordan Clarkson", "Walker Kessler", "Keyonte George", "Taylor Hendricks", "Brice Sensabaugh", "Kris Dunn", "Talen Horton-Tucker", "Luka Samanic", "Omer Yurtseven", "Kenneth Lofton Jr.", "Jason Preston", "Darius Bazley"]
    },
    {
        name: "Washington Wizards", abbr: "WAS", color: "#002B5C",
        players: ["Kyle Kuzma", "Jordan Poole", "Tyus Jones", "Deni Avdija", "Corey Kispert", "Bilal Coulibaly", "Marvin Bagley III", "Richaun Holmes", "Landry Shamet", "Anthony Gill", "Johnny Davis", "Patrick Baldwin Jr.", "Eugene Omoruyi", "Jared Butler", "Tristan Vukcevic"]
    }
];

const REAL_FREE_AGENTS = [
    "John Wall", "Blake Griffin", "DeMarcus Cousins", "Dwight Howard", "Carmelo Anthony", 
    "Kemba Walker", "Victor Oladipo", "T.J. Warren", "Austin Rivers", "Ish Smith",
    "Goran Dragic", "Will Barton", "Danny Green", "George Hill", "Hamidou Diallo",
    "Nerlens Noel", "Dewayne Dedmon", "Bismack Biyombo", "Justise Winslow", "Romeo Langford"
];

const REAL_COACHES = [
    "Joe Mazzulla", "Tom Thibodeau", "Michael Malone", "Mark Daigneault", "Chris Finch",
    "Tyronn Lue", "Rick Carlisle", "Erik Spoelstra", "Nick Nurse", "Steve Kerr",
    "Gregg Popovich", "Mike Brown", "Willie Green", "Quin Snyder", "Taylor Jenkins",
    "Jamahl Mosley", "Ime Udoka", "Will Hardy", "Chauncey Billups", "Steve Clifford",
    "Darko Rajakovic", "Wes Unseld Jr.", "Billy Donovan", "Monty Williams", "J.B. Bickerstaff",
    "Jason Kidd", "Darvin Ham", "Frank Vogel", "Jacque Vaughn", "Brian Keefe"
];

const REAL_SCOUTS = [
    "Jerry West", "Danny Ainge", "Pat Riley", "Masai Ujiri", "Daryl Morey",
    "Sam Presti", "Bob Myers", "Tim Connelly", "Lawrence Frank", "Brad Stevens"
];
