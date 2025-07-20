import React from 'react'
import Button from './Button'
import './ModeToggle.css'

const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div className="mode-toggle-container">
      <div className="mode-toggle">
        <Button
          variant="toggle"
          active={mode === 'historical'}
          onClick={() => onModeChange('historical')}
        >
          Historical Pace
        </Button>
        <Button
          variant="toggle"
          active={mode === 'current'}
          onClick={() => onModeChange('current')}
        >
          Current Season
        </Button>
      </div>
    </div>
  )
}

export default ModeToggle 