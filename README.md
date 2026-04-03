# Tariff Impact Calculator

A two-mode calculator that converts US tariff percentages into real dollar and margin impacts.

**Live tool:** https://tariff-impact-calculator.vercel.app

## What it does

**Household mode** — Enter your annual spending across 10 categories. The calculator applies category-level pass-through rates and your assumed average tariff rate to estimate your total annual tariff exposure in dollars.

**Industry mode** — Select your sector and enter your current operating margin. The calculator applies sector-level tariff pressure estimates to show your illustrative post-shock margin.

## Data sources

- Pass-through rates based on Federal Reserve Bank of New York Liberty Street Economics research on tariff incidence and retail prices
- Sector margin pressure estimates based on published tariff incidence research
- Benchmark household exposure from Tax Foundation tariff and trade analysis
- Default average tariff rate reflects estimated 2025 US import-weighted average

## Methodology note

All pass-through rates and sector margin impacts are illustrative defaults for modeling purposes — not forecasts. Actual impact varies by product, supplier contract, and market conditions. Replace defaults with your own assumptions as needed.

## Tech

Built with Vite + React. Static JSON data, no backend, no database.

## Author

Siddharth Hingorani · [LinkedIn](https://linkedin.com/in/siddharth-hingorani)