import { z } from "zod";

export interface BinanceTool {
  name: string;
  description: string;
  parameters: z.ZodTypeAny;
  run: (input: unknown) => Promise<unknown>;
}
