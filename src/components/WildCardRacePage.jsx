import React, { useState, useEffect } from 'react'
import Header from './Header'
import { fetchWildCardRaceData, fetchMarinersHomeGamesSinceOpeningDay } from '../utils/data'
import ChartSection from './ChartSection'

function WildCardRacePage() {
  const [wildCardData, setWildCardData] = useState({ results: {}, summary: [] })
  const [robberyCount, setRobberyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initializePage = async () => {
      try {
        setLoading(true)
        setError(null)
        const [data, robberyData] = await Promise.all([
          fetchWildCardRaceData(),
          fetchMarinersHomeGamesSinceOpeningDay()
        ])
        setWildCardData(data)
        setRobberyCount(robberyData)
      } catch (err) {
        setError('Failed to load wild card race data. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }
    initializePage()
  }, [])

  return (
    <div className="app">
      <Header 
        robberyCount={robberyCount}
        onModeChange={() => {}}
        onPageChange={() => {}}
      />
      <main className="content">
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        )}
        <ChartSection 
          data={wildCardData} 
          mode="wildcard"
          loading={loading}
        />
      </main>
    </div>
  )
}

export default WildCardRacePage 