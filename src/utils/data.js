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
    }));
  
    return { results, summary };
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