const fs = require('fs/promises');

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  return res.json();
}

async function getPitcherHand(gamePk, isHome) {
  const data = await fetchJSON(`https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`);
  let pitcherId = isHome ? data.gameData.probablePitchers.away?.id : data.gameData.probablePitchers.home?.id;
  if (!pitcherId) {
    const side = isHome ? 'away' : 'home';
    const pitchers = data.liveData.boxscore.teams[side]?.pitchers;
    if (Array.isArray(pitchers) && pitchers.length > 0) pitcherId = pitchers[0];
  }
  if (!pitcherId) return null;
  const pitcher = await fetchJSON(`https://statsapi.mlb.com/api/v1/people/${pitcherId}`);
  return pitcher.people[0]?.pitchHand?.code || null;
}

(async () => {
  const raw = await fs.readFile('tmp/cal24.json', 'utf8');
  const logs = JSON.parse(raw).stats[0].splits;

  const byTeam = {};
  const vsSide = { L: { games:0, hits:0, hr:0, ab:0 }, R: { games:0, hits:0, hr:0, ab:0 } };
  const homeAway = { home: { games:0, hits:0, hr:0, ab:0 }, away: { games:0, hits:0, hr:0, ab:0 } };

  for (const entry of logs) {
    const team = entry.opponent.name;
    const isHome = entry.isHome;
    const hits = Number(entry.stat.hits);
    const hr = Number(entry.stat.homeRuns);
    const ab = Number(entry.stat.atBats);
    const gamePk = entry.game.gamePk;

    byTeam[team] = byTeam[team] || { games:0, hits:0, hr:0, ab:0 };
    byTeam[team].games++;
    byTeam[team].hits += hits;
    byTeam[team].hr += hr;
    byTeam[team].ab += ab;

    const homeKey = isHome ? 'home' : 'away';
    homeAway[homeKey].games++;
    homeAway[homeKey].hits += hits;
    homeAway[homeKey].hr += hr;
    homeAway[homeKey].ab += ab;

    let hand = null;
    try {
      hand = await getPitcherHand(gamePk, isHome);
    } catch (err) {
      // ignore network errors and continue
    }
    const side = hand === 'L' ? 'R' : 'L';
    vsSide[side].games++;
    vsSide[side].hits += hits;
    vsSide[side].hr += hr;
    vsSide[side].ab += ab;
  }

  await fs.writeFile('js/cal_stats.json', JSON.stringify({ byTeam, vsSide, homeAway }, null, 2));
  console.log('Stats saved to js/cal_stats.json');
})();
