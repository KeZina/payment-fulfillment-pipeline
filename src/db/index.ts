import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
// import * as schema from './schema';
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

// Dedicated server configuration (not serverless)
const queryClient = neon(connectionString);

export const db = drizzle(queryClient, { schema });
