import { z } from "zod";
import { binance, withCommonParams } from "../binance/client.js";
import type { BinanceTool } from "../binance/types.js";
import { toJsonSchema } from "../util/schema.js";
import { toToolError } from "../util/errors.js";

const balancesSchema = z.object({});
const openOrdersSchema = z.object({ symbol: z.string().min(1) });

export const tool_account_balances: BinanceTool = {
  name: "binance.account.balances",
  description: "Get account balances (requires API key & secret).",
  inputSchema: toJsonSchema(balancesSchema),
  async run(input) {
    balancesSchema.parse(input);
    try {
      const res = await binance.account(withCommonParams({}));
      return res.data?.balances ?? res.data;
    } catch (err) {
      throw toToolError(err);
    }
  }
};

export const tool_open_orders: BinanceTool = {
  name: "binance.account.openOrders",
  description: "List open orders for a symbol.",
  inputSchema: toJsonSchema(openOrdersSchema),
  async run(input) {
    const params = openOrdersSchema.parse(input);
    try {
      const res = await binance.openOrders(params.symbol, withCommonParams({}));
      return res.data;
    } catch (err) {
      throw toToolError(err);
    }
  }
};
