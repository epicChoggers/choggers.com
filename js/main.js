// js/main.js
import { fetchHRData, fetchSeasonStats, fetchCurrentSeasonLeadersHRData, fetchMarinersHomeGamesSinceOpeningDay } from './data.js';
import { plotHRPaceChart }              from './chart.js';
import { renderStatsTable }             from './ui.js';

// Function to update the robbery count display using MLB API
async function updateRobberyCount() {
  try {
    const count = await fetchMarinersHomeGamesSinceOpeningDay();
    const robberyCountElement = document.getElementById('robberyCount');
    if (robberyCountElement) {
      robberyCountElement.textContent = count;
    }
  } catch (error) {
    console.error('Error updating robbery count:', error);
    // Fallback to 0 if API fails
    const robberyCountElement = document.getElementById('robberyCount');
    if (robberyCountElement) {
      robberyCountElement.textContent = '0';
    }
  }
}

async function renderChart(mode) {
  let results, summary;
  if (mode === 'current') {
    const data = await fetchCurrentSeasonLeadersHRData();
    results = data.results;
    summary = data.summary;
    document.getElementById('toggleLabel').textContent = 'Current Season HR Leaders';
  } else {
    const data = await fetchHRData();
    results = data.results;
    summary = data.summary;
    document.getElementById('toggleLabel').textContent = 'Historical HR Pace';
  }
  plotHRPaceChart(results, summary, mode);
}

async function init() {
  try {
    await renderChart('historical');
    const stats = await fetchSeasonStats();
    renderStatsTable('main.content', stats);
    
    // Initialize robbery count using MLB API
    await updateRobberyCount();
  } catch (err) {
    console.error('Init error:', err);
  }

  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('change', async (e) => {
      await renderChart(e.target.checked ? 'current' : 'historical');
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  }
}

init();