import { config } from "dotenv";
import { drizzle } from 'drizzle-orm/neon-http';

config({ path: ".env.production" }); // or .env.local

export const db = drizzle(process.env.DATABASE_URL!);
