import "dotenv/config";
import { Spot } from "@binance/connector";

const apiKey = process.env.BINANCE_API_KEY ?? "";
const apiSecret = process.env.BINANCE_API_SECRET ?? "";
const baseURL = process.env.BINANCE_BASE_URL || "https://api.binance.com";
const recvWindow = Number(process.env.BINANCE_RECV_WINDOW || "5000");
const tradeEnabled = process.env.BINANCE_TRADE_ENABLED !== "false";

if (!apiKey || !apiSecret) {
  console.warn("BINANCE_API_KEY/SECRET missing: account/trade tools will fail.");
}

export const binance = new Spot(apiKey, apiSecret, { baseURL });

export function withCommonParams<T extends Record<string, unknown>>(params: T) {
  return { ...params, recvWindow };
}

export function ensureTradingEnabled() {
  if (!tradeEnabled) {
    throw new Error("Trading tools are disabled (BINANCE_TRADE_ENABLED=false).");
  }
}
