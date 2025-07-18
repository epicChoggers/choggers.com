import React from 'react'
import { ExternalLink } from 'lucide-react'
import { spotracLinks } from '../utils/data'
import './StatsTable.css'

const StatsTable = ({ data }) => {
  // Sort data alphabetically by label, but keep Cal Raleigh 2025 on top if present
  const topPlayer = 'Cal Raleigh 2025';
  let sortedData = [...data];
  const calIndex = sortedData.findIndex(row => row.label === topPlayer);
  if (calIndex !== -1) {
    const [calRow] = sortedData.splice(calIndex, 1);
    sortedData = [calRow, ...sortedData.sort((a, b) => a.label.localeCompare(b.label))];
  } else {
    sortedData = sortedData.sort((a, b) => a.label.localeCompare(b.label));
  }

  const formatNumber = (value, isRate = false) => {
    if (value === 'N/A') return 'N/A';
    if (isRate) {
      // Always show 3 decimal places for rate stats
      return Number(value).toFixed(3);
    }
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  return (
    <div className="stats-table-section">
      <div className="stat-block">
        <h2>Season Statistics</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>HR</th>
                <th>AVG</th>
                <th>OBP</th>
                <th>SLG</th>
                <th>OPS</th>
                <th>AB/HR</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={row.label} className={index === 0 ? 'highlighted-row' : ''}>
                  <td className="player-name">{row.label}</td>
                  <td>{formatNumber(row.HR)}</td>
                  <td>{formatNumber(row.AVG, true)}</td>
                  <td>{formatNumber(row.OBP, true)}</td>
                  <td>{formatNumber(row.SLG, true)}</td>
                  <td>{formatNumber(row.OPS, true)}</td>
                  <td>{formatNumber(row.AB_HR)}</td>
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
  );
}

export default StatsTable 