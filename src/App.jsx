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
  const [daysSinceDump, setDaysSinceDump] = useState('N/A')

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

        // Calculate days since last home run for Cal Raleigh 2025 (historical mode)
        if (hrData.calRaleighGameLog && hrData.calRaleighGameLog.length > 0) {
          const sortedLog = [...hrData.calRaleighGameLog].sort((a, b) => new Date(b.date) - new Date(a.date));
          const lastHRGame = sortedLog.find(g => g.homeRuns > 0);
          if (lastHRGame && lastHRGame.date) {
            const lastHRDate = new Date(lastHRGame.date);
            const today = new Date();
            lastHRDate.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            const msPerDay = 1000 * 60 * 60 * 24;
            const days = Math.floor((today - lastHRDate) / msPerDay);
            setDaysSinceDump(days);
          } else {
            setDaysSinceDump('N/A');
          }
        } else {
          setDaysSinceDump('N/A')
        }
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
        // Try to find Cal Raleigh in the current leaders
        const calKey = Object.keys(data.results).find(label => label.startsWith('Cal Raleigh'))
        if (calKey) {
          // Build a game log with date and homeRuns for Cal Raleigh
          const playerIdx = Object.keys(data.results).indexOf(calKey)
          // The API doesn't return dates in the results, so we need to fetch the splits for Cal Raleigh
          // We'll fetch the game log for the current year for Cal Raleigh (id: 663728)
          try {
            const url = `https://statsapi.mlb.com/api/v1/people/663728/stats?stats=gameLog&season=${new Date().getFullYear()}&group=hitting`
            const res = await fetch(url)
            if (res.ok) {
              const json = await res.json()
              const games = (json.stats[0]?.splits || []);
              const sortedGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date));
              const lastHRGame = sortedGames.find(g => Number(g.stat.homeRuns || 0) > 0);
              if (lastHRGame && lastHRGame.date) {
                const lastHRDate = new Date(lastHRGame.date);
                const today = new Date();
                lastHRDate.setHours(0,0,0,0);
                today.setHours(0,0,0,0);
                const msPerDay = 1000 * 60 * 60 * 24;
                const days = Math.floor((today - lastHRDate) / msPerDay);
                setDaysSinceDump(days);
              } else {
                setDaysSinceDump('N/A');
              }
            } else {
              setDaysSinceDump('N/A')
            }
          } catch {
            setDaysSinceDump('N/A')
          }
        } else {
          setDaysSinceDump('N/A')
        }
      } else {
        const data = await fetchHRData()
        setChartData(data)
        // Use Cal Raleigh 2025's log
        if (data.calRaleighGameLog && data.calRaleighGameLog.length > 0) {
          const sortedLog = [...data.calRaleighGameLog].sort((a, b) => new Date(b.date) - new Date(a.date));
          const lastHRGame = sortedLog.find(g => g.homeRuns > 0);
          if (lastHRGame && lastHRGame.date) {
            const lastHRDate = new Date(lastHRGame.date);
            const today = new Date();
            lastHRDate.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            const msPerDay = 1000 * 60 * 60 * 24;
            const days = Math.floor((today - lastHRDate) / msPerDay);
            setDaysSinceDump(days);
          } else {
            setDaysSinceDump('N/A');
          }
        } else {
          setDaysSinceDump('N/A');
        }
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
        daysSinceDump={daysSinceDump}
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