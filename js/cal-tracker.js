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
  const labels = logs.map((l, i) => i + 1);
  const totals = [];
  let sum = 0;
  for (const l of logs) {
    sum += Number(l.stat.homeRuns);
    totals.push(sum);
  }
  const ctx = document.getElementById('hrChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Cumulative HR',
        data: totals,
        borderColor: '#d9534f',
        backgroundColor: 'rgba(217,83,79,0.2)',
        fill: false,
        lineTension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true, title: { display: true, text: 'Game' } },
        y: { display: true, title: { display: true, text: 'Home Runs' }, beginAtZero: true }
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadSeasonStats();
  loadHrChart();
});
