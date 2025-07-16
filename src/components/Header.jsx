import React from 'react'
import { TrendingUp, Users } from 'lucide-react'
import './Header.css'

const Header = ({ mode, robberyCount, onModeChange }) => {
  const handleToggle = () => {
    const newMode = mode === 'historical' ? 'current' : 'historical'
    onModeChange(newMode)
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="toggle-container">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={mode === 'current'}
                onChange={handleToggle}
              />
              <span className="slider"></span>
            </label>
            <span className="toggle-label">
              {mode === 'current' ? 'Current Season HR Leaders' : 'Historical HR Pace'}
            </span>
          </div>
        </div>
        
        <div className="header-title">
          <span className="title-icon">🍑</span>
          Dumpy Tracker
          <span className="title-icon">🚛</span>
        </div>
        
        <div className="header-right">
          <div className="countdown-display">
            <span className="countdown-label">Times Humpy has been Robbed:</span>
            <span className="countdown-number">{robberyCount}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 