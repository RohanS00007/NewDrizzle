import { config } from 'dotenv';
import { defineConfig } from "drizzle-kit";

// Load .env.local for local development
// In production, environment variables are provided by the deployment platform
if (process.env.NODE_ENV !== 'production') {
  config({ path: '.env.local' });
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
