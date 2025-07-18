import React, { useState } from 'react'
import { TrendingUp, Users, ExternalLink } from 'lucide-react'
import './Header.css'
import { spotracLinks } from '../utils/data'

const Header = ({ mode, robberyCount, onModeChange, dollarPerDump, daysSinceDump }) => {
  const [humpyHover, setHumpyHover] = useState(false);
  const handleToggle = () => {
    const newMode = mode === 'historical' ? 'current' : 'historical'
    onModeChange(newMode)
  }

  const calRefLink = spotracLinks['Cal Raleigh 2025'] || '#';

  // Calculate days since October 15, 2022
  const playoffDate = new Date('2022-10-15T00:00:00Z');
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSincePlayoff = Math.floor((today - playoffDate) / msPerDay);

  return (
    <header className="header">
      <div className="header-content">
        <div className="toggle-container toggle-center">
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={mode === 'current'}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="header-stats-grid">
          <div className="dollar-per-dump-header-block">
            <span className="dollar-per-dump-header-label">
              Dollar per Dump:
            </span>
            <span className="dollar-per-dump-header-value">
              <a
                href={calRefLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                {dollarPerDump} <ExternalLink size={16} style={{ verticalAlign: 'middle' }} />
              </a>
            </span>
          </div>
          <div className="days-since-dump-block">
            <span className="days-since-dump-label">Days since a Dump:</span>
            <span className="days-since-dump-value">{daysSinceDump}</span>
          </div>
          <div className="days-since-playoff-block">
            <span className="days-since-playoff-label">Days since a playoff game:</span>
            <span className="days-since-playoff-value">{daysSincePlayoff}</span>
          </div>
          <div className="countdown-display"
            onMouseEnter={() => setHumpyHover(true)}
            onMouseLeave={() => setHumpyHover(false)}
            onFocus={() => setHumpyHover(true)}
            onBlur={() => setHumpyHover(false)}
          >
            <span className="countdown-label">
              Times Humpy has been Robbed:
            </span>
            <span className="countdown-number">{robberyCount}</span>
          </div>
        </div>
        {humpyHover && (
          <div className="humpy-peek-fixed">
            <img
              src="/humpy.png"
              alt="Humpy peeking"
            />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 