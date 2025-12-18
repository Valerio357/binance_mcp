import { z } from "zod";
import { binance } from "../binance/client.js";
import type { BinanceTool } from "../binance/types.js";
import { toJsonSchema } from "../util/schema.js";
import { toToolError } from "../util/errors.js";

const priceSchema = z.object({ symbol: z.string().min(1) });
const klinesSchema = z.object({
  symbol: z.string().min(1),
  interval: z.string().min(1),
  limit: z.number().int().min(1).max(1000).default(200)
});
const exchangeInfoSchema = z.object({});

export const tool_market_price: BinanceTool = {
  name: "binance.market.price",
  description: "Get the latest price for a symbol (e.g. BTCUSDT).",
  inputSchema: toJsonSchema(priceSchema),
  async run(input) {
    const params = priceSchema.parse(input);
    try {
      const res = await binance.tickerPrice(params.symbol);
      return res.data;
    } catch (err) {
      throw toToolError(err);
    }
  }
};

export const tool_market_klines: BinanceTool = {
  name: "binance.market.klines",
  description: "Get historical klines/candles for a symbol and interval.",
  inputSchema: toJsonSchema(klinesSchema),
  async run(input) {
    const params = klinesSchema.parse(input);
    try {
      const res = await binance.klines(params.symbol, params.interval, { limit: params.limit });
      return res.data;
    } catch (err) {
      throw toToolError(err);
    }
  }
};

export const tool_exchange_info: BinanceTool = {
  name: "binance.market.exchangeInfo",
  description: "Get exchange information including filters per symbol.",
  inputSchema: toJsonSchema(exchangeInfoSchema),
  async run() {
    try {
      const res = await binance.exchangeInfo();
      return res.data;
    } catch (err) {
      throw toToolError(err);
    }
  }
};
