// js/data.js
// Data fetching and configuration

export const players = [
    { label: 'Cal Raleigh 2025',     id: 663728, season: 2025, teamId: 136 },
    { label: 'Barry Bonds 2001',    id: 111188, season: 2001, teamId: 137 },
    { label: 'Sammy Sosa 1998',     id: 122544, season: 1998, teamId: 112 },
    { label: 'Mark McGwire 1998',   id: 118743, season: 1998, teamId: 138 },
    { label: 'Aaron Judge 2022',    id: 592450, season: 2022, teamId: 147 },
    { label: 'Aaron Judge 2025',    id: 592450, season: 2025, teamId: 147 },
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
    'Aaron Judge 2022':    40000000,
    'Aaron Judge 2025':    40000000,
    'Barry Bonds 2001':    11450000 * 1.74,
    'Sammy Sosa 1998':      8750000 * 1.85,
    'Mark McGwire 1998':    8900000 * 1.85,
    'Ken Griffey Jr. 1997': 8500000 * 2.0,
  };
  
  export const spotracLinks = {
    'Cal Raleigh 2025':     'https://www.spotrac.com/mlb/player/_/id/26119/cal-raleigh',
    'Barry Bonds 2001':    'https://www.spotrac.com/mlb/player/_/id/48519/barry-bonds',
    'Sammy Sosa 1998':     'https://www.spotrac.com/mlb/player/_/id/12349/sammy-sosa',
    'Mark McGwire 1998':   'https://www.spotrac.com/mlb/player/_/id/12047/mark-mcgwire',
    'Aaron Judge 2022':    'https://www.spotrac.com/mlb/player/_/id/18499/aaron-judge',
    'Aaron Judge 2025':    'https://www.spotrac.com/mlb/player/_/id/18499/aaron-judge',
    'Ken Griffey Jr. 1997':'https://www.spotrac.com/mlb/player/_/id/115135/ken-griffey-jr'
  };
  
  const teamGamesCache = new Map();
  
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