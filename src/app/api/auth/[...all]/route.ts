import { auth } from "@/lib/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST, PUT, PATCH, DELETE } = toNextJsHandler(auth);
