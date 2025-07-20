import React from 'react'
import './DivisionFilter.css'

const DivisionFilter = ({ selectedDivision, onDivisionChange }) => {
  const divisions = [
    { id: 'all', name: 'All Divisions' },
    { id: 'AL East', name: 'AL East' },
    { id: 'AL Central', name: 'AL Central' },
    { id: 'AL West', name: 'AL West' },
    { id: 'NL East', name: 'NL East' },
    { id: 'NL Central', name: 'NL Central' },
    { id: 'NL West', name: 'NL West' }
  ]

  const handleDivisionSelect = (divisionId) => {
    onDivisionChange(divisionId)
  }

  return (
    <div className="division-filter">
      <div className="filter-header">
        <h3>Select Division</h3>
      </div>
      <div className="filter-buttons">
        {divisions.map(division => (
          <button
            key={division.id}
            className={`filter-btn ${selectedDivision === division.id ? 'active' : ''}`}
            onClick={() => handleDivisionSelect(division.id)}
          >
            {division.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DivisionFilter 