// js/ui.js
import { spotracLinks } from './data.js';

export function renderStatsTable(selector, stats) {
  const topOrder = ['Cal Raleigh 2025','Aaron Judge 2025','Shohei Ohtani 2025'];
  const ordered  = [
    ...topOrder.map(l=>stats.find(s=>s.label===l)).filter(Boolean),
    ...stats.filter(s=>!topOrder.includes(s.label))
  ];

  const cols = ['AVG','OBP','SLG','OPS','AB_HR','Salary','DollarPerHR'];
  const container = document.querySelector(selector);
  const wrap = document.createElement('div');
  wrap.className = 'stat-block';
  wrap.innerHTML = '<h2>Season Rate Stats</h2>';

  let html = '<table><caption>Season Rate Stats</caption><thead><tr><th scope="col">Player</th>';
  cols.forEach(c => {
    let text = c.replace('_','/').replace('DollarPerHR','$/HR');
    html += `<th scope="col">${text}</th>`;
  });
  html += '</tr></thead><tbody>';

  ordered.forEach(p => {
    const bold = p.label==='Cal Raleigh 2025'?' style="font-weight:bold"':'';
    html += `<tr${bold}><td>${p.label}</td>`;
    cols.forEach(c => {
      let val = p[c];
      if (c==='Salary'||c==='DollarPerHR') {
        val = val!=='N/A'
          ? `<a href="${spotracLinks[p.label]}" target="_blank" style="color:var(--mariners-silver);color:#fff;">$${Math.round(Number(val)).toLocaleString()}</a>`
          : 'N/A';
      } else {
        val = isNaN(val)?val:Number(val).toFixed(3);
      }
      html += `<td>${val}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  html += '<div style="color:#8b949e;font-size:0.9em;margin-top:8px">* All salaries inflation‑adjusted to 2025 dollars.</div>';
  wrap.innerHTML += html;
  container.appendChild(wrap);
}