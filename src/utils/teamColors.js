// MLB Team Colors Library
export const teamColors = {
  // AL East
  'Yankees': {
    primary: '#0C2340',    // Yankees Navy
    secondary: '#FFFFFF',   // White
    accent: '#C60C30'       // Yankees Red
  },
  'Red Sox': {
    primary: '#BD3039',     // Red Sox Red
    secondary: '#0C2340',   // Navy
    accent: '#FFFFFF'       // White
  },
  'Rays': {
    primary: '#092C5C',     // Rays Navy
    secondary: '#8FBCE6',   // Light Blue
    accent: '#F5D130'       // Gold
  },
  'Orioles': {
    primary: '#DF4601',     // Orioles Orange
    secondary: '#000000',   // Black
    accent: '#FFFFFF'       // White
  },
  'Blue Jays': {
    primary: '#134A8E',     // Blue Jays Blue
    secondary: '#E8291C',   // Red
    accent: '#FFFFFF'       // White
  },

  // AL Central
  'Royals': {
    primary: '#174885',     // Royals Blue
    secondary: '#C09A5B',   // Gold
    accent: '#FFFFFF'       // White
  },
  'Twins': {
    primary: '#002B5C',     // Twins Navy
    secondary: '#D31145',   // Red
    accent: '#FFFFFF'       // White
  },
  'Guardians': {
    primary: '#E31937',     // Guardians Red
    secondary: '#0C2340',   // Navy
    accent: '#FFFFFF'       // White
  },
  'White Sox': {
    primary: '#27251F',     // Black
    secondary: '#FFFFFF',   // White
    accent: '#C8102E'       // Red
  },
  'Tigers': {
    primary: '#0C2340',     // Tigers Navy
    secondary: '#FA4616',   // Orange
    accent: '#FFFFFF'       // White
  },

  // AL West
  'Mariners': {
    primary: '#0C2C56',     // Mariners Navy
    secondary: '#005C5C',   // Teal
    accent: '#C60C30'       // Red
  },
  'Rangers': {
    primary: '#C0111F',     // Rangers Red
    secondary: '#003278',   // Blue
    accent: '#FFFFFF'       // White
  },
  'Astros': {
    primary: '#002D62',     // Astros Navy
    secondary: '#EB6E1F',   // Orange
    accent: '#FFFFFF'       // White
  },
  'Athletics': {
    primary: '#003831',     // Athletics Green
    secondary: '#EFB21E',   // Gold
    accent: '#FFFFFF'       // White
  },
  'Angels': {
    primary: '#BA0021',     // Angels Red
    secondary: '#003263',   // Navy
    accent: '#FFFFFF'       // White
  },

  // NL East
  'Mets': {
    primary: '#002D72',     // Mets Blue
    secondary: '#FF5910',   // Orange
    accent: '#FFFFFF'       // White
  },
  'Nationals': {
    primary: '#AB0003',     // Nationals Red
    secondary: '#14225A',   // Navy
    accent: '#FFFFFF'       // White
  },
  'Braves': {
    primary: '#CE1141',     // Braves Red
    secondary: '#13274F',   // Navy
    accent: '#FFFFFF'       // White
  },
  'Phillies': {
    primary: '#E81828',     // Phillies Red
    secondary: '#003087',   // Blue
    accent: '#FFFFFF'       // White
  },
  'Marlins': {
    primary: '#00A3E0',     // Marlins Blue
    secondary: '#FF6600',   // Orange
    accent: '#000000'       // Black
  },

  // NL Central
  'Cubs': {
    primary: '#0E3386',     // Cubs Blue
    secondary: '#CC3433',   // Red
    accent: '#FFFFFF'       // White
  },
  'Brewers': {
    primary: '#12284B',     // Brewers Navy
    secondary: '#FFC52F',   // Gold
    accent: '#FFFFFF'       // White
  },
  'Cardinals': {
    primary: '#C41E3A',     // Cardinals Red
    secondary: '#0C2340',   // Navy
    accent: '#FFFFFF'       // White
  },
  'Pirates': {
    primary: '#FDB827',     // Pirates Gold
    secondary: '#000000',   // Black
    accent: '#FFFFFF'       // White
  },
  'Reds': {
    primary: '#C6011F',     // Reds Red
    secondary: '#000000',   // Black
    accent: '#FFFFFF'       // White
  },

  // NL West
  'Dodgers': {
    primary: '#005A9C',     // Dodgers Blue
    secondary: '#EF3E42',   // Red
    accent: '#FFFFFF'       // White
  },
  'Giants': {
    primary: '#FD5A1E',     // Giants Orange
    secondary: '#000000',   // Black
    accent: '#FFFFFF'       // White
  },
  'Rockies': {
    primary: '#33006F',     // Rockies Purple
    secondary: '#C4CED4',   // Silver
    accent: '#FFFFFF'       // White
  },
  'Padres': {
    primary: '#2F241D',     // Padres Brown
    secondary: '#FFC425',   // Gold
    accent: '#FFFFFF'       // White
  },
  'Diamondbacks': {
    primary: '#A71930',     // Diamondbacks Red
    secondary: '#E3D4AD',   // Sand
    accent: '#000000'       // Black
  }
}

// Get team color for chart display
export const getTeamColor = (teamName) => {
  const colors = teamColors[teamName]
  if (colors) {
    return colors.primary
  }
  // Fallback colors if team not found
  return '#666666'
}

// Common team name variations that might come from the API
const teamNameVariations = {
  'New York Yankees': 'Yankees',
  'Boston Red Sox': 'Red Sox',
  'Tampa Bay Rays': 'Rays',
  'Baltimore Orioles': 'Orioles',
  'Toronto Blue Jays': 'Blue Jays',
  'Kansas City Royals': 'Royals',
  'Minnesota Twins': 'Twins',
  'Cleveland Guardians': 'Guardians',
  'Chicago White Sox': 'White Sox',
  'Detroit Tigers': 'Tigers',
  'Seattle Mariners': 'Mariners',
  'Texas Rangers': 'Rangers',
  'Houston Astros': 'Astros',
  'Oakland Athletics': 'Athletics',
  'Los Angeles Angels': 'Angels',
  'New York Mets': 'Mets',
  'Washington Nationals': 'Nationals',
  'Atlanta Braves': 'Braves',
  'Philadelphia Phillies': 'Phillies',
  'Miami Marlins': 'Marlins',
  'Chicago Cubs': 'Cubs',
  'Milwaukee Brewers': 'Brewers',
  'St. Louis Cardinals': 'Cardinals',
  'Pittsburgh Pirates': 'Pirates',
  'Cincinnati Reds': 'Reds',
  'Los Angeles Dodgers': 'Dodgers',
  'San Francisco Giants': 'Giants',
  'Colorado Rockies': 'Rockies',
  'San Diego Padres': 'Padres',
  'Arizona Diamondbacks': 'Diamondbacks'
}

// Get team colors for chart display
export const getTeamColors = (teamName) => {
  console.log('Looking for team colors for:', teamName);
  
  // Try exact match first
  let colors = teamColors[teamName];
  
  // If no exact match, try the variations mapping
  if (!colors && teamNameVariations[teamName]) {
    const mappedName = teamNameVariations[teamName];
    console.log(`Mapped "${teamName}" to "${mappedName}"`);
    colors = teamColors[mappedName];
  }
  
  // If still no match, try to find by partial name matching
  if (!colors) {
    const normalizedTeamName = teamName.toLowerCase().replace(/[^a-z]/g, '');
    
    for (const [key, value] of Object.entries(teamColors)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, '');
      
      if (normalizedTeamName.includes(normalizedKey) || normalizedKey.includes(normalizedTeamName)) {
        console.log(`Found color match: "${teamName}" matches "${key}"`);
        colors = value;
        break;
      }
    }
  }
  
  if (colors) {
    console.log(`Using colors for ${teamName}:`, colors.primary);
    return {
      borderColor: colors.secondary || colors.primary,
      borderWidth: 4,
      backgroundColor: colors.primary + '20',
      pointBackgroundColor: colors.primary,
      pointBorderColor: colors.secondary || '#FFFFFF'
    }
  }
  
  // Fallback colors if team not found
  console.log(`No colors found for ${teamName}, using fallback`);
  return {
    borderColor: '#666666',
    backgroundColor: '#66666620',
    pointBackgroundColor: '#666666',
    pointBorderColor: '#FFFFFF'
  }
} 