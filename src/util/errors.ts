export class ToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToolError";
  }
}

// Binance connector throws Axios errors; map them to concise messages.
export function toToolError(err: unknown): ToolError {
  const message = extractMessage(err);
  return new ToolError(message);
}

function extractMessage(err: unknown): string {
  if (!err) {
    return "Unknown error";
  }

  if (err instanceof ToolError || err instanceof Error) {
    return err.message;
  }

  const maybeAxios = err as {
    response?: { data?: { msg?: string; code?: number } };
    message?: string;
  };
  const code = maybeAxios.response?.data?.code;
  const msg = maybeAxios.response?.data?.msg ?? maybeAxios.message;
  if (code || msg) {
    return code ? `${code}: ${msg ?? "Binance error"}` : msg ?? "Binance error";
  }

  return typeof err === "string" ? err : JSON.stringify(err);
}
