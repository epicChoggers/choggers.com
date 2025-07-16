# 🍑 Dumpy Tracker 🚛

A modern React-based baseball statistics tracker that compares home run paces across different seasons and players.

## Features

- **Historical HR Pace Comparison**: Compare current players against legendary seasons
- **Current Season Leaders**: Real-time tracking of current season home run leaders
- **Mariners Home Games Counter**: Track how many times "Humpy has been robbed"
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Modern UI**: Built with React, Vite, and Chart.js for optimal performance

## Tech Stack

- **React 18** - Modern component-based UI
- **Vite** - Fast build tool and development server
- **Chart.js** - Interactive data visualization
- **Lucide React** - Beautiful icons
- **MLB Stats API** - Real-time baseball data

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd choggers.com
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploying to GitHub Pages

To deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # App header with toggle and robbery counter
│   ├── ChartSection.jsx # Chart display component
│   ├── StatsTable.jsx  # Statistics table component
│   └── *.css          # Component-specific styles
├── utils/
│   └── data.js        # Data fetching and API utilities
├── App.jsx            # Main app component
├── App.css            # App-level styles
├── main.jsx           # React entry point
└── index.css          # Global styles
```

### Key Features

- **Toggle Switch**: Switch between historical and current season data
- **Interactive Charts**: Hover for detailed information
- **Responsive Tables**: Scrollable on mobile devices
- **Error Handling**: Graceful fallbacks for API failures
- **Caching**: Efficient data caching to reduce API calls

## API Integration

The app integrates with the MLB Stats API to fetch:
- Player statistics and game logs
- Current season leaders
- Team schedules and game counts
- Historical season data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
