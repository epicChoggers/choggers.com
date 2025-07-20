import React from 'react'
import './BullpenOverviewSection.css'

const BullpenOverviewSection = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bullpen-section">
        <div className="stat-block">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading bullpen data...</p>
          </div>
        </div>
      </div>
    )
  }

  const { pitchers, period, error } = data

  if (error) {
    return (
      <div className="bullpen-section">
        <div className="stat-block">
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (pitchers.length === 0) {
    return (
      <div className="bullpen-section">
        <div className="stat-block">
          <div className="no-data-message">
            <p>No bullpen data available for the selected period.</p>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const formatInnings = (innings) => {
    const whole = Math.floor(innings)
    const fraction = innings - whole
    if (fraction === 0) return `${whole}.0`
    if (fraction === 0.33) return `${whole}.1`
    if (fraction === 0.67) return `${whole}.2`
    return `${whole}.${Math.round(fraction * 10)}`
  }

  const calculateERA = (earnedRuns, innings) => {
    if (innings === 0) return '0.00'
    return ((earnedRuns * 9) / innings).toFixed(2)
  }

  const calculateWHIP = (walks, hits, innings) => {
    if (innings === 0) return '0.00'
    return (((walks + hits) / innings)).toFixed(2)
  }

  // Calculate summary stats
  const totalOutings = pitchers.reduce((sum, pitcher) => sum + pitcher.summary.totalOutings, 0)
  const totalInnings = pitchers.reduce((sum, pitcher) => sum + pitcher.summary.totalInnings, 0)
  const totalPitches = pitchers.reduce((sum, pitcher) => sum + pitcher.summary.totalPitches, 0)

  return (
    <div className="bullpen-section">
      <div className="section-header">
        <h2>Bullpen Overview</h2>
        <p className="period-info">{period}</p>
      </div>
      
      <div className="bullpen-summary">
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-label">Active Relievers:</span>
            <span className="stat-value">{pitchers.length}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Outings:</span>
            <span className="stat-value">{totalOutings}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Innings:</span>
            <span className="stat-value">{formatInnings(totalInnings)}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Pitches:</span>
            <span className="stat-value">{totalPitches}</span>
          </div>
        </div>
      </div>

      <div className="spreadsheet-container">
        <div className="spreadsheet-header">
          <h3>Relief Pitcher Usage</h3>
        </div>
        
        <div className="table-container">
          <table className="bullpen-table">
            <thead>
              <tr>
                <th>Pitcher</th>
                <th>Outings</th>
                <th>IP</th>
                <th>ERA</th>
                <th>WHIP</th>
                <th>K/9</th>
                <th>BB/9</th>
                <th>Pitches</th>
                <th>Holds</th>
                <th>Saves</th>
                <th>Blown</th>
              </tr>
            </thead>
            <tbody>
              {pitchers.map((pitcher) => (
                <tr key={pitcher.player.id} className="pitcher-row">
                  <td className="pitcher-name">
                    #{pitcher.player.jerseyNumber} {pitcher.player.name}
                  </td>
                  <td>{pitcher.summary.totalOutings}</td>
                  <td>{formatInnings(pitcher.summary.totalInnings)}</td>
                  <td>{calculateERA(pitcher.summary.totalEarnedRuns, pitcher.summary.totalInnings)}</td>
                  <td>{calculateWHIP(pitcher.summary.totalWalks, pitcher.summary.totalHits, pitcher.summary.totalInnings)}</td>
                  <td>
                    {pitcher.summary.totalInnings > 0 
                      ? ((pitcher.summary.totalStrikeouts * 9) / pitcher.summary.totalInnings).toFixed(1)
                      : '0.0'
                    }
                  </td>
                  <td>
                    {pitcher.summary.totalInnings > 0 
                      ? ((pitcher.summary.totalWalks * 9) / pitcher.summary.totalInnings).toFixed(1)
                      : '0.0'
                    }
                  </td>
                  <td>{pitcher.summary.totalPitches}</td>
                  <td>{pitcher.summary.totalHolds}</td>
                  <td>{pitcher.summary.totalSaves}</td>
                  <td>{pitcher.summary.totalBlownSaves}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="outings-details">
          <h3>Recent Outings</h3>
          <div className="outings-table-container">
            <table className="outings-table">
              <thead>
                <tr>
                  <th>Pitcher</th>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th>IP</th>
                  <th>Pitches</th>
                  <th>Strikes</th>
                  <th>Strike %</th>
                  <th>K</th>
                  <th>BB</th>
                  <th>H</th>
                  <th>R</th>
                  <th>ER</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Flatten all outings with pitcher info
                  const allOutings = pitchers.flatMap((pitcher) =>
                    pitcher.recentOutings.map((outing, index) => ({
                      pitcher,
                      outing,
                      key: `${pitcher.player.id}-${outing.date}-${index}`
                    }))
                  );
                  // Sort by date descending, then by appearanceIndex ascending (true bullpen order)
                  allOutings.sort((a, b) => {
                    const dateDiff = new Date(b.outing.date) - new Date(a.outing.date);
                    if (dateDiff !== 0) return dateDiff;
                    // If same date, sort by appearanceIndex ascending
                    return (a.outing.appearanceIndex ?? 99) - (b.outing.appearanceIndex ?? 99);
                  });
                  return allOutings.map(({ pitcher, outing, key }) => (
                    <tr key={key} className="outing-row">
                      <td className="pitcher-name">
                        #{pitcher.player.jerseyNumber} {pitcher.player.name}
                      </td>
                      <td>{formatDate(outing.date)}</td>
                      <td>{outing.opponent}</td>
                      <td>{formatInnings(outing.inningsPitched)}</td>
                      <td>{outing.pitches}</td>
                      <td>{outing.strikes}</td>
                      <td>{outing.strikePercentage !== null && outing.strikePercentage !== undefined ? (outing.strikePercentage * 100).toFixed(0) + '%' : ''}</td>
                      <td>{outing.strikeouts}</td>
                      <td>{outing.walks}</td>
                      <td>{outing.hits}</td>
                      <td>{outing.runs}</td>
                      <td>{outing.earnedRuns}</td>
                      <td className="outing-result">
                        {outing.holds > 0 && <span className="hold" title="Hold">H</span>}
                        {outing.saves > 0 && <span className="save" title="Save">S</span>}
                        {outing.blownSaves > 0 && <span className="blown" title="Blown Save">BS</span>}
                        {outing.wins > 0 && <span className="win" title="Win">W</span>}
                        {outing.losses > 0 && <span className="loss" title="Loss">L</span>}
                        {!outing.holds && !outing.saves && !outing.blownSaves && !outing.wins && !outing.losses && 
                          <span className="appearance" title="Appearance (no decision)">A</span>
                        }
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BullpenOverviewSection 