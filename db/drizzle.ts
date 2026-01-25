import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Load .env.local for local development
// In production, environment variables are provided by the deployment platform
if (process.env.NODE_ENV !== 'production') {
  config({ path: ".env.local" });
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// export const db = drizzle(process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL! as string);
export const db = drizzle({ client: sql });
