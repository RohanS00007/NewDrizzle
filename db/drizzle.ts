
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { schema } from "./schema";

if (process.env.NODE_ENV !== 'production') {
  config({ path: ".env.local" });
}

const databaseUrl = process.env.DATABASE_URL!;

const sql = neon(databaseUrl);

// Create Drizzle instance with schema
export const db = drizzle({
  client: sql,
  schema
});