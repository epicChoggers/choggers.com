import React from 'react'
import { ExternalLink } from 'lucide-react'
import './StatCard.css'

const StatCard = ({ 
  label, 
  value, 
  variant = 'default', 
  href, 
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  className = ''
}) => {
  const cardContent = (
    <>
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">
        {value}
        {href && <ExternalLink size={16} style={{ verticalAlign: 'middle', marginLeft: 4 }} />}
      </span>
    </>
  )

  const cardElement = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`stat-card stat-card-${variant} ${className}`}
      style={{ color: 'inherit', textDecoration: 'none' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {cardContent}
    </a>
  ) : (
    <div 
      className={`stat-card stat-card-${variant} ${className}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {cardContent}
    </div>
  )

  return cardElement
}

export default StatCard 