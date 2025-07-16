// js/chart.js
const calHeadshotPlugin = {
  id: 'cal-headshot',
  afterDraw: (chart, args, options) => {
    const results = chart.config._config.results;
    const calData = results && results['Cal Raleigh 2025'];
    if (!calData || calData.length === 0) return;
    const xIndex = calData.length - 1;
    const yValue = calData[xIndex];
    if (yValue == null) return;
    const xScale = chart.scales.x;
    const yScale = chart.scales.y;
    if (!xScale || !yScale) return;
    const x = xScale.getPixelForValue(xIndex + 1); // game numbers are 1-based
    const y = yScale.getPixelForValue(yValue);
    const ctx = chart.ctx;
    const img = new window.Image();
    img.src = 'PlayerHeadshot.png';
    img.onload = function() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 36, 0, 2 * Math.PI); // circular crop, radius 36px
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x - 36, y - 36, 72, 72); // draw larger image
      ctx.restore();
    };
  }
};

Chart.register(calHeadshotPlugin);

let chartInstance = null;

// Function to add needle emoji to suspected steroid users
function addNeedleToSuspectedUsers(label) {
  const suspectedUsers = ['Sammy Sosa', 'Barry Bonds', 'Mark McGwire'];
  const isSuspected = suspectedUsers.some(user => label.includes(user));
  return isSuspected ? `${label} 💉` : label;
}

export function plotHRPaceChart(results, summary, mode = 'historical') {
    const topOrder  = ['Cal Raleigh 2025','Shohei Ohtani 2025'];
    const allLabels = Object.keys(results);
    const ordered   = [
      ...topOrder.filter(l => allLabels.includes(l)),
      ...allLabels.filter(l => !topOrder.includes(l))
    ];

    const colorPalette = [
      '#0072B2', // Blue
      '#D55E00', // Vermillion
      '#009E73', // Green
      '#F0E442', // Yellow
      '#CC79A7', // Purple
      '#56B4E9', // Sky Blue
      '#E69F00', // Orange
      '#000000', // Black
      '#999999', // Grey
    ];
    const calGreen = '#00e676'; // visually appealing Mariners green from old version
    // Resolve CSS variables to actual color values
    const rootStyles = getComputedStyle(document.documentElement);
    const highlightColor = rootStyles.getPropertyValue('--highlight').trim();
    const marinersGreen = rootStyles.getPropertyValue('--mariners-green').trim();
    const datasets = ordered.map((label,i) => {
      const data  = results[label];
      // Only highlight Cal Raleigh in historical mode
      const isCal = label === 'Cal Raleigh 2025';
      const color = isCal
        ? calGreen
        : colorPalette[i % colorPalette.length];
      const pointBackgroundColor = isCal ? calGreen : color;
      const pointBorderColor = isCal ? calGreen : color;
      return {
        label: addNeedleToSuspectedUsers(label),
        data,
        fill: false,
        borderColor: color,
        borderWidth: isCal?5:3,
        borderDash: isCal?[]:[4,4],
        tension: 0.3,
        pointRadius: 0, // Hide all points
        pointHoverRadius: isCal ? 8 : 5, // Only show on hover
        pointBackgroundColor,
        pointBorderColor,
        skipLegend: false
      };
    });

    // Only add Cal Raleigh projection if present in data and mode is historical
    if (mode === 'historical' && allLabels.includes('Cal Raleigh 2025')) {
      const cal = summary.find(s=>s.label==='Cal Raleigh 2025');
      if (cal) {
        const played = results['Cal Raleigh 2025'].length;
        const pace   = cal.totalHR/Math.max(1,played);
        const maxG   = 162-(cal.teamGamesPlayed-played);
        const proj   = Array.from({length:162},(_,i)=>{
          if(i<played) return null;
          if(i<maxG)   return +(cal.totalHR+pace*(i+1-played)).toFixed(2);
          return null;
        });
        datasets.push({
          label:'Cal Raleigh 2025 Projected Pace',
          data: proj,
          fill: false,
          borderColor: calGreen,
          borderWidth:2,
          borderDash:[4,4],
          tension:0.25,
          pointRadius:0,
          skipLegend:true
        });
      }
    }

    // Determine x-axis length based on mode
    let maxGames = 162; // Default for historical
    if (mode === 'current') {
      // Find the maximum games played by any leader
      maxGames = Math.max(...summary.map(s => s.teamGamesPlayed)) + 2; // Add 4 games padding
    }
    
    const labels = Array.from({length: maxGames}, (_, i) => i + 1);

    // Determine y-axis max based on mode
    let yAxisMax = 80; // Default for historical
    if (mode === 'current') {
      // Find the maximum home runs from current season leaders
      const maxHR = Math.max(...summary.map(s => s.totalHR));
      yAxisMax = maxHR + 5; // Add 5 HR padding
    }

    // Destroy previous chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(document.getElementById('lineChart'), {
      type:'line',
      data:{ labels: labels, datasets },
      options:{
        responsive:true,
        maintainAspectRatio: false,
        plugins:{
          legend:{
            labels:{
              color:'#c4ced4',
              font: { size: 16, weight: 'bold' },
              usePointStyle: true,
              padding: 20
            },
            filter:(item,chart)=>!chart.data.datasets[item.datasetIndex].skipLegend
          },
          title:{
            display:true,
            text:'Home Run Pace Comparison',
            color:'#c4ced4',
            font:{size:24, weight: 'bold'}
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#222',
            titleColor: '#c4ced4',
            bodyColor: '#c4ced4',
            borderColor: 'var(--highlight)',
            borderWidth: 2,
            titleFont: { size: 16, weight: 'bold' },
            bodyFont: { size: 14 },
            padding: 12,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label}: ${context.parsed.y ?? ''}`;
              }
            }
          }
        },
        scales:{
          x:{ 
            title:{display:true,text:'Game Number',
                   color:'#c4ced4',font:{size:18,weight:'bold'}},
            ticks:{color:'#c4ced4',font:{size:14}},
            grid: { color: 'rgba(196,206,212,0.15)', lineWidth: 1.5 }
          },
          y:{ 
            beginAtZero:true, 
            title:{display:true,text:'Home Runs',
                   color:'#c4ced4',font:{size:18,weight:'bold'}},
            ticks:{color:'#c4ced4',font:{size:14}},
            grid: { color: 'rgba(196,206,212,0.15)', lineWidth: 1.5 },
            suggestedMax: yAxisMax
          }
        }
      },
      plugins: [calHeadshotPlugin],
      results // pass results for plugin access
    });
  }