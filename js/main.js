// js/main.js
import { fetchHRData, fetchSeasonStats } from './data.js';
import { plotHRPaceChart }              from './chart.js';
import { renderStatsTable }             from './ui.js';

async function init() {
  try {
    const { results, summary } = await fetchHRData();
    plotHRPaceChart(results, summary);

    const stats = await fetchSeasonStats();
    renderStatsTable('main.content', stats);
  } catch (err) {
    console.error('Init error:', err);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  }
}

init();