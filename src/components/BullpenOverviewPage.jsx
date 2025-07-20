import React, { useState, useEffect } from 'react'
import Header from './Header'
import BullpenOverviewSection from './BullpenOverviewSection'
import BullpenPeriodSlider from './BullpenPeriodToggle'
import { fetchBullpenOverview, fetchMarinersHomeGamesSinceOpeningDay, fetchTeamGamesPlayed, fetchSeasonStats, fetchHRData } from '../utils/data'

function BullpenOverviewPage() {
  const [bullpenData, setBullpenData] = useState({ pitchers: [], period: 'Last 7 days' })
  const [robberyCount, setRobberyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [headerStats, setHeaderStats] = useState({
    dollarPerDump: 'N/A',
    daysSinceDump: 'N/A'
  })
  const [period, setPeriod] = useState(7)
  const [maxGames, setMaxGames] = useState(162)

  const handlePageChange = (page) => {
    // Navigation will be handled by React Router
    // This function is kept for compatibility but navigation is done via URL
  }

  useEffect(() => {
    // Fetch total games played for Mariners (teamId 136, current season)
    const fetchGames = async () => {
      try {
        const games = await fetchTeamGamesPlayed(136, new Date().getFullYear())
        setMaxGames(games > 0 ? games : 162)
      } catch {
        setMaxGames(162)
      }
    }
    fetchGames()
  }, [])

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true)
        setError(null)
        // Fetch bullpen data, robbery count, and header stats
        const [data, robberyData, seasonStats, hrData] = await Promise.all([
          fetchBullpenOverview(period),
          fetchMarinersHomeGamesSinceOpeningDay(),
          fetchSeasonStats(),
          fetchHRData()
        ])
        setBullpenData(data)
        setRobberyCount(robberyData)
        // Calculate header stats for Cal Raleigh 2025
        const cal = seasonStats.find(row => row && row.label === 'Cal Raleigh 2025');
        const dollarPerDump = cal && cal.DollarPerHR !== 'N/A'
          ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cal.DollarPerHR)
          : 'N/A';
        // Calculate days since last home run for Cal Raleigh 2025
        let daysSinceDump = 'N/A';
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
            daysSinceDump = days;
          }
        }
        setHeaderStats({
          dollarPerDump,
          daysSinceDump
        })
      } catch (err) {
        console.error('Failed to initialize bullpen overview page:', err)
        setError('Failed to load bullpen data. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }
    initializePage()
  }, [period])

  if (loading && bullpenData.pitchers.length === 0) {
    return (
      <div className="app">
        <Header 
          robberyCount={robberyCount}
          dollarPerDump={headerStats.dollarPerDump}
          daysSinceDump={headerStats.daysSinceDump}
          onPageChange={handlePageChange}
        />
        <main className="content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading bullpen data...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <Header 
        robberyCount={robberyCount}
        dollarPerDump={headerStats.dollarPerDump}
        daysSinceDump={headerStats.daysSinceDump}
        onPageChange={handlePageChange}
      />
      <main className="content">
        <BullpenPeriodSlider period={period} onChange={setPeriod} maxGames={maxGames} />
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        )}
        
        <BullpenOverviewSection 
          data={bullpenData} 
          loading={loading}
        />
      </main>
    </div>
  )
}

export default BullpenOverviewPage 