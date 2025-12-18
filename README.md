# binance-mcp

Binance Spot REST MCP server providing market data, account state, and guarded trading tools. Built with FastMCP so it can run over stdio (local agents) or HTTP (Glama inspection / Docker deployments).

## Features

- Latest ticker price, klines, and `exchangeInfo` for any symbol.
- Account tools (balances, open orders) with recvWindow helper.
- Trading helpers (place/cancel) protected by `BINANCE_TRADE_ENABLED` toggle.
- Works with Glama thanks to HTTP transport + `glama.yaml`/`Dockerfile` metadata.

## Getting started

1. Install dependencies (Node 20+ recommended):

   ```bash
   npm install
   ```

2. Copy the example env file and fill in your Binance key/secret (testnet keys work too):

   ```bash
   cp .env.example .env
   # BINANCE_TRADE_ENABLED=false keeps the server in read-only mode
   ```

3. Build + run (stdio transport by default):

   ```bash
   npm run build
   npm start
   ```

4. Development / watch mode:

   ```bash
   npm run dev
   ```

### HTTP transport

Set `MCP_TRANSPORT=http` and optionally `PORT` to expose the tools over HTTP (required for Glama inspection):

```bash
MCP_TRANSPORT=http PORT=8080 npm run dev
```

The provided Dockerfile bakes this configuration automatically.

## Tools

| name | description |
| --- | --- |
| `binance.market.price` | Latest ticker price for a symbol. |
| `binance.market.klines` | Candles (symbol + interval, configurable limit). |
| `binance.market.exchangeInfo` | Full exchange metadata + filters. |
| `binance.account.balances` | Account snapshot (requires API key/secret). |
| `binance.account.openOrders` | Open orders for a symbol. |
| `binance.trade.placeOrder` | Places MARKET/LIMIT orders with guardrails. |
| `binance.trade.cancelOrder` | Cancels an order by symbol + orderId. |

All tools return JSON payloads stringified for LLM consumption.

## Environment variables

| key | description |
| --- | --- |
| `BINANCE_API_KEY` | Required for account/trade tools (public tools work without). |
| `BINANCE_API_SECRET` | Required for account/trade tools. |
| `BINANCE_BASE_URL` | Defaults to `https://api.binance.com` (override for testnet). |
| `BINANCE_RECV_WINDOW` | RecvWindow in ms (default `5000`). |
| `BINANCE_TRADE_ENABLED` | Set to `false` to disable trade tools entirely. |
| `MCP_TRANSPORT` | `stdio` (default) or `http`. |
| `PORT` | HTTP port when using `MCP_TRANSPORT=http` (default `8080`). |

## Glama & Docker

- `glama.yaml` / `glama.json` define build/start commands and required env vars.
- `Dockerfile` builds a production image, exposes port `8080`, and defaults to HTTP transport for inspection support.

## License

Released under the MIT License (see `LICENSE`).
