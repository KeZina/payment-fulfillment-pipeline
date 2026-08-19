import "server-only";

import { parseCursorToken } from "@/schemas/cursor-token";
import type { CursorToken } from "@/types";

export const decodeCursor = (token: string | null): CursorToken | null => {
  if (!token) return null;
  try {
    const input: unknown = JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8"),
    );
    const result = parseCursorToken(input);

    return result.success ? result.output : null;
  } catch {
    return null;
  }
};
