import React from 'react'
import { ExternalLink } from 'lucide-react'
import { spotracLinks } from '../utils/data'
import './StatsTable.css'

const StatsTable = ({ data }) => {
  const formatCurrency = (value) => {
    if (value === 'N/A') return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatNumber = (value) => {
    if (value === 'N/A') return 'N/A'
    return typeof value === 'number' ? value.toLocaleString() : value
  }

  return (
    <div className="stats-table-section">
      <div className="stat-block">
        <h2>Season Statistics</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>AVG</th>
                <th>OBP</th>
                <th>SLG</th>
                <th>OPS</th>
                <th>AB/HR</th>
                <th>Salary</th>
                <th>$/HR</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={row.label} className={index === 0 ? 'highlighted-row' : ''}>
                  <td className="player-name">{row.label}</td>
                  <td>{formatNumber(row.AVG)}</td>
                  <td>{formatNumber(row.OBP)}</td>
                  <td>{formatNumber(row.SLG)}</td>
                  <td>{formatNumber(row.OPS)}</td>
                  <td>{formatNumber(row.AB_HR)}</td>
                  <td className="salary">{formatCurrency(row.Salary)}</td>
                  <td className="dollar-per-hr">
                    {row.DollarPerHR === 'N/A' ? 'N/A' : formatCurrency(row.DollarPerHR)}
                  </td>
                  <td>
                    {spotracLinks[row.label] && (
                      <a 
                        href={spotracLinks[row.label]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StatsTable 