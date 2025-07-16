// js/chart.js
export function plotHRPaceChart(results, summary) {
    const topOrder  = ['Cal Raleigh 2025','Aaron Judge 2025','Shohei Ohtani 2025'];
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
      const isCal = label === 'Cal Raleigh 2025';
      const color = isCal
        ? calGreen
        : colorPalette[i % colorPalette.length];
      const pointBackgroundColor = isCal ? calGreen : color;
      const pointBorderColor = isCal ? calGreen : color;
      // Debug output
      console.debug('Dataset:', label, {
        color,
        pointBackgroundColor,
        pointBorderColor
      });
      return {
        label,
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
  
    // projected pace for Cal Raleigh
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
  
    new Chart(document.getElementById('lineChart'), {
      type:'line',
      data:{ labels: Array.from({length:162},(_,i)=>i+1), datasets },
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
            suggestedMax: 80
          }
        }
      }
    });
  }