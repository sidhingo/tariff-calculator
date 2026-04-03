import { useState, useCallback } from 'react'

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const HOUSEHOLD_IMPACT_SCALE = 2000

export default function ResultsDisplay({
  mode,
  householdTotal,
  averageTariffRate,
  industrySectorLabel,
  operatingMarginPct,
  marginAfterPct,
  sectorMarginImpact,
}) {
  const isHousehold = mode === 'household'
  const [copyState, setCopyState] = useState('idle')

  const marginWorse = !isHousehold && marginAfterPct < operatingMarginPct

  const householdBarPct = Math.min(
    100,
    (Math.max(0, householdTotal) / HOUSEHOLD_IMPACT_SCALE) * 100,
  )

  const copySummary = useCallback(async () => {
    const ratePct = (averageTariffRate * 100).toFixed(1)
    const totalRounded = Math.round(householdTotal)
    const impactPp = sectorMarginImpact * 100
    const impactStr =
      impactPp <= 0
        ? `-${Math.abs(impactPp).toFixed(1)}`
        : `+${impactPp.toFixed(1)}`
    let text
    if (isHousehold) {
      text = `My estimated tariff exposure: ${money.format(totalRounded)}/year at ${ratePct}% average tariff rate (Tariff Impact Calculator — https://tariff-impact-calculator.vercel.app)`
    } else {
      text = `Estimated margin impact for ${industrySectorLabel}: ${impactStr} percentage points, post-shock margin ${marginAfterPct.toFixed(2)}% (Tariff Impact Calculator — https://tariff-impact-calculator.vercel.app)`
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('failed')
      setTimeout(() => setCopyState('idle'), 2000)
    }
  }, [
    isHousehold,
    householdTotal,
    averageTariffRate,
    industrySectorLabel,
    sectorMarginImpact,
    marginAfterPct,
  ])

  return (
    <div className="results-card">
      <h2 className="results-card__title">Results</h2>

      {isHousehold ? (
        <div className="results-block">
          <p className="results-block__eyebrow">Household annual impact</p>
          <p className="results-block__figure">
            {money.format(Math.round(householdTotal))}
          </p>
          <div
            className="results-block__bar"
            role="img"
            aria-label={`Impact as ${householdBarPct.toFixed(0)} percent of a ${money.format(HOUSEHOLD_IMPACT_SCALE)} reference scale`}
          >
            <div className="results-block__bar-track">
              <div
                className="results-block__bar-fill"
                style={{ width: `${householdBarPct}%` }}
              />
            </div>
            <span className="results-block__bar-label">
              vs. {money.format(HOUSEHOLD_IMPACT_SCALE)} reference scale
            </span>
          </div>
          <p className="results-block__sub">
            At an assumed average tariff rate of{' '}
            <strong>{(averageTariffRate * 100).toFixed(1)}%</strong>, applied
            with category pass-through to your spending inputs.
          </p>
          <p className="results-block__benchmark">
            For reference, the Tax Foundation estimates average household tariff
            exposure of $1,200–$2,100 annually under current 2025 policy.
          </p>
        </div>
      ) : (
        <div className="results-block">
          <p className="results-block__eyebrow">Industry margin outlook</p>
          <p className="results-block__intro">
            This estimate shows your margin after absorbing sector-level tariff
            pressure, assuming costs cannot be fully passed to customers. Adjust
            your margin input to model different scenarios.
          </p>
          <p
            className={`results-block__figure results-block__figure--margin${marginWorse ? ' results-block__figure--negative' : ''}`}
          >
            {marginAfterPct.toFixed(2)}%
          </p>
          <p className="results-block__sub">
            <strong>{industrySectorLabel}</strong> — operating margin{' '}
            <strong>{operatingMarginPct.toFixed(1)}%</strong> with estimated
            tariff pressure{' '}
            <strong>
              {sectorMarginImpact * 100 >= 0 ? '+' : ''}
              {(sectorMarginImpact * 100).toFixed(1)} percentage points
            </strong>{' '}
            yields an illustrative post-shock margin above.
          </p>
          <p className="results-block__context">
            For context, most S&amp;P 500 sectors operate at 8–15% margins — a
            shift of several percentage points is considered material.
          </p>
        </div>
      )}

      <div className="methodology">
        <h3 className="methodology__title">Methodology & sources</h3>
        <p className="methodology__lead">
          Estimates use illustrative pass-through and margin defaults—not
          forecasts; replace with your own assumptions as needed.
        </p>
        <ul className="methodology__bullets">
          <li>
            <a
              href="https://libertystreeteconomics.newyorkfed.org/"
              target="_blank"
              rel="noreferrer noopener"
            >
              NY Fed Liberty Street Economics
            </a>{' '}
            — tariffs, prices, and pass-through discussion
          </li>
          <li>
            <a
              href="https://taxfoundation.org/research/all/global/tariffs/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Tax Foundation tariffs and trade
            </a>{' '}
            — effective rates and policy context
          </li>
        </ul>
      </div>

      <div className="results-copy">
        <button
          type="button"
          className="results-copy__btn"
          onClick={copySummary}
        >
          {copyState === 'copied'
            ? 'Copied'
            : copyState === 'failed'
              ? 'Copy failed'
              : 'Copy results'}
        </button>
      </div>
    </div>
  )
}
