import React from 'react'
import './Button.css'

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'medium', 
  active = false, 
  onClick, 
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    active ? 'button--active' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button 
      className={buttonClasses} 
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={16} />}
      {children && <span>{children}</span>}
    </button>
  )
}

export default Button 