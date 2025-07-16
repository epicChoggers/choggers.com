import React from 'react'
import { TrendingUp, Users } from 'lucide-react'
import './Header.css'
import humpyImage from '../assets/humpy.png'

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
            <div className="humpy-hover-container">
              <span className="countdown-label">Times Humpy has been Robbed:</span>
              <img 
                src={humpyImage} 
                alt="Humpy" 
                className="humpy-image"
              />
            </div>
            <span className="countdown-number">{robberyCount}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 