import React from 'react'
import './ModeFilter.css'

const ModeFilter = ({ selectedMode, onModeChange }) => {
  const modes = [
    { id: 'historical', name: 'Historical Pace' },
    { id: 'current', name: 'Current Season' }
  ]

  const handleModeSelect = (modeId) => {
    onModeChange(modeId)
  }

  return (
    <div className="mode-filter">
      <div className="filter-header">
        <h3>Select Mode</h3>
      </div>
      <div className="filter-buttons">
        {modes.map(mode => (
          <button
            key={mode.id}
            className={`filter-btn ${selectedMode === mode.id ? 'active' : ''}`}
            onClick={() => handleModeSelect(mode.id)}
          >
            {mode.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ModeFilter 