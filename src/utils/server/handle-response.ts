import { ServerResponse } from "@/types";

export const handleResponse = (
  message?: string,
  data?: unknown,
): ServerResponse => {
  return { success: true, data, message, error: undefined };
};
