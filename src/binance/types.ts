export type JsonSchema = Record<string, unknown>;

export interface BinanceTool {
  name: string;
  description: string;
  inputSchema: JsonSchema;
  run: (input: unknown) => Promise<unknown>;
}
