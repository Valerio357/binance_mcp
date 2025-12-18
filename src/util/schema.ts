import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { JsonSchema } from "../binance/types.js";

export type SchemaLike = JsonSchema | z.ZodTypeAny;

export function toJsonSchema(schema: SchemaLike): JsonSchema {
  return schema instanceof z.ZodType
    ? (zodToJsonSchema(schema) as JsonSchema)
    : schema;
}
