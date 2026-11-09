import { useState } from 'react'
import { useFetch } from './hooks/useFetch'
import CountryCard from './components/CountryCard'
import './App.css'

// Set in .env
const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY

const REGIONS = ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic']

function App() {
  const { data: countries, loading, error, refetch } = useFetch(API_URL, API_KEY)
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All')

  const filtered = (countries ?? [])
    .filter((c) => region === 'All' || c.region === region)
    .filter((c) => c.names.common.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.names.common.localeCompare(b.names.common))

  return (
    <div className="app">
      <header>
        <h1>🌍 Country Explorer</h1>
      </header>

      <div className="controls">
        <input
          type="text"
          placeholder="Search country by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="regions">
          {REGIONS.map((r) => (
            <button
              key={r}
              className={r === region ? 'active' : ''}
              onClick={() => setRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="status">Loading countries...</p>}

      {error && (
        <div className="status error">
          <p>Something went wrong: {error}</p>
          <button onClick={refetch}>Try again</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="count">{filtered.length} countries found</p>
          {filtered.length === 0 ? (
            <p className="status">No countries match your search.</p>
          ) : (
            <div className="grid">
              {filtered.map((country) => (
                <CountryCard key={country.uuid} country={country} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App
