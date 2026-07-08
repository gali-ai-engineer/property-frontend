import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = 'https://property-api-rpdk.onrender.com'

function App() {
  // Property search state
  const [areaInput, setAreaInput] = useState('')
  const [propertyData, setPropertyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Mortgage calculator state
  const [mortgageArea, setMortgageArea] = useState('')
  const [deposit, setDeposit] = useState('')
  const [mortgageResult, setMortgageResult] = useState(null)
  const [mortgageLoading, setMortgageLoading] = useState(false)
  const [mortgageError, setMortgageError] = useState('')

  // Compare areas state
  const [compareAreas, setCompareAreas] = useState('')
  const [compareResult, setCompareResult] = useState(null)
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareError, setCompareError] = useState('')

  async function handleSearch() {
    if (!areaInput.trim()) {
      setError('Please enter an area name')
      setPropertyData(null)
      return
    }
    setLoading(true)
    setError('')
    setPropertyData(null)
    try {
      const response = await axios.get(`${API_BASE}/property/${areaInput.trim()}`)
      setPropertyData(response.data)
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`No data found for "${areaInput}"`)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleMortgageCalculate() {
    if (!mortgageArea.trim() || !deposit) {
      setMortgageError('Please enter both area and deposit amount')
      setMortgageResult(null)
      return
    }
    setMortgageLoading(true)
    setMortgageError('')
    setMortgageResult(null)
    try {
      const response = await axios.post(`${API_BASE}/mortgage`, {
        area: mortgageArea.trim(),
        deposit: parseFloat(deposit)
      })
      setMortgageResult(response.data)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setMortgageError(err.response.data.detail)
      } else {
        setMortgageError('Something went wrong. Please try again.')
      }
    } finally {
      setMortgageLoading(false)
    }
  }

  async function handleCompare() {
    if (!compareAreas.trim()) {
      setCompareError('Please enter at least one area')
      setCompareResult(null)
      return
    }
    setCompareLoading(true)
    setCompareError('')
    setCompareResult(null)
    try {
      const areasList = compareAreas.split(',').map(a => a.trim())
      const response = await axios.post(`${API_BASE}/compare`, {
        areas: areasList
      })
      setCompareResult(response.data)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setCompareError(err.response.data.detail)
      } else {
        setCompareError('Something went wrong. Please try again.')
      }
    } finally {
      setCompareLoading(false)
    }
  }

  function handleKeyPress(e, callback) {
    if (e.key === 'Enter') {
      callback()
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Property Research</h1>
        <p>Search London property areas for investment data</p>
      </header>

      {/* Property Search Section */}
      <section className="card">
        <h2>Property Search</h2>
        <div className="input-row">
          <input
            type="text"
            placeholder="Enter area name (e.g. Croydon)"
            value={areaInput}
            onChange={(e) => setAreaInput(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleSearch)}
          />
          <button onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {propertyData && (
          <div className="result-box">
            <h3>{propertyData.area}</h3>
            <p><strong>Price:</strong> £{propertyData.price.toLocaleString()}</p>
            <p><strong>Rental Yield:</strong> {propertyData.rental_yield}%</p>
            <p><strong>Listings:</strong> {propertyData.listings}</p>
            <p><strong>Type:</strong> {propertyData.property_type}</p>
            <p><strong>Growth Forecast:</strong> {propertyData.growth_forecast}%</p>
            <p><strong>Outlook:</strong> {propertyData.outlook}</p>
          </div>
        )}
      </section>

      {/* Mortgage Calculator Section */}
      <section className="card">
        <h2>Mortgage Calculator</h2>
        <div className="input-row">
          <input
            type="text"
            placeholder="Area name"
            value={mortgageArea}
            onChange={(e) => setMortgageArea(e.target.value)}
          />
          <input
            type="number"
            placeholder="Deposit (£)"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleMortgageCalculate)}
          />
          <button onClick={handleMortgageCalculate} disabled={mortgageLoading}>
            {mortgageLoading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {mortgageError && <p className="error">{mortgageError}</p>}

        {mortgageResult && (
          <div className="result-box">
            <h3>{mortgageResult.area}</h3>
            <p><strong>Purchase Price:</strong> £{mortgageResult.purchase_price.toLocaleString()}</p>
            <p><strong>Deposit:</strong> £{mortgageResult.deposit.toLocaleString()}</p>
            <p><strong>Loan:</strong> £{mortgageResult.loan.toLocaleString()}</p>
            <p><strong>Monthly Payment:</strong> £{mortgageResult.monthly_payment.toLocaleString()}</p>
            <p><strong>Rate:</strong> {mortgageResult.annual_rate}% over {mortgageResult.term_years} years</p>
          </div>
        )}
      </section>

      {/* Compare Areas Section */}
      <section className="card">
        <h2>Compare Areas</h2>
        <div className="input-row">
          <input
            type="text"
            placeholder="e.g. Croydon, Hackney, Surrey"
            value={compareAreas}
            onChange={(e) => setCompareAreas(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, handleCompare)}
          />
          <button onClick={handleCompare} disabled={compareLoading}>
            {compareLoading ? 'Comparing...' : 'Compare'}
          </button>
        </div>

        {compareError && <p className="error">{compareError}</p>}

        {compareResult && (
          <div className="result-box">
            <p><strong>Best Area:</strong> {compareResult.best_area} ({compareResult.best_yield}% yield)</p>
            <table>
              <thead>
                <tr><th>Area</th><th>Yield</th><th>Price</th></tr>
              </thead>
              <tbody>
                {compareResult.ranked.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.area}</td>
                    <td>{item.yield}%</td>
                    <td>£{item.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default App