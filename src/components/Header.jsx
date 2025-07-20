import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Trophy, Users, Star, Menu } from 'lucide-react'
import './Header.css'
import { spotracLinks } from '../utils/data'
import StatCard from './StatCard'
import Button from './Button'

const Header = ({ robberyCount, dollarPerDump, daysSinceDump, onPageChange }) => {
  const [humpyHover, setHumpyHover] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const calRefLink = spotracLinks['Cal Raleigh 2025'] || '#';

  // Calculate days since October 15, 2022
  const playoffDate = new Date('2022-10-15T00:00:00Z');
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSincePlayoff = Math.floor((today - playoffDate) / msPerDay);

  const isDivisionRacePage = location.pathname === '/division-race';
  const isBullpenPage = location.pathname === '/bullpen-overview';
  const isWildCardPage = location.pathname === '/wildcard-race';

  // Responsive: close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-content">
        <div className="hamburger-menu-btn">
          <button className="hamburger-btn" onClick={() => setMenuOpen(m => !m)} aria-label="Open navigation menu">
            <Menu size={28} />
          </button>
        </div>
        <nav className={`navigation-tabs${menuOpen ? ' open' : ''}`}>
          <Button 
            variant="nav"
            active={!isDivisionRacePage && !isBullpenPage && !isWildCardPage}
            onClick={() => navigate('/home')}
            icon={Home}
          >
            Home Run Tracker
          </Button>
          <Button 
            variant="nav"
            active={isDivisionRacePage}
            onClick={() => navigate('/division-race')}
            icon={Trophy}
          >
            Division Race
          </Button>
          <Button 
            variant="nav"
            active={isBullpenPage}
            onClick={() => navigate('/bullpen-overview')}
            icon={Users}
          >
            Bullpen Overview
          </Button>
          <Button 
            variant="nav"
            active={isWildCardPage}
            onClick={() => navigate('/wildcard-race')}
            icon={Star}
          >
            Wild Card Race
          </Button>
        </nav>
        

        
        <div className="header-stats-grid">
          <StatCard
            label="Dollar per Dump:"
            value={dollarPerDump}
            variant="dollar"
            href={calRefLink}
          />
          <StatCard
            label="Days since a Dump:"
            value={daysSinceDump}
            variant="days"
          />
          <StatCard
            label="Days since a playoff game:"
            value={daysSincePlayoff}
            variant="playoff"
          />
          <StatCard
            label="Times Humpy has been Robbed:"
            value={robberyCount}
            variant="robbery"
            onMouseEnter={() => setHumpyHover(true)}
            onMouseLeave={() => setHumpyHover(false)}
            onFocus={() => setHumpyHover(true)}
            onBlur={() => setHumpyHover(false)}
          />
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