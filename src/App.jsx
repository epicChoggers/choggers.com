import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import ChartSection from './components/ChartSection'
import StatsTable from './components/StatsTable'
import { fetchHRData, fetchSeasonStats, fetchCurrentSeasonLeadersHRData, fetchMarinersHomeGamesSinceOpeningDay } from './utils/data'
import './App.css'

function App() {
  const [mode, setMode] = useState('historical')
  const [robberyCount, setRobberyCount] = useState(0)
  const [chartData, setChartData] = useState({ results: {}, summary: [] })
  const [statsData, setStatsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch initial data
        const [hrData, seasonStats, robberyData] = await Promise.all([
          fetchHRData(),
          fetchSeasonStats(),
          fetchMarinersHomeGamesSinceOpeningDay()
        ])
        
        setChartData(hrData)
        setStatsData(seasonStats)
        setRobberyCount(robberyData)
      } catch (err) {
        console.error('Failed to initialize app:', err)
        setError('Failed to load data. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleModeChange = async (newMode) => {
    try {
      setLoading(true)
      setError(null)
      
      if (newMode === 'current') {
        const data = await fetchCurrentSeasonLeadersHRData()
        setChartData(data)
      } else {
        const data = await fetchHRData()
        setChartData(data)
      }
      
      setMode(newMode)
    } catch (err) {
      console.error('Failed to switch mode:', err)
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Find Cal Raleigh 2025's DollarPerHR value for the header
  const cal = statsData.find(row => row && row.label === 'Cal Raleigh 2025');
  const dollarPerDump = cal && cal.DollarPerHR !== 'N/A'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cal.DollarPerHR)
    : 'N/A';

  if (loading && chartData.summary.length === 0) {
    return (
      <div className="app">
        <Header 
          mode={mode} 
          robberyCount={robberyCount}
          onModeChange={handleModeChange}
        />
        <main className="content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading baseball data...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        mode={mode} 
        robberyCount={robberyCount}
        onModeChange={handleModeChange}
        dollarPerDump={dollarPerDump}
      />
      <main className="content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        )}
        
        <ChartSection 
          data={chartData} 
          mode={mode}
          loading={loading}
        />
        
        {statsData.length > 0 && (
          <StatsTable data={statsData} />
        )}
      </main>
    </div>
  )
}

export default App 