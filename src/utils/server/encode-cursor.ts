import { CursorToken } from "@/types";

export const encodeCursor = (payload: CursorToken): string => {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
};
