import { FastMCP } from "fastmcp";
import { tool_market_price, tool_market_klines, tool_exchange_info } from "./tools/market.js";
import { tool_account_balances, tool_open_orders } from "./tools/account.js";
import { tool_place_order, tool_cancel_order } from "./tools/trade.js";
import { ToolError } from "./util/errors.js";

const server = new FastMCP({
  name: "binance-mcp",
  version: "0.1.0",
  instructions:
    "Binance Spot REST toolkit: prezzi, klines, exchangeInfo, bilanci, open orders e trade protetti da env toggle.",
});

const tools = [
  tool_market_price,
  tool_market_klines,
  tool_exchange_info,
  tool_account_balances,
  tool_open_orders,
  tool_place_order,
  tool_cancel_order,
];

tools.forEach((tool) => {
  server.addTool({
    name: tool.name,
    description: tool.description,
    parameters: tool.parameters,
    execute: async (args) => {
      try {
        const result = await tool.run(args);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        const handled = error instanceof ToolError ? error : new ToolError((error as Error).message);
        throw handled;
      }
    },
  });
});

const transport = process.env.MCP_TRANSPORT ?? "stdio";
const port = Number(process.env.PORT ?? 8080);

server
  .start(
    transport === "http"
      ? { transportType: "httpStream", httpStream: { port } }
      : { transportType: "stdio" },
  )
  .then(() => {
    console.log(`binance-mcp ready via ${transport === "http" ? `http:${port}` : "stdio"}`);
  });
