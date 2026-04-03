import { useMemo } from 'react'

function parseMarginPct(raw) {
  const n = Number(String(raw).replace(/[^0-9.-]/g, ''))
  return Number.isFinite(n) ? n : 0
}

export default function IndustryCalculator({
  sectors,
  selectedSectorId,
  onSectorChange,
  operatingMarginPct,
  onOperatingMarginPctChange,
  marginAfterPct,
  sectorMarginImpact,
}) {
  const sector = useMemo(
    () => sectors.find((s) => s.id === selectedSectorId) ?? sectors[0],
    [sectors, selectedSectorId],
  )

  const marginTooltip =
    'Operating margin: earnings from operations as a percentage of revenue, before interest and taxes.'

  return (
    <div className="calculator-card">
      <div className="calculator-card__header">
        <h2 className="calculator-card__title">Industry & margins</h2>
        <p className="calculator-card__lede">
          Select your sector and enter your current operating margin. The
          estimate applies sector-level tariff pressure as a change in margin
          percentage points.
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="industry-sector">
          Sector
        </label>
        <select
          id="industry-sector"
          className="field__select"
          value={selectedSectorId}
          onChange={(e) => onSectorChange(e.target.value)}
        >
          {sectors.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        {sector?.description && (
          <p className="field__help">{sector.description}</p>
        )}
      </div>

      <div className="field">
      <label
          className="field__label"
          htmlFor="operating-margin"
        >
          <span className="tooltip-wrapper">
            Current operating margin
            <span className="tooltip-icon" aria-label="What is operating margin?">i</span>
            <span className="tooltip-bubble">
              Operating margin is your earnings from operations as a percentage of revenue, before interest and taxes. Example: a 12% operating margin means $12 of operating profit per $100 of revenue. Tariff pressure on input costs reduces this figure directly.
            </span>
          </span>
        </label>
        <div className="field__row field__row--inline">
          <input
            id="operating-margin"
            className="field__input field__input--margin"
            type="number"
            inputMode="numeric"
            step={0.1}
            value={operatingMarginPct}
            onChange={(e) =>
              onOperatingMarginPctChange(parseMarginPct(e.target.value))
            }
            aria-describedby="operating-margin-tip"
          />
          <span className="field__unit">%</span>
        </div>
        <p id="operating-margin-tip" className="sr-only">
          {marginTooltip}
        </p>
      </div>

      <div className="margin-preview">
        <div className="margin-preview__row">
        <span className="margin-preview__label">
            <span className="tooltip-wrapper">
              Sector tariff pressure
              <span className="tooltip-icon" aria-label="What is sector tariff pressure?">i</span>
              <span className="tooltip-bubble">
                This figure estimates the margin pressure your sector faces from tariff-driven input cost increases. It is an illustrative default based on published sector-level tariff incidence research — not a forecast. Adjust your operating margin input to model your specific exposure.
              </span>
            </span>
          </span>
          <span className="margin-preview__value margin-preview__value--delta">
            {sectorMarginImpact * 100 >= 0 ? '+' : ''}
            {(sectorMarginImpact * 100).toFixed(1)} percentage points
          </span>
        </div>
        <p className="margin-preview__footnote">
          Illustrative estimate based on input cost exposure and published
          sector-level tariff incidence research.
        </p>
        <div className="margin-preview__row margin-preview__row--emphasis">
          <span className="margin-preview__label">Estimated margin after</span>
          <span className={`margin-preview__value${marginAfterPct < operatingMarginPct ? ' margin-preview__value--worse' : ''}`}>
            {marginAfterPct.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  )
}
