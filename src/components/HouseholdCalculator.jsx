import { useMemo } from 'react'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function parseSpend(raw) {
  const n = Number(String(raw).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? Math.max(0, n) : 0
}

export default function HouseholdCalculator({
  categories,
  spends,
  onSpendChange,
  averageTariffRate,
  onAverageTariffRateChange,
  totalAnnualCost,
  onResetDefaults,
}) {
  const rows = useMemo(() => {
    return categories.map((c) => {
      const spend = spends[c.id] ?? 0
      const annualCost = spend * c.tariffPassThrough * averageTariffRate
      return { ...c, spend, annualCost }
    })
  }, [categories, spends, averageTariffRate])

  const tariffPct = averageTariffRate * 100

  return (
    <div className="calculator-card">
      <div className="calculator-card__header">
        <div className="calculator-card__header-row">
          <h2 className="calculator-card__title">Household spending</h2>
          <button
            type="button"
            className="calculator-card__reset"
            onClick={onResetDefaults}
          >
            Reset to defaults
          </button>
        </div>
        <p className="calculator-card__lede">
          Enter your estimated annual household spending per category. US
          averages shown as defaults — adjust to your actual spending.
        </p>
        <p className="calculator-card__pass-note">
          <span className="tooltip-wrapper">
            Pass-through rate
            <span className="tooltip-icon" aria-label="What is pass-through?">i</span>
            <span className="tooltip-bubble">
              Pass-through is the share of the tariff cost that retailers and suppliers pass on to consumers as higher prices. A 100% pass-through means the full tariff is reflected in retail prices. In practice, pass-through varies by category, competition level, and contract structure.
            </span>
          </span>
          {' '}— the percentage shown per category reflects the modeled share passed to retail prices.
        </p>
      </div>

      <div className="field field--global">
        <label className="field__label" htmlFor="avg-tariff-rate">
          Assumed average tariff rate
        </label>
        <div className="field__row">
          <input
            id="avg-tariff-rate"
            className="field__range"
            type="range"
            min={0}
            max={0.5}
            step={0.005}
            value={averageTariffRate}
            onChange={(e) =>
              onAverageTariffRateChange(Number(e.target.value))
            }
          />
          <div className="field__suffix">
            <input
              className="field__input field__input--narrow"
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={Math.round(tariffPct * 1000) / 1000}
              onChange={(e) => {
                const v = Number(e.target.value)
                if (!Number.isFinite(v)) return
                onAverageTariffRateChange(Math.min(100, Math.max(0, v)) / 100)
              }}
              aria-label="Average tariff rate percent"
            />
            <span className="field__unit">%</span>
          </div>
        </div>
        <p className="field__slider-help">
          Default reflects estimated 2025 US import-weighted average tariff
          rate. Slide to model different policy scenarios.
        </p>
      </div>

      <ul className="category-list">
        <li className="category-list__header">
          <span>Category</span>
          <span>Annual spend ($)</span>
          <span>Est. impact</span>
        </li>
        {rows.map((row) => {
          const isZeroSpend = row.spend === 0
          return (
            <li key={row.id} className="category-row">
              <div className="category-row__meta">
                <span className="category-row__label">{row.label}</span>
                <span className="category-row__hint" title={row.description}>
                  Modeled share passed to retail prices:{' '}
                  {Math.round(row.tariffPassThrough * 100)}%
                </span>
              </div>
              <div className="category-row__controls">
                <label className="sr-only" htmlFor={`spend-${row.id}`}>
                  Annual spend for {row.label}
                </label>
                <input
                  id={`spend-${row.id}`}
                  className="field__input"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={50}
                  value={spends[row.id] ?? ''}
                  onChange={(e) =>
                    onSpendChange(row.id, parseSpend(e.target.value))
                  }
                />
                <span
                  className={
                    isZeroSpend
                      ? 'category-row__mini category-row__mini--zero'
                      : 'category-row__mini'
                  }
                  aria-hidden={isZeroSpend}
                >
                  Impact{' '}
                  <strong>
                    {isZeroSpend ? '—' : money.format(Math.round(row.annualCost))}
                  </strong>
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="running-total" role="status">
        <span className="running-total__label">Estimated annual tariff cost</span>
        <span className="running-total__value">
          {money.format(Math.round(totalAnnualCost))}
        </span>
      </div>
    </div>
  )
}
