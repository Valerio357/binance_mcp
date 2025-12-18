import { z } from "zod";
import { binance, ensureTradingEnabled, withCommonParams } from "../binance/client.js";
import type { BinanceTool } from "../binance/types.js";
import { toToolError } from "../util/errors.js";

const placeOrderSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(["BUY", "SELL"]),
  type: z.enum(["MARKET", "LIMIT"]),
  quantity: z.string().optional(),
  quoteOrderQty: z.string().optional(),
  price: z.string().optional(),
  timeInForce: z.enum(["GTC", "IOC", "FOK"]).optional()
});

const cancelOrderSchema = z.object({
  symbol: z.string().min(1),
  orderId: z.number().int().positive()
});

export const tool_place_order: BinanceTool = {
  name: "binance_trade_placeOrder",
  description:
    "Place a spot order. Example: {symbol:'BTCUSDT', side:'BUY', type:'MARKET', quoteOrderQty:'50'}",
  parameters: placeOrderSchema,
  async run(input) {
    ensureTradingEnabled();
    const params = placeOrderSchema.parse(input);

    if (params.type === "LIMIT" && !params.price) {
      throw new Error("LIMIT orders require 'price'.");
    }

    if (!params.quantity && !params.quoteOrderQty) {
      throw new Error("Provide 'quantity' or 'quoteOrderQty'.");
    }

    const payload = withCommonParams({
      quantity: params.quantity,
      quoteOrderQty: params.quoteOrderQty,
      price: params.price,
      timeInForce: params.timeInForce ?? (params.type === "LIMIT" ? "GTC" : undefined)
    });

    try {
      const res = await binance.newOrder(params.symbol, params.side, params.type, payload);
      return res.data;
    } catch (err) {
      throw toToolError(err);
    }
  }
};

export const tool_cancel_order: BinanceTool = {
  name: "binance_trade_cancelOrder",
  description: "Cancel a spot order by symbol and orderId.",
  parameters: cancelOrderSchema,
  async run(input) {
    ensureTradingEnabled();
    const params = cancelOrderSchema.parse(input);
    try {
      const res = await binance.cancelOrder(params.symbol, withCommonParams({ orderId: params.orderId }));
      return res.data;
    } catch (err) {
      throw toToolError(err);
    }
  }
};
