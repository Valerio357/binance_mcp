import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import type { BinanceTool } from "./binance/types.js";
import { tool_market_price, tool_market_klines, tool_exchange_info } from "./tools/market.js";
import { tool_account_balances, tool_open_orders } from "./tools/account.js";
import { tool_place_order, tool_cancel_order } from "./tools/trade.js";
import { ToolError } from "./util/errors.js";

const tools: BinanceTool[] = [
  tool_market_price,
  tool_market_klines,
  tool_exchange_info,
  tool_account_balances,
  tool_open_orders,
  tool_place_order,
  tool_cancel_order
];

const server = new Server(
  { name: "binance-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

tools.forEach((tool) => {
  if (!tool.inputSchema) {
    throw new Error(`Tool ${tool.name} is missing an input schema`);
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = tools.find((t) => t.name === req.params.name);
  if (!tool) {
    throw new Error(`Unknown tool: ${req.params.name}`);
  }

  try {
    const result = await tool.run(req.params.arguments ?? {});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  } catch (err) {
    const handled = err instanceof ToolError ? err : new ToolError((err as Error).message);
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: handled.message
        }
      ]
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
