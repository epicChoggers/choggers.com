import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import './ChartSection.css'
import headshotUrl from '../assets/PlayerHeadshot.png'
import ModeFilter from './ModeFilter'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const ChartSection = ({ data, mode, loading, onModeChange }) => {
  // Load Cal Raleigh headshot
  React.useEffect(() => {
    const headshotImg = new Image()
    headshotImg.src = headshotUrl
    headshotImg.onload = () => {
      // Image loaded successfully
    }
    headshotImg.onerror = () => {
      console.warn('Failed to load Cal Raleigh headshot')
    }
  }, [])

  if (loading) {
    return (
      <div className="chart-section">
        <div className="stat-block">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading chart data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Process data to add projected data for Cal Raleigh
  const processedData = { ...data }
  
  // Find Cal Raleigh's current data
  const calRaleighKey = Object.keys(processedData.results).find(key => 
    key.includes('Cal Raleigh') && key.includes('2025')
  )
  
  // Add projection dataset if Cal Raleigh exists and mode is historical
  if (calRaleighKey && mode === 'historical') {
    const cal = data.summary.find(s => s.label === 'Cal Raleigh 2025')
    if (cal) {
      const calGamesPlayed = processedData.results[calRaleighKey].length
      const currentHR = processedData.results[calRaleighKey][calGamesPlayed - 1] || 0
      const marinersGamesPlayed = cal.teamGamesPlayed
      
      // Calculate how many games Cal can still play
      // If Mariners have played 95 games and Cal has played 93 games, he can play 162-95 = 67 more games
      const remainingGamesForCal = 162 - marinersGamesPlayed
      const maxGamesForCal = calGamesPlayed + remainingGamesForCal
      
      // Calculate Cal's HR pace (HR per game)
      const pace = currentHR / Math.max(1, calGamesPlayed)
      
      console.log('Cal Raleigh projection debug:', {
        calGamesPlayed,
        marinersGamesPlayed,
        currentHR,
        pace,
        remainingGamesForCal,
        maxGamesForCal
      })
      
      // Create projected data array extending to Cal's maximum possible games
      const proj = Array.from({ length: 162 }, (_, i) => {
        if (i < calGamesPlayed) return null // Before Cal's current games
        if (i >= maxGamesForCal) return null // Beyond Cal's maximum possible games
        return +(currentHR + pace * (i + 1 - calGamesPlayed)).toFixed(2)
      })
      
      // Add projected dataset
      processedData.results['Cal Raleigh 2025 Projected'] = proj
      
      console.log('Projected data sample:', proj.slice(calGamesPlayed, calGamesPlayed + 10))
    }
  }

  // Order datasets to put Cal Raleigh first, then the rest alphabetically
  const topOrder = ['Cal Raleigh 2025', 'Cal Raleigh 2025 Projected']
  const allLabels = Object.keys(processedData.results)
  const ordered = [
    ...topOrder.filter(l => allLabels.includes(l)),
    ...allLabels.filter(l => !topOrder.includes(l)).sort()
  ]

  // Create alphabetical color mapping for consistent colors
  const sortedLabels = [...allLabels].sort()
  const colorMap = {}
  
  // Extended color palette with 20+ unique colors - reorganized to avoid similar colors
  const colors = [
    '#005C5C', // Mariners green (Cal Raleigh)
    '#FF6B35', // Orange
    '#9370DB', // Medium Purple
    '#FFD700', // Gold
    '#DC143C', // Crimson
    '#20B2AA', // Light Sea Green
    '#FF69B4', // Hot Pink
    '#005C5C', // Mariners green (was Lime Green)
    '#8A2BE2', // Blue Violet
    '#FF8C00', // Dark Orange
    '#00CED1', // Dark Turquoise
    '#FF1493', // Deep Pink
    '#4169E1', // Royal Blue
    '#00FA9A', // Medium Spring Green
    '#FF4500', // Orange Red
    '#7B68EE', // Medium Slate Blue
    '#00BFFF', // Deep Sky Blue
    '#FF6347', // Tomato
    '#00FF7F', // Spring Green
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Mint
    '#FFEAA7', // Yellow
    '#DDA0DD'  // Plum
  ]
  
  // Assign colors alphabetically
  sortedLabels.forEach((label, index) => {
    colorMap[label] = colors[index % colors.length]
  })

  const chartData = {
    labels: Array.from({ length: Math.max(...Object.values(processedData.results).map(arr => arr.length)) }, (_, i) => i + 1),
    datasets: ordered.map((label, index) => {
      const isCalRaleigh = label.includes('Cal Raleigh')
      const isProjected = label.includes('Projected')
      
      // Mariners colors for Cal Raleigh
      const marinersColors = {
        primary: '#0C2C56',    // Mariners Navy Blue
        secondary: '#005C5C',  // Mariners Teal
        accent: '#C60C30'      // Mariners Red
      }
      
      const dataset = {
        label,
        data: processedData.results[label],
        borderColor: isCalRaleigh ? marinersColors.primary : colorMap[label],
        backgroundColor: isCalRaleigh ? marinersColors.primary + '20' : colorMap[label] + '20',
        borderWidth: isCalRaleigh ? 5 : 3,
        borderDash: isProjected ? [4, 4] : [],
        fill: false,
        tension: isProjected ? 0.25 : 0.4,
        pointRadius: 0, // Remove all data point dots from lines
        pointHoverRadius: isCalRaleigh ? 8 : 6,
        pointBackgroundColor: isCalRaleigh ? marinersColors.primary : colorMap[label],
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
      
      if (isProjected) {
        console.log('Projected dataset created:', label, dataset)
      }
      
      return dataset
    })
  }
  
  console.log('All datasets:', chartData.datasets.map(d => ({ label: d.label, dataLength: d.data.length })))

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
              legend: {
          position: 'top',
          labels: {
            color: '#c4ced4',
            font: {
              family: 'Roboto Mono',
              size: 12
            },
            usePointStyle: true,
            pointStyle: 'circle' // Keep dots in legend
          }
        },
      title: {
        display: true,
        text: mode === 'current' ? 'Current Season HR Leaders Pace' : 'Historical HR Pace Comparison',
        color: '#005C5C',
        font: {
          family: 'Roboto Mono',
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 20, 0.9)',
        titleColor: '#005C5C',
        bodyColor: '#c4ced4',
        borderColor: '#005C5C',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (context) => {
            return `Game ${context[0].label}`
          },
          label: (context) => {
            // This callback is called for each item, but we want to sort all items by HR count
            // So we sort in the itemSort callback below
            const label = context.dataset.label;
            const isProjected = label.includes('Projected');
            const suffix = isProjected ? ' (projected)' : '';
            return `${label}: ${context.parsed.y} HR${suffix}`;
          },
          itemSort: (a, b) => {
            // Sort by HR count (parsed.y) descending
            return b.parsed.y - a.parsed.y;
          }
        }
      },
      // Custom plugin to add Cal Raleigh headshot and asterisks for suspected steroid users
      customHeadshot: {
        id: 'customHeadshot',
        afterDraw: (chart) => {
          // Hide headshot if tooltip is active (user is hovering)
          if (chart.tooltip?._active?.length > 0) return;
          const ctx = chart.ctx
          
          // Draw Cal Raleigh headshot
          const calRaleighDataset = chart.data.datasets.find(dataset => 
            dataset.label === 'Cal Raleigh 2025'
          )
          
          if (calRaleighDataset) {
            const datasetIndex = chart.data.datasets.indexOf(calRaleighDataset)
            const meta = chart.getDatasetMeta(datasetIndex)
            
            // Find the last actual data point (not projected)
            const calData = processedData.results['Cal Raleigh 2025']
            const lastDataIndex = calData.length - 1
            
            if (lastDataIndex >= 0 && meta.data[lastDataIndex]) {
              const point = meta.data[lastDataIndex]
              const x = point.x
              const y = point.y
              
              // Draw headshot image
              const headshotImg = new window.Image()
              headshotImg.src = headshotUrl
              headshotImg.onload = () => {
                const size = 72 // Larger size like in the original code
                ctx.save()
                ctx.beginPath()
                ctx.arc(x, y, size/2, 0, 2 * Math.PI)
                ctx.clip()
                ctx.drawImage(headshotImg, x - size/2, y - size/2, size, size)
                ctx.restore()
              }
              // If already loaded, draw immediately
              if (headshotImg.complete) {
                const size = 72
                ctx.save()
                ctx.beginPath()
                ctx.arc(x, y, size/2, 0, 2 * Math.PI)
                ctx.clip()
                ctx.drawImage(headshotImg, x - size/2, y - size/2, size, size)
                ctx.restore()
              }
            }
          }
          
          // Draw asterisks for suspected steroid users
          const suspectedUsers = ['Barry Bonds 2001', 'Mark McGwire 1998', 'Sammy Sosa 1998']
          
          suspectedUsers.forEach(playerName => {
            const dataset = chart.data.datasets.find(d => d.label === playerName)
            if (dataset) {
              const datasetIndex = chart.data.datasets.indexOf(dataset)
              const meta = chart.getDatasetMeta(datasetIndex)
              
              // Find the last data point for this player
              const playerData = processedData.results[playerName]
              if (playerData && playerData.length > 0) {
                const lastDataIndex = playerData.length - 1
                if (meta.data[lastDataIndex]) {
                  const point = meta.data[lastDataIndex]
                  const x = point.x
                  const y = point.y
                  
                  // Draw asterisk
                  ctx.save()
                  ctx.fillStyle = dataset.borderColor
                  ctx.font = 'bold 16px Roboto Mono'
                  ctx.textAlign = 'center'
                  ctx.textBaseline = 'middle'
                  ctx.fillText('*', x + 15, y - 15) // Position asterisk to the right and above the line end
                  ctx.restore()
                }
              }
            }
          })
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Games Played',
          color: '#c4ced4',
          font: {
            family: 'Roboto Mono',
            size: 14
          }
        },
        ticks: {
          color: '#c4ced4',
          font: {
            family: 'Roboto Mono',
            size: 12
          }
        },
        grid: {
          color: 'rgba(196, 206, 212, 0.1)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Home Runs',
          color: '#c4ced4',
          font: {
            family: 'Roboto Mono',
            size: 14
          }
        },
        ticks: {
          color: '#c4ced4',
          font: {
            family: 'Roboto Mono',
            size: 12
          }
        },
        grid: {
          color: 'rgba(196, 206, 212, 0.1)'
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  return (
    <div className="chart-section">
      <ModeFilter 
        selectedMode={mode}
        onModeChange={onModeChange}
      />
      <div className="stat-block">
        <div className="chart-container">
          <Line data={chartData} options={options} plugins={[options.plugins.customHeadshot]} />
        </div>
      </div>
    </div>
  )
}

export default ChartSection 