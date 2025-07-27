// src/utils/data.js
// Data fetching and configuration

export const players = [
    { label: 'Cal Raleigh 2025',     id: 663728, season: 2025, teamId: 136 },
    { label: 'Barry Bonds 2001',    id: 111188, season: 2001, teamId: 137 },
    { label: 'Sammy Sosa 1998',     id: 122544, season: 1998, teamId: 112 },
    { label: 'Mark McGwire 1998',   id: 118743, season: 1998, teamId: 138 },
    { label: 'Aaron Judge 2022',    id: 592450, season: 2022, teamId: 147 },
    { label: 'Salvador Perez 2021', id: 521692, season: 2021, teamId: 118 },
    { label: 'Ken Griffey Jr. 1997',id: 115135, season: 1997, teamId: 136 }
  ];
  
  export const salaries = {
    'Cal Raleigh 2025':     2666666,
    'Cal Raleigh 2026':    12666666,
    'Cal Raleigh 2027':    13666666,
    'Cal Raleigh 2028':    24666666,
    'Cal Raleigh 2029':    24666666,
    'Cal Raleigh 2030':    24666668,
    'Cal Raleigh 2031':    20000000,
    'Aaron Judge 2022':    19000000,
    'Salvador Perez 2021': 14200000,
    'Barry Bonds 2001':    11450000 * 1.74,
    'Sammy Sosa 1998':      8750000 * 1.85,
    'Mark McGwire 1998':    8900000 * 1.85,
    'Ken Griffey Jr. 1997': 8500000 * 2.0,
  };
  
  export const spotracLinks = {
  'Cal Raleigh 2025':     'https://www.baseball-reference.com/players/r/raleica01.shtml#all_br-salaries',
  'Barry Bonds 2001':    'https://www.baseball-reference.com/players/b/bondsba01.shtml#all_br-salaries',
  'Sammy Sosa 1998':     'https://www.baseball-reference.com/players/s/sosasa01.shtml#all_br-salaries',
  'Mark McGwire 1998':   'https://www.baseball-reference.com/players/m/mcgwima01.shtml#all_br-salaries',
  'Aaron Judge 2022':    'https://www.baseball-reference.com/players/j/judgeaa01.shtml#all_br-salaries',
  'Salvador Perez 2021': 'https://www.baseball-reference.com/players/p/perezsa02.shtml#all_br-salaries',
  'Ken Griffey Jr. 1997':'https://www.baseball-reference.com/players/g/griffke02.shtml#all_br-salaries'
};

// MLB Teams data
export const mlbTeams = [
  { id: 136, name: 'Seattle Mariners', abbreviation: 'SEA' },
  { id: 111, name: 'Boston Red Sox', abbreviation: 'BOS' },
  { id: 139, name: 'Tampa Bay Rays', abbreviation: 'TB' },
  { id: 141, name: 'Toronto Blue Jays', abbreviation: 'TOR' },
  { id: 147, name: 'New York Yankees', abbreviation: 'NYY' },
  { id: 110, name: 'Baltimore Orioles', abbreviation: 'BAL' },
  { id: 145, name: 'Chicago White Sox', abbreviation: 'CWS' },
  { id: 114, name: 'Cleveland Guardians', abbreviation: 'CLE' },
  { id: 116, name: 'Detroit Tigers', abbreviation: 'DET' },
  { id: 118, name: 'Kansas City Royals', abbreviation: 'KC' },
  { id: 142, name: 'Minnesota Twins', abbreviation: 'MIN' },
  { id: 117, name: 'Houston Astros', abbreviation: 'HOU' },
  { id: 108, name: 'Los Angeles Angels', abbreviation: 'LAA' },
  { id: 133, name: 'Oakland Athletics', abbreviation: 'OAK' },
  { id: 140, name: 'Texas Rangers', abbreviation: 'TEX' },
  { id: 121, name: 'New York Mets', abbreviation: 'NYM' },
  { id: 120, name: 'Atlanta Braves', abbreviation: 'ATL' },
  { id: 146, name: 'Miami Marlins', abbreviation: 'MIA' },
  { id: 112, name: 'Chicago Cubs', abbreviation: 'CHC' },
  { id: 113, name: 'Cincinnati Reds', abbreviation: 'CIN' },
  { id: 158, name: 'Milwaukee Brewers', abbreviation: 'MIL' },
  { id: 134, name: 'Pittsburgh Pirates', abbreviation: 'PIT' },
  { id: 138, name: 'St. Louis Cardinals', abbreviation: 'STL' },
  { id: 109, name: 'Arizona Diamondbacks', abbreviation: 'ARI' },
  { id: 115, name: 'Colorado Rockies', abbreviation: 'COL' },
  { id: 119, name: 'Los Angeles Dodgers', abbreviation: 'LAD' },
  { id: 135, name: 'San Diego Padres', abbreviation: 'SD' },
  { id: 137, name: 'San Francisco Giants', abbreviation: 'SF' },
  { id: 144, name: 'Washington Nationals', abbreviation: 'WSH' },
  { id: 143, name: 'Philadelphia Phillies', abbreviation: 'PHI' }
];
  
  const teamGamesCache = new Map();
  const marinersHomeGamesCache = new Map();
  
  // Function to fetch Mariners home games since Opening Day 2024
  export async function fetchMarinersHomeGamesSinceOpeningDay() {
    const cacheKey = 'mariners_home_games_2024';
    if (marinersHomeGamesCache.has(cacheKey)) {
      return marinersHomeGamesCache.get(cacheKey);
    }
  
    try {
      // Mariners team ID is 136
      // Opening Day 2024 was March 28, 2024
      const openingDay = '03/28/2024';
      const today = new Date();
      const endDate = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getDate().toString().padStart(2, '0')}/${today.getFullYear()}`;
      
      const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&teamId=136&startDate=${openingDay}&endDate=${endDate}&scheduleTypes=games&hydrate=venue`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch Mariners schedule: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter for home games that have been played
      let homeGamesCount = 0;
      
      if (data.dates) {
        for (const dateData of data.dates) {
          if (dateData.games) {
            for (const game of dateData.games) {
              // Check if it's a home game (Mariners team ID is 136)
              if (game.teams?.home?.team?.id === 136) {
                // Check if the game has been played (status is Final or In Progress)
                if (game.status?.detailedState === 'Final' || game.status?.detailedState === 'In Progress') {
                  homeGamesCount++;
                }
              }
            }
          }
        }
      }
      
      marinersHomeGamesCache.set(cacheKey, homeGamesCount);
      return homeGamesCount;
      
    } catch (error) {
      console.error('Error fetching Mariners home games:', error);
      // Fallback to estimated calculation if API fails
      return calculateEstimatedHomeGames();
    }
  }
  
  // Fallback function for estimated calculation
  function calculateEstimatedHomeGames() {
    const openingDay = new Date('2024-03-28');
    const today = new Date();
    
    // Calculate days since opening day
    const daysSinceOpening = Math.floor((today - openingDay) / (1000 * 60 * 60 * 24));
    
    // Rough estimate: Mariners play about 3-4 home games per week during season
    const estimatedHomeGames = Math.min(Math.floor(daysSinceOpening / 7 * 3.5), 81);
    
    return Math.max(0, estimatedHomeGames);
  }
  
  export async function fetchTeamGamesPlayed(teamId, season) {
    const key = `${teamId}|${season}`;
    if (teamGamesCache.has(key)) return teamGamesCache.get(key);
  
    const url = `https://statsapi.mlb.com/api/v1/schedule?teamId=${teamId}&season=${season}&sportId=1&gameTypes=R`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load schedule: ${res.status}`);
    const json = await res.json();
    const games = (json.dates || []).flatMap(d => d.games || []);
    const played = games.filter(g => ['Final','In Progress'].includes(g.status.detailedState)).length;
  
    teamGamesCache.set(key, played);
    return played;
  }
  
  export async function fetchHRData() {
    const results = {};
    const summary = [];
    let calRaleighGameLog = null;

    await Promise.all(players.map(async p => {
      const url = `https://statsapi.mlb.com/api/v1/people/${p.id}/stats?stats=gameLog&season=${p.season}&group=hitting`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`HR data failed for ${p.label}`);
      const json = await res.json();
      const games = (json.stats[0]?.splits || []).reverse();

      let totalHR = 0;
      const progression = games.map(g => {
        totalHR += Number(g.stat.homeRuns || 0);
        return totalHR;
      });

      const teamGames = await fetchTeamGamesPlayed(p.teamId, p.season);
      results[p.label] = progression;
      summary.push({ label: p.label, totalHR, gamesPlayed: progression.length, teamGamesPlayed: teamGames });

      // If Cal Raleigh 2025, also collect date and homeRuns for each game
      if (p.label === 'Cal Raleigh 2025') {
        calRaleighGameLog = games.map(g => ({
          date: g.date,
          homeRuns: Number(g.stat.homeRuns || 0)
        }));
      }
    }));

    return { results, summary, calRaleighGameLog };
  }
  
  export async function fetchSeasonStats() {
    const data = [];
  
    await Promise.all(players.map(async p => {
      const url = `https://statsapi.mlb.com/api/v1/people/${p.id}/stats?stats=season&group=hitting&season=${p.season}`;
      const res  = await fetch(url);
      if (!res.ok) throw new Error(`Season stats failed for ${p.label}`);
      const json = await res.json();
      const stat = json.stats[0]?.splits[0]?.stat || {};
  
      const hr     = parseInt(stat.homeRuns || 0);
      const salary = salaries[p.label] || 0;
      const $perHR = hr > 0 ? salary / hr : 'N/A';
  
      data.push({
        label:  p.label,
        HR:     hr,
        AVG:    parseFloat(stat.avg) || 'N/A',
        OBP:    parseFloat(stat.obp) || 'N/A',
        SLG:    parseFloat(stat.slg) || 'N/A',
        OPS:    parseFloat(stat.ops) || 'N/A',
        AB_HR:  hr > 0 ? (parseInt(stat.atBats||0)/hr).toFixed(3) : 'N/A',
        Salary: salary,
        DollarPerHR: $perHR
      });
    }));
  
    return data;
  }

// Fetch top 10 current season HR leaders and their HR progression
export async function fetchCurrentSeasonLeadersHRData(season = new Date().getFullYear()) {
  // 1. Get top 10 HR leaders
  const leadersUrl = `https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=homeRuns&season=${season}&leaderGameTypes=R&statGroup=hitting&limit=10`;
  const leadersRes = await fetch(leadersUrl);
  if (!leadersRes.ok) throw new Error('Failed to fetch HR leaders');
  const leadersJson = await leadersRes.json();
  console.log('Leaders API response:', leadersJson); // DEBUG
  const leaderPlayers = leadersJson.leagueLeaders?.[0]?.leaders || [];

  // 2. For each leader, fetch their game log and build progression
  const results = {};
  const summary = [];
  await Promise.all(leaderPlayers.map(async (leader) => {
    const playerId = leader.person.id;
    const label = `${leader.person.fullName} ${season}`;
    const teamId = leader.team?.id;
    // Fetch game log
    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=gameLog&season=${season}&group=hitting`;
    const res = await fetch(url);
    if (!res.ok) return; // skip if error
    const json = await res.json();
    const games = (json.stats[0]?.splits || []).reverse();
    let totalHR = 0;
    const progression = games.map(g => {
      totalHR += Number(g.stat.homeRuns || 0);
      return totalHR;
    });
    // Fetch team games played for pace projection
    let teamGamesPlayed = null;
    if (teamId) {
      try {
        teamGamesPlayed = await fetchTeamGamesPlayed(teamId, season);
      } catch {}
    }
    results[label] = progression;
    summary.push({ label, totalHR, gamesPlayed: progression.length, teamGamesPlayed });
  }));
  return { results, summary };
} 

// Fetch division standings data
export async function fetchDivisionStandings(divisionId, season = new Date().getFullYear()) {
  try {
    // Try both league IDs (103 for AL, 104 for NL)
    const leagueIds = [103, 104];
    let allRecords = [];
    
    for (const leagueId of leagueIds) {
      const url = `https://statsapi.mlb.com/api/v1/standings?leagueId=${leagueId}&season=${season}&standingsTypes=regularSeason&group=division&divisionId=${divisionId}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const records = data.records?.[0]?.teamRecords || [];
        allRecords = allRecords.concat(records);
      }
    }
    
    // Sort by wins descending, then by win percentage
    return allRecords.sort((a, b) => {
      if (a.wins !== b.wins) {
        return b.wins - a.wins;
      }
      return parseFloat(b.winPercentage) - parseFloat(a.winPercentage);
    });
  } catch (error) {
    console.error('Error fetching division standings:', error);
    return [];
  }
}

// Fetch team game logs for division race progression
export async function fetchTeamGameLogs(teamId, season = new Date().getFullYear()) {
  try {
    // Use the schedule API to get team games
    const url = `https://statsapi.mlb.com/api/v1/schedule?teamId=${teamId}&season=${season}&sportId=1&gameTypes=R`;
    console.log(`Fetching schedule for team ${teamId} in season ${season}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch team schedule: ${response.status}`);
    }
    
    const data = await response.json();
    const games = (data.dates || []).flatMap(d => d.games || []);
    console.log(`Found ${games.length} total games for team ${teamId}`);
    
    // Sort games by date and calculate cumulative wins
    const sortedGames = games
      .filter(game => game.status?.detailedState === 'Final')
      .sort((a, b) => new Date(a.gameDate) - new Date(b.gameDate));
    
    console.log(`Found ${sortedGames.length} completed games for team ${teamId}`);
    
    let cumulativeWins = 0;
    const result = sortedGames.map(game => {
      const isHomeTeam = game.teams?.home?.team?.id === teamId;
      const isWin = isHomeTeam ? 
        game.teams?.home?.isWinner : 
        game.teams?.away?.isWinner;
      
      if (isWin) cumulativeWins++;
      
      return {
        date: game.gameDate,
        wins: cumulativeWins,
        gamesPlayed: cumulativeWins + (game.gamesPlayed || 0)
      };
    });
    
    console.log(`Team ${teamId} final wins: ${cumulativeWins}`);
    return result;
  } catch (error) {
    console.error('Error fetching team game logs:', error);
    return [];
  }
}

// Fetch all division standings with progression data
export async function fetchDivisionRaceData(season = new Date().getFullYear()) {
  // Define all MLB teams with their divisions (using correct team IDs)
  const teams = [
    // AL East
    { id: 147, name: 'Yankees', division: 'AL East' },
    { id: 111, name: 'Red Sox', division: 'AL East' },
    { id: 139, name: 'Rays', division: 'AL East' },
    { id: 110, name: 'Orioles', division: 'AL East' },
    { id: 141, name: 'Blue Jays', division: 'AL East' },
    
    // AL Central
    { id: 118, name: 'Royals', division: 'AL Central' },
    { id: 142, name: 'Twins', division: 'AL Central' },
    { id: 114, name: 'Guardians', division: 'AL Central' },
    { id: 145, name: 'White Sox', division: 'AL Central' },
    { id: 116, name: 'Tigers', division: 'AL Central' },
    
    // AL West
    { id: 136, name: 'Mariners', division: 'AL West' },
    { id: 140, name: 'Rangers', division: 'AL West' },
    { id: 117, name: 'Astros', division: 'AL West' },
    { id: 133, name: 'Athletics', division: 'AL West' },
    { id: 108, name: 'Angels', division: 'AL West' },
    
    // NL East
    { id: 121, name: 'Mets', division: 'NL East' },
    { id: 120, name: 'Nationals', division: 'NL East' },
    { id: 144, name: 'Braves', division: 'NL East' },
    { id: 143, name: 'Phillies', division: 'NL East' },
    { id: 146, name: 'Marlins', division: 'NL East' },
    
    // NL Central
    { id: 112, name: 'Cubs', division: 'NL Central' },
    { id: 158, name: 'Brewers', division: 'NL Central' },
    { id: 138, name: 'Cardinals', division: 'NL Central' },
    { id: 134, name: 'Pirates', division: 'NL Central' },
    { id: 113, name: 'Reds', division: 'NL Central' },
    
    // NL West
    { id: 119, name: 'Dodgers', division: 'NL West' },
    { id: 137, name: 'Giants', division: 'NL West' },
    { id: 115, name: 'Rockies', division: 'NL West' },
    { id: 135, name: 'Padres', division: 'NL West' },
    { id: 109, name: 'Diamondbacks', division: 'NL West' }
  ];

  const results = {};
  const summary = [];

  try {
    // Fetch current standings for all teams
    const standingsUrl = `https://statsapi.mlb.com/api/v1/standings?season=${season}&standingsTypes=regularSeason&leagueId=103,104`;
    console.log('Fetching all team standings...');
    
    const standingsResponse = await fetch(standingsUrl);
    if (!standingsResponse.ok) {
      throw new Error(`Failed to fetch standings: ${standingsResponse.status}`);
    }
    
    const standingsData = await standingsResponse.json();
    const allTeamRecords = [];
    
    // Extract all team records from the standings
    standingsData.records?.forEach(record => {
      if (record.teamRecords) {
        allTeamRecords.push(...record.teamRecords);
      }
    });
    
    console.log(`Found ${allTeamRecords.length} team records`);
    
    // Debug: Log all team records to see what teams are available
    console.log('Available teams in standings:', allTeamRecords.map(r => `${r.team.name} (ID: ${r.team.id})`));
    
    // Group teams by division and get all teams from each
    const divisionTeams = {};
    teams.forEach(team => {
      if (!divisionTeams[team.division]) {
        divisionTeams[team.division] = [];
      }
      divisionTeams[team.division].push(team);
    });
    
    // For each division, get the top 3 teams based on current standings
    await Promise.all(Object.entries(divisionTeams).map(async ([division, divisionTeamList]) => {
      console.log(`Processing ${division}...`);
      
      // Find all teams in this division from standings
      console.log(`Looking for teams in ${division}:`, divisionTeamList.map(t => `${t.name} (ID: ${t.id})`));
      
      const divisionStandings = allTeamRecords.filter(record => {
        const teamId = record.team.id;
        const teamName = record.team.name;
        
        // Try to match by ID first
        let isMatch = divisionTeamList.some(team => team.id === teamId);
        
        // If no match by ID, try to match by name
        if (!isMatch) {
          isMatch = divisionTeamList.some(team => 
            team.name === teamName || 
            team.name === teamName.replace(' ', '') ||
            teamName.includes(team.name) ||
            team.name.includes(teamName.split(' ')[0])
          );
        }
        
        if (isMatch) {
          console.log(`Found match: ${teamName} (ID: ${teamId})`);
        } else {
          console.log(`No match found for: ${teamName} (ID: ${teamId})`);
        }
        return isMatch;
      }).sort((a, b) => {
        if (a.wins !== b.wins) {
          return b.wins - a.wins;
        }
        return parseFloat(b.winPercentage) - parseFloat(a.winPercentage);
      });
      
      console.log(`All teams in ${division}:`, divisionStandings.map(r => r.team.name));
      
      // Fetch game logs for each team
      await Promise.all(divisionStandings.map(async (teamRecord) => {
        const teamId = teamRecord.team.id;
        const teamName = teamRecord.team.name;
        console.log(`Creating label for team: "${teamName}" (ID: ${teamId}) in ${division}`);
        const label = `${teamName} (${division})`;
        
        console.log(`Fetching game logs for ${teamName}...`);
        const gameLogs = await fetchTeamGameLogs(teamId, season);
        console.log(`${teamName} game logs:`, gameLogs.length, 'games');
        
        // Create progression data (cumulative wins over games played)
        const progression = gameLogs.map(game => game.wins);
        
        // Only add if we have data
        if (progression.length > 0) {
          results[label] = progression;
          summary.push({
            label,
            division: division,
            teamName,
            currentWins: teamRecord.wins,
            currentLosses: teamRecord.losses,
            gamesPlayed: progression.length,
            winPercentage: teamRecord.winPercentage
          });
        }
      }));
    }));

    console.log('Division race data fetched:', Object.keys(results).length, 'teams');
    
    // If no data was fetched, return some fallback data
    if (Object.keys(results).length === 0) {
      console.log('No data fetched, returning fallback data');
      return {
        results: {
          'Mariners (AL West)': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          'Yankees (AL East)': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          'Dodgers (NL West)': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        summary: [
          { label: 'Mariners (AL West)', division: 'AL West', teamName: 'Mariners', currentWins: 10, currentLosses: 1, gamesPlayed: 11, winPercentage: '0.909' },
          { label: 'Yankees (AL East)', division: 'AL East', teamName: 'Yankees', currentWins: 10, currentLosses: 1, gamesPlayed: 11, winPercentage: '0.909' },
          { label: 'Dodgers (NL West)', division: 'NL West', teamName: 'Dodgers', currentWins: 10, currentLosses: 1, gamesPlayed: 11, winPercentage: '0.909' }
        ]
      };
    }
    
    return { results, summary };
  } catch (error) {
    console.error('Error fetching division race data:', error);
    return { results, summary };
  }
} 

// Fetch wild card race data for both leagues
export async function fetchWildCardRaceData(season = new Date().getFullYear()) {
  // MLB league IDs: 103 = AL, 104 = NL
  const leagues = [103, 104];
  const results = {};
  const summary = [];
  try {
    for (const leagueId of leagues) {
      const url = `https://statsapi.mlb.com/api/v1/standings?standingsTypes=wildCard&leagueId=${leagueId}&season=${season}`;
      const response = await fetch(url);
      if (!response.ok) continue;
      const data = await response.json();
      const records = data.records?.[0]?.teamRecords || [];
      // For each team, fetch their win progression
      await Promise.all(records.map(async (teamRecord) => {
        const teamId = teamRecord.team.id;
        const teamName = teamRecord.team.name;
        const label = `${teamName} (${data.records[0].wildCardRank})`;
        // Fetch game logs for win progression
        const gameLogs = await fetchTeamGameLogs(teamId, season);
        const progression = gameLogs.map(game => game.wins);
        if (progression.length > 0) {
          results[teamName] = progression;
          summary.push({
            label: teamName,
            leagueId,
            currentWins: teamRecord.wins,
            currentLosses: teamRecord.losses,
            gamesPlayed: progression.length,
            winPercentage: teamRecord.winPercentage,
            wildCardRank: teamRecord.wildCardRank
          });
        }
      }));
    }
    return { results, summary };
  } catch (error) {
    console.error('Error fetching wild card race data:', error);
    return { results, summary };
  }
}

// Fetch Mariners relief pitcher roster
export async function fetchMarinersReliefPitchers() {
  try {
    // Mariners team ID is 136
    const url = `https://statsapi.mlb.com/api/v1/teams/136/roster?season=${new Date().getFullYear()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Mariners roster: ${response.status}`);
    }
    
    const data = await response.json();
    const roster = data.roster || [];
    
    // Filter for relief pitchers (exclude starting pitchers)
    // We'll identify relief pitchers by their recent usage patterns
    const pitchers = roster.filter(player => 
      player.position?.abbreviation === 'P' || 
      player.position?.name === 'Pitcher'
    );
    
    return pitchers;
  } catch (error) {
    console.error('Error fetching Mariners relief pitchers:', error);
    return [];
  }
}

// Helper to fetch and cache box scores
const boxScoreCache = new Map();
async function fetchBoxScore(gamePk) {
  if (boxScoreCache.has(gamePk)) return boxScoreCache.get(gamePk);
  const url = `https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch box score for game ${gamePk}`);
  const data = await res.json();
  boxScoreCache.set(gamePk, data);
  return data;
}

// Fetch recent game logs for a pitcher (last 7 days)
export async function fetchPitcherRecentGameLogs(playerId, days = 7) {
  try {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];
    
    const url = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=gameLog&startDate=${startDateStr}&endDate=${endDateStr}&group=pitching&gameTypes=R`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch game logs for player ${playerId}: ${response.status}`);
    }
    
    const data = await response.json();
    const gameLogs = data.stats?.[0]?.splits || [];
    
    // Filter for relief appearances (not starts)
    const reliefAppearances = gameLogs.filter(game => {
      const inningsPitched = parseFloat(game.stat.inningsPitched || 0);
      const isRelief = inningsPitched < 5; // Generally relief pitchers don't go 5+ innings
      return isRelief && game.stat.gamesPlayed > 0;
    });
    
    // Attach gamePk and isHome for later use
    return reliefAppearances.map(game => ({
      date: game.date,
      opponent: game.opponent?.name || 'Unknown',
      inningsPitched: parseFloat(game.stat.inningsPitched || 0),
      pitches: parseInt(game.stat.numberOfPitches || game.stat.pitchesThrown || 0),
      strikes: parseInt(game.stat.strikes || 0),
      strikePercentage: game.stat.strikePercentage ? parseFloat(game.stat.strikePercentage) : null,
      strikeouts: parseInt(game.stat.strikeOuts || 0),
      walks: parseInt(game.stat.baseOnBalls || 0),
      hits: parseInt(game.stat.hits || 0),
      runs: parseInt(game.stat.runs || 0),
      earnedRuns: parseInt(game.stat.earnedRuns || 0),
      homeRuns: parseInt(game.stat.homeRuns || 0),
      battersFaced: parseInt(game.stat.battersFaced || 0),
      gamesPlayed: parseInt(game.stat.gamesPlayed || 0),
      gamesStarted: parseInt(game.stat.gamesStarted || 0),
      holds: parseInt(game.stat.holds || 0),
      saves: parseInt(game.stat.saves || 0),
      blownSaves: parseInt(game.stat.blownSaves || 0),
      wins: parseInt(game.stat.wins || 0),
      losses: parseInt(game.stat.losses || 0),
      era: parseFloat(game.stat.era || 0),
      whip: parseFloat(game.stat.whip || 0),
      strikeoutRate: parseFloat(game.stat.strikeOutRate || 0),
      walkRate: parseFloat(game.stat.walkRate || 0),
      gamePk: game.game?.gamePk,
      isHome: game.isHome,
      playerId: playerId
    }));
  } catch (error) {
    console.error(`Error fetching game logs for player ${playerId}:`, error);
    return [];
  }
}

// Fetch bullpen overview data for the last week
export async function fetchBullpenOverview(period = 7) {
  try {
    // Get Mariners relief pitchers
    const reliefPitchers = await fetchMarinersReliefPitchers();
    
    // Get recent game logs for each pitcher
    const bullpenData = await Promise.all(
      reliefPitchers.map(async (pitcher) => {
        const gameLogs = await fetchPitcherRecentGameLogs(pitcher.person.id, period);
        
        return {
          player: {
            id: pitcher.person.id,
            name: pitcher.person.fullName,
            jerseyNumber: pitcher.jerseyNumber,
            position: pitcher.position?.abbreviation || 'P'
          },
          recentOutings: gameLogs,
          summary: {
            totalOutings: gameLogs.length,
            totalInnings: gameLogs.reduce((sum, game) => sum + game.inningsPitched, 0),
            totalPitches: gameLogs.reduce((sum, game) => sum + game.pitches, 0),
            totalStrikeouts: gameLogs.reduce((sum, game) => sum + game.strikeouts, 0),
            totalWalks: gameLogs.reduce((sum, game) => sum + game.walks, 0),
            totalHits: gameLogs.reduce((sum, game) => sum + game.hits, 0),
            totalRuns: gameLogs.reduce((sum, game) => sum + game.runs, 0),
            totalEarnedRuns: gameLogs.reduce((sum, game) => sum + game.earnedRuns, 0),
            totalHolds: gameLogs.reduce((sum, game) => sum + game.holds, 0),
            totalSaves: gameLogs.reduce((sum, game) => sum + game.saves, 0),
            totalBlownSaves: gameLogs.reduce((sum, game) => sum + game.blownSaves, 0),
            totalWins: gameLogs.reduce((sum, game) => sum + game.wins, 0),
            totalLosses: gameLogs.reduce((sum, game) => sum + game.losses, 0)
          }
        };
      })
    );
    
    // Gather all outings to determine appearance order
    const allOutings = [];
    bullpenData.forEach(pitcher => {
      pitcher.recentOutings.forEach(outing => {
        allOutings.push({
          ...outing,
          playerId: pitcher.player.id
        });
      });
    });
    // Group outings by gamePk
    const outingsByGame = {};
    allOutings.forEach(outing => {
      if (!outing.gamePk) return;
      if (!outingsByGame[outing.gamePk]) outingsByGame[outing.gamePk] = [];
      outingsByGame[outing.gamePk].push(outing);
    });
    // For each game, fetch box score and assign appearanceIndex
    await Promise.all(Object.entries(outingsByGame).map(async ([gamePk, outings]) => {
      const box = await fetchBoxScore(gamePk);
      // Determine if Mariners were home or away
      const marinersId = 136;
      let pitcherOrder = [];
      if (box.teams.home.team.id === marinersId) {
        pitcherOrder = box.teams.home.pitchers;
      } else if (box.teams.away.team.id === marinersId) {
        pitcherOrder = box.teams.away.pitchers;
      }
      // Assign appearanceIndex
      outings.forEach(outing => {
        outing.appearanceIndex = pitcherOrder.indexOf(Number(outing.playerId));
      });
    }));
    // Attach appearanceIndex to bullpenData
    bullpenData.forEach(pitcher => {
      pitcher.recentOutings.forEach(outing => {
        const found = allOutings.find(o => o.playerId === pitcher.player.id && o.date === outing.date && o.gamePk === outing.gamePk);
        if (found) outing.appearanceIndex = found.appearanceIndex;
      });
    });
    // Filter out pitchers with no recent outings
    const activeBullpen = bullpenData.filter(pitcher => pitcher.recentOutings.length > 0);
    
    return {
      pitchers: activeBullpen,
      lastUpdated: new Date().toISOString(),
      period: `Last ${period} days`
    };
  } catch (error) {
    console.error('Error fetching bullpen overview:', error);
    return {
      pitchers: [],
      lastUpdated: new Date().toISOString(),
      period: `Last ${period} days`,
      error: 'Failed to load bullpen data'
    };
  }
} 

// Fetch starting pitchers and their quality start data for any team
export async function fetchStartingPitchersQSData(teamId = 136, season = new Date().getFullYear()) {
  try {
    // Default to Mariners team ID is 136
    
    // Fetch team roster to get starting pitchers
    const rosterUrl = `https://statsapi.mlb.com/api/v1/teams/${teamId}/roster?season=${season}`;
    const rosterResponse = await fetch(rosterUrl);
    if (!rosterResponse.ok) {
      throw new Error(`Failed to fetch team roster: ${rosterResponse.status}`);
    }
    
    const rosterData = await rosterResponse.json();
    const pitchers = rosterData.roster.filter(player => 
      player.position?.abbreviation === 'P' && 
      player.status?.code === 'A' // Active players only
    );
    
    // Fetch game logs for each pitcher
    const startingPitchers = await Promise.all(
      pitchers.map(async (pitcher) => {
        const playerId = pitcher.person.id;
        const playerName = pitcher.person.fullName;
        const jerseyNumber = pitcher.jerseyNumber;
        
        // Fetch pitching game logs for the season
        const gameLogUrl = `https://statsapi.mlb.com/api/v1/people/${playerId}/stats?stats=gameLog&season=${season}&group=pitching&gameTypes=R`;
        const gameLogResponse = await fetch(gameLogUrl);
        
        if (!gameLogResponse.ok) {
          return null;
        }
        
        const gameLogData = await gameLogResponse.json();
        const games = gameLogData.stats?.[0]?.splits || [];
        
        // Filter for starting pitcher appearances (games started > 0)
        const starts = games.filter(game => {
          const gamesStarted = parseInt(game.stat.gamesStarted || 0);
          const inningsPitched = parseFloat(game.stat.inningsPitched || 0);
          return gamesStarted > 0 && inningsPitched > 0;
        });
        
        // Process each start to determine quality starts and game results
        const processedStarts = starts.map(game => {
          const inningsPitched = parseFloat(game.stat.inningsPitched || 0);
          const earnedRuns = parseInt(game.stat.earnedRuns || 0);
          const isQualityStart = inningsPitched >= 6 && earnedRuns <= 3;
          
          // Determine game result (need to fetch box score for team result)
          const gamePk = game.game?.gamePk;
          const isWin = parseInt(game.stat.wins || 0) > 0;
          const isLoss = parseInt(game.stat.losses || 0) > 0;
          
          return {
            date: game.date,
            opponent: game.opponent?.name || 'Unknown',
            inningsPitched,
            earnedRuns,
            isQualityStart,
            isWin,
            isLoss,
            gamePk,
            playerId
          };
        });
        
        // Calculate summary stats
        const qualityStarts = processedStarts.filter(start => start.isQualityStart);
        const qualityStartWins = qualityStarts.filter(start => start.isWin);
        const qualityStartLosses = qualityStarts.filter(start => start.isLoss);
        
        return {
          player: {
            id: playerId,
            name: playerName,
            jerseyNumber: jerseyNumber
          },
          starts: processedStarts,
          summary: {
            totalStarts: processedStarts.length,
            qualityStarts: qualityStarts.length,
            qualityStartWins: qualityStartWins.length,
            qualityStartLosses: qualityStartLosses.length,
            nonQualityStarts: processedStarts.length - qualityStarts.length
          }
        };
      })
    );
    
    // Filter out null results and pitchers with no starts
    const activeStarters = startingPitchers.filter(pitcher => 
      pitcher && pitcher.starts.length > 0
    );
    
    // Sort by quality starts (descending)
    activeStarters.sort((a, b) => b.summary.qualityStarts - a.summary.qualityStarts);
    
    return {
      pitchers: activeStarters,
      lastUpdated: new Date().toISOString(),
      season: season
    };
    
  } catch (error) {
    console.error('Error fetching starting pitchers QS data:', error);
    return {
      pitchers: [],
      lastUpdated: new Date().toISOString(),
      season: season
    };
  }
} 