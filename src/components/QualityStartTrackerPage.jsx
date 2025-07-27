import React, { useState, useEffect } from 'react'
import Header from './Header'
import { fetchStartingPitchersQSData, fetchMarinersHomeGamesSinceOpeningDay, fetchSeasonStats, fetchHRData, mlbTeams } from '../utils/data'
import './QualityStartTrackerPage.css'

function QualityStartTrackerPage() {
  const [qsData, setQsData] = useState({ pitchers: [], lastUpdated: '', season: '' })
  const [robberyCount, setRobberyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(136) // Default to Mariners
  const [headerStats, setHeaderStats] = useState({
    dollarPerDump: 'N/A',
    daysSinceDump: 'N/A'
  })

  const handlePageChange = (page) => {
    // Navigation will be handled by React Router
    // This function is kept for compatibility but navigation is done via URL
  }

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch QS data, robbery count, and header stats
        const [data, robberyData, seasonStats, hrData] = await Promise.all([
          fetchStartingPitchersQSData(selectedTeam),
          fetchMarinersHomeGamesSinceOpeningDay(),
          fetchSeasonStats(),
          fetchHRData()
        ])
        
        setQsData(data)
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
            // Parse the date string and ensure it's treated as local date
            const [year, month, day] = lastHRGame.date.split('-').map(Number);
            const lastHRDate = new Date(year, month - 1, day); // month is 0-indexed
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
        console.error('Failed to initialize quality start tracker page:', err)
        setError('Failed to load quality start data. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }
    initializePage()
  }, [selectedTeam])

  const handleTeamChange = (event) => {
    setSelectedTeam(parseInt(event.target.value))
  }

  const getGameResultColor = (start) => {
    if (!start.isQualityStart) return '#808080' // Grey for no QS
    if (start.isWin) return '#4CAF50' // Green for QS + Win
    if (start.isLoss) return '#F44336' // Red for QS + Loss
    return '#808080' // Grey for QS but no clear win/loss
  }

  const getPitcherStatus = (pitcher, index) => {
    // No status indicators - return empty
    return { icon: '', color: 'transparent' }
  }

  const calculateTeamTotal = () => {
    return qsData.pitchers.reduce((total, pitcher) => total + pitcher.summary.totalStarts, 0)
  }

  if (loading && qsData.pitchers.length === 0) {
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
            <p>Loading quality start data...</p>
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
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        )}
        
        <div className="qs-tracker-container">
          <div className="qs-tracker-header">
            <div className="team-selector">
              <label htmlFor="team-select">Team:</label>
              <select 
                id="team-select" 
                value={selectedTeam} 
                onChange={handleTeamChange}
                className="team-dropdown"
              >
                {mlbTeams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="qs-legend">
              <div className="legend-item">
                <div className="legend-color qs-win"></div>
                <span>= QS + Team Win</span>
              </div>
              <div className="legend-item">
                <div className="legend-color qs-loss"></div>
                <span>= QS + Team Loss</span>
              </div>
              <div className="legend-item">
                <div className="legend-color no-qs"></div>
                <span>= No QS</span>
              </div>
            </div>
          </div>
          
          <div className="qs-tracker-main">
            <div className="qs-tracker-label">QS TRACKER</div>
            
                        <div className={`qs-tracker-columns players-${qsData.pitchers.length}`}>
              {qsData.pitchers.map((pitcher, index) => {
                const status = getPitcherStatus(pitcher, index)
                return (
                  <div key={pitcher.player.id} className="pitcher-column">
                    <div className="pitcher-headshot">
                      <div className="pitcher-avatar">
                        <img 
                          src={`https://midfield.mlbstatic.com/v1/people/${pitcher.player.id}/spots/120`}
                          alt={pitcher.player.name}
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div className="pitcher-fallback">
                          #{pitcher.player.jerseyNumber}
                        </div>
                      </div>
                    </div>
                    
                    <div className="qs-tracker-bar">
                      {pitcher.starts.map((start, startIndex) => (
                        <div
                          key={startIndex}
                          className="qs-segment"
                          style={{ backgroundColor: getGameResultColor(start) }}
                          title={`${start.date} vs ${start.opponent} - ${start.inningsPitched} IP, ${start.earnedRuns} ER`}
                        />
                      ))}
                    </div>
                    
                    <div className="pitcher-stats">
                      W:{pitcher.summary.qualityStartWins} L:{pitcher.summary.qualityStartLosses} T:{pitcher.summary.totalStarts}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default QualityStartTrackerPage 