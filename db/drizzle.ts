
import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { schema } from "./schema";

// Load .env.local for local development
// In production, environment variables are provided by the deployment platform
if (process.env.NODE_ENV !== 'production') {
  config({ path: ".env.local" });
}

// Validate DATABASE_URL
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Please set it in your Vercel environment variables or .env.local file.'
  );
}

// Validate DATABASE_URL format
if (!databaseUrl.startsWith('postgresql://') && !databaseUrl.startsWith('postgres://')) {
  throw new Error(
    'DATABASE_URL must be a valid PostgreSQL connection string. ' +
    'It should start with postgresql:// or postgres://'
  );
}

// Create Neon HTTP client - optimized for Vercel serverless/edge runtime
// The neon() function from @neondatabase/serverless automatically handles
// connection pooling and is designed for serverless environments
const sql = neon(databaseUrl);

// Create Drizzle instance with schema
export const db = drizzle({
  client: sql,
  schema
});