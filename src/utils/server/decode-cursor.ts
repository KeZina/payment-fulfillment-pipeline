import { CursorToken } from "@/types/cursor-token";

export const decodeCursor = (token: string | null): CursorToken | null => {
  if (!token) return null;
  try {
    return JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8"),
    ) as CursorToken;
  } catch {
    return null;
  }
};
