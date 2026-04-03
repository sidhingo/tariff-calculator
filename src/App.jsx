import { useMemo, useState, useCallback } from 'react'
import tariffData from './data/tariffData.json'
import HouseholdCalculator from './components/HouseholdCalculator.jsx'
import IndustryCalculator from './components/IndustryCalculator.jsx'
import ResultsDisplay from './components/ResultsDisplay.jsx'
import './App.css'

const MODES = {
  household: 'household',
  industry: 'industry',
}

const initialSpends = Object.fromEntries(
  tariffData.household.map((c) => [c.id, c.annualSpend]),
)

function App() {
  const [mode, setMode] = useState(MODES.household)
  const [spends, setSpends] = useState(initialSpends)
  const [averageTariffRate, setAverageTariffRate] = useState(
    tariffData.defaultAverageTariffRate ?? 0.15,
  )
  const [selectedSectorId, setSelectedSectorId] = useState(
    tariffData.industry[0]?.id ?? '',
  )
  const [operatingMarginPct, setOperatingMarginPct] = useState(12)

  const handleSpendChange = useCallback((id, value) => {
    setSpends((prev) => ({ ...prev, [id]: value }))
  }, [])

  const resetHouseholdDefaults = useCallback(() => {
    setSpends({ ...initialSpends })
    setAverageTariffRate(tariffData.defaultAverageTariffRate ?? 0.15)
  }, [])

  const householdTotal = useMemo(() => {
    return tariffData.household.reduce((sum, c) => {
      const spend = spends[c.id] ?? 0
      return sum + spend * c.tariffPassThrough * averageTariffRate
    }, 0)
  }, [spends, averageTariffRate])

  const selectedSector = useMemo(
    () =>
      tariffData.industry.find((s) => s.id === selectedSectorId) ??
      tariffData.industry[0],
    [selectedSectorId],
  )

  const sectorMarginImpact = selectedSector?.marginImpact ?? 0

  const marginAfterPct = useMemo(() => {
    return (operatingMarginPct / 100 + sectorMarginImpact) * 100
  }, [operatingMarginPct, sectorMarginImpact])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <h1 className="app-header__title">Tariff Impact Calculator</h1>
            <p className="app-header__tagline">
              Tariffs are reported as percentages. This tool converts them into
              dollars — for your household budget and your industry margins.
              Adjust the inputs to see your estimated exposure.
            </p>
            <p className="app-header__meta">United States · 2025 tariff policy</p>
          </div>
          <div
            className="app-tabs"
            role="tablist"
            aria-label="Calculator mode"
          >
            <button
              type="button"
              className={`app-tabs__btn${mode === MODES.household ? ' app-tabs__btn--active' : ''}`}
              role="tab"
              id="tab-household"
              aria-selected={mode === MODES.household}
              aria-controls="panel-calculator"
              onClick={() => setMode(MODES.household)}
            >
              Household
            </button>
            <button
              type="button"
              className={`app-tabs__btn${mode === MODES.industry ? ' app-tabs__btn--active' : ''}`}
              role="tab"
              id="tab-industry"
              aria-selected={mode === MODES.industry}
              aria-controls="panel-calculator"
              onClick={() => setMode(MODES.industry)}
            >
              Industry
            </button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <main className="app-main">
          <section
            id="panel-calculator"
            className="app-panel"
            role="tabpanel"
            aria-labelledby={
              mode === MODES.household ? 'tab-household' : 'tab-industry'
            }
          >
            {mode === MODES.household ? (
              <HouseholdCalculator
                categories={tariffData.household}
                spends={spends}
                onSpendChange={handleSpendChange}
                averageTariffRate={averageTariffRate}
                onAverageTariffRateChange={setAverageTariffRate}
                totalAnnualCost={householdTotal}
                onResetDefaults={resetHouseholdDefaults}
              />
            ) : (
              <IndustryCalculator
                sectors={tariffData.industry}
                selectedSectorId={selectedSectorId}
                onSectorChange={setSelectedSectorId}
                operatingMarginPct={operatingMarginPct}
                onOperatingMarginPctChange={setOperatingMarginPct}
                marginAfterPct={marginAfterPct}
                sectorMarginImpact={sectorMarginImpact}
              />
            )}
          </section>

          <aside className="app-aside" aria-label="Summary and methodology">
            <ResultsDisplay
              mode={mode}
              householdTotal={householdTotal}
              averageTariffRate={averageTariffRate}
              industrySectorLabel={selectedSector?.label ?? ''}
              operatingMarginPct={operatingMarginPct}
              marginAfterPct={marginAfterPct}
              sectorMarginImpact={sectorMarginImpact}
            />
          </aside>
        </main>
      </div>

      <footer className="app-footer">
        <p className="app-footer__date">Data last reviewed: April 2025</p>
        <p className="app-footer__disclaimer">
          This calculator provides illustrative estimates only and does not
          constitute financial, economic, or legal advice. Tariff pass-through
          rates and margin impacts are modeled defaults based on published
          research and will vary by product, supplier contract, and market
          conditions.
        </p>
      </footer>
    </div>
  )
}

export default App
