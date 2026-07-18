export type ServerResponse =
  | { success: true; data?: unknown; message?: string; error: undefined }
  | { success: false; data: undefined; message: undefined; error: string };
