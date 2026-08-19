import type { CursorTokenSchema } from "@/schemas/cursor-token";
import type * as v from "valibot";

export type CursorToken = v.InferOutput<typeof CursorTokenSchema>;
