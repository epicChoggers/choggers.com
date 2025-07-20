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
import DivisionFilter from './DivisionFilter'
import { getTeamColors } from '../utils/teamColors'

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

const DivisionRaceSection = ({ data, loading }) => {
  const [selectedDivision, setSelectedDivision] = React.useState('AL West')
  if (loading) {
    return (
      <div className="chart-section">
        <div className="stat-block">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading division race data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Process data to group by division
  const processedData = { ...data }
  
  // Filter data based on selected division
  const filteredResults = {}
  Object.entries(processedData.results).forEach(([label, data]) => {
    const division = label.match(/\((.*?)\)/)?.[1]
    if (selectedDivision === 'all' || (division && division === selectedDivision)) {
      filteredResults[label] = data
    }
  })
  
  // Create color mapping for teams using official team colors
  const allLabels = Object.keys(filteredResults)
  const sortedLabels = [...allLabels].sort()

  // Group teams by division for better organization
  const divisionGroups = {
    'AL East': [],
    'AL Central': [],
    'AL West': [],
    'NL East': [],
    'NL Central': [],
    'NL West': []
  }

  allLabels.forEach(label => {
    const division = label.match(/\((.*?)\)/)?.[1]
    if (division && divisionGroups[division]) {
      divisionGroups[division].push(label)
    }
  })

  // Create datasets with division grouping
  const datasets = []
  Object.entries(divisionGroups).forEach(([division, teams]) => {
    teams.forEach(label => {
      const teamName = label.split(' (')[0] // Extract team name from label
      console.log('Processing team:', teamName, 'from label:', label);
      const teamColors = getTeamColors(teamName)
      const isMariners = label.includes('Mariners')
      
      const dataset = {
        label,
        data: filteredResults[label],
        borderColor: teamColors.borderColor,
        backgroundColor: teamColors.backgroundColor,
        borderWidth: isMariners ? 5 : 3,
        borderDash: [],
        fill: false,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: isMariners ? 8 : 6,
        pointBackgroundColor: teamColors.pointBackgroundColor,
        pointBorderColor: teamColors.pointBorderColor,
        pointBorderWidth: 2
      }
      
      datasets.push(dataset)
    })
  })

  const chartData = {
    labels: Array.from({ length: Math.max(...Object.values(filteredResults).map(arr => arr.length)) }, (_, i) => i + 1),
    datasets
  }

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
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Division Race - Wins Progression',
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
            const label = context.dataset.label;
            return `${label}: ${context.parsed.y} wins`;
          },
          itemSort: (a, b) => {
            // Sort by wins count (parsed.y) descending
            return b.parsed.y - a.parsed.y;
          }
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
          text: 'Wins',
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

  // Show message if no teams are selected
  if (datasets.length === 0) {
    return (
      <div className="chart-section">
        <DivisionFilter 
          selectedDivision={selectedDivision}
          onDivisionChange={setSelectedDivision}
        />
        <div className="stat-block">
          <div className="no-data-message">
            <p>No teams selected. Please select at least one division to view the chart.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-section">
      <DivisionFilter 
        selectedDivision={selectedDivision}
        onDivisionChange={setSelectedDivision}
      />
      <div className="stat-block">
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}

export default DivisionRaceSection 