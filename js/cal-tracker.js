async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch ' + url);
  return res.json();
}

function currentYear() {
  return new Date().getFullYear();
}

async function loadSeasonStats() {
  const year = currentYear();
  const data = await fetchJSON(`https://statsapi.mlb.com/api/v1/people/663728/stats?stats=season&season=${year}&group=hitting`);
  const stat = data.stats?.[0]?.splits?.[0]?.stat || {};
  const el = id => document.getElementById(id);
  el('games').textContent = stat.gamesPlayed ?? '--';
  el('atbats').textContent = stat.atBats ?? '--';
  el('hits').textContent = stat.hits ?? '--';
  el('hr').textContent = stat.homeRuns ?? '--';
  el('rbi').textContent = stat.rbi ?? '--';
  el('avg').textContent = stat.avg ?? '--';
  el('obp').textContent = stat.obp ?? '--';
  el('slg').textContent = stat.slg ?? '--';
  el('ops').textContent = stat.ops ?? '--';
}

async function loadHrChart() {
  const year = currentYear();
  const data = await fetchJSON(`https://statsapi.mlb.com/api/v1/people/663728/stats?stats=gameLog&season=${year}&group=hitting`);
  const logs = data.stats?.[0]?.splits || [];
  const calTotals = [];
  let sum = 0;
  for (const l of logs) {
    sum += Number(l.stat.homeRuns);
    calTotals.push(sum);
  }

  const hist = await fetchJSON('js/hr_data.json');
  const players = [
    { key: 'bonds01', label: 'Barry Bonds 2001', color: '#6f42c1' },
    { key: 'judge22', label: 'Aaron Judge 2022', color: '#1f77b4' },
    { key: 'judge24', label: 'Aaron Judge 2024', color: '#ff7f0e' }
  ];

  function cumulative(arr) {
    const out = [];
    let tot = 0;
    for (const v of arr) {
      if (v == null) { out.push(null); continue; }
      tot += Number(v);
      out.push(tot);
    }
    return out;
  }

  const datasets = players.map(p => ({
    label: p.label,
    data: cumulative(hist[p.key] || []),
    borderColor: p.color,
    borderWidth: 2,
    fill: false,
    pointRadius: 0,
    tension: 0.3,
    cubicInterpolationMode: 'monotone'
  }));

  datasets.push({
    label: `Cal Raleigh ${year}`,
    data: calTotals,
    borderColor: '#d9534f',
    backgroundColor: 'rgba(217,83,79,0.2)',
    fill: false,
    tension: 0.3,
    cubicInterpolationMode: 'monotone'
  });

  const maxLen = Math.max(calTotals.length, ...datasets.map(d => d.data.length));
  const labels = Array.from({ length: maxLen }, (_, i) => i + 1);

  const ctx = document.getElementById('hrChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: true,
          title: { display: true, text: 'Game' },
          grid: { color: 'rgba(0,0,0,0.1)' }
        },
        y: {
          display: true,
          title: { display: true, text: 'Home Runs' },
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.1)' }
        }
      },
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadSeasonStats();
  loadHrChart();
});
