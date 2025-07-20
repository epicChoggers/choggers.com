import React from 'react';
import './ModeFilter.css';

const BullpenPeriodSlider = ({ period, onChange, maxGames }) => {
  return (
    <div className="division-filter">
      <div className="filter-header">
        <h3>Select Period</h3>
      </div>
      <div className="slider-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <label htmlFor="bullpen-period-slider" style={{ color: 'var(--mariners-silver)', fontFamily: 'Roboto Mono', fontSize: 14, marginBottom: 8 }}>
          Last <span style={{ color: 'var(--mariners-teal)', fontWeight: 'bold' }}>{period}</span> game{period === 1 ? '' : 's'}
        </label>
        <input
          id="bullpen-period-slider"
          type="range"
          min={1}
          max={maxGames}
          value={period}
          onChange={e => onChange(Number(e.target.value))}
          style={{ width: '80%', accentColor: 'var(--mariners-teal)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', fontSize: 12, color: 'var(--mariners-silver)' }}>
          <span>1</span>
          <span>{maxGames}</span>
        </div>
      </div>
    </div>
  );
};

export default BullpenPeriodSlider; 