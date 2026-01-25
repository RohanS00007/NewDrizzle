import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

// Load .env.local for local development
// In production, environment variables are provided by the deployment platform
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local' });
}

// Validate DATABASE_URL for migrations
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Please set it in your .env.local file for local development.'
  );
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
