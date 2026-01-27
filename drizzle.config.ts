import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local' });
}

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
