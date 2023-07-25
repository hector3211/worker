import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DB_URL) {
  throw new Error("DATABASE_URL is missing");
}
export default {
  schema: "./db/schema/*",
  out: "./db/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DB_URL,
  },
} satisfies Config;
