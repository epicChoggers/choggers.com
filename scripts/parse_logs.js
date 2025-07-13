const fs = require('fs');
const path = require('path');

const players = [
  { label: 'bonds01', id: 111188, season: 2001 },
  { label: 'judge22', id: 592450, season: 2022 },
  { label: 'judge24', id: 592450, season: 2024 },
  { label: 'cal24', id: 663728, season: 2024 }
];

const out = {};
for (const p of players) {
  const file = path.join('tmp', `${p.label}.json`);
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const arr = data.stats[0].splits.map(s => Number(s.stat.homeRuns));
  while (arr.length < 162) arr.push(null);
  out[p.label] = arr;
}
fs.writeFileSync('js/hr_data.json', JSON.stringify(out, null, 2));
