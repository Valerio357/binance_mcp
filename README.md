# binance-mcp

Binance Spot REST MCP server compatible with Glama MCP setup. Provides tools for market data, account insights, and discretionary trading.

## Setup

```bash
npm install
npm run build
```

Copy `.env.example` to `.env` and fill in your Binance API credentials. `BINANCE_TRADE_ENABLED=false` disables trading tools (place/cancel) while leaving read-only tools available.

## Development

```bash
npm run dev
```

## Tools

- `binance.market.price`
- `binance.market.klines`
- `binance.market.exchangeInfo`
- `binance.account.balances`
- `binance.account.openOrders`
- `binance.trade.placeOrder`
- `binance.trade.cancelOrder`

## Glama

`glama.yaml` and `glama.json` describe build/start commands and environment variables required by Glama.
