# Cryptocurrency Application

Configured with:
- Webpack
- ESLint
- Prettier

## ⚠️ Symbol-Based Metadata Fetching Issue

Good UX improvement would be to show cryptocurrency full names and icons. While fetching cryptocurrency metadata based on symbols, some symbols duplicated across different coins. For example:

```json
[
  {"id": "polkadot", "symbol": "dot", "name": "Polkadot"},
  {"id": "xcdot", "symbol": "dot", "name": "xcDOT"}
]
```

Since both coins use the symbol "dot", I decided not to proceed with this feature. 

Data was fetched from https://api.coingecko.com/api/v3/coins/list

## Styling Approach

This project uses a simple custom CSS setup, consisting of a few hundred lines to style the UI. However, for larger projects, I would use a utility-first CSS framework like Tailwind CSS to ensure a consistent design across components and improve maintainability.
