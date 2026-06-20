import { defineConfig } from "drizzle-kit";

const envUrl = process.env.DATABASE_URL || "";
// Use local database if Neon URL is broken/expired (contains neon.tech)
// Local PostgreSQL uses trust auth (no password) on port 15432
// Match the pgUser logic from script/dev.ts: USER || USERNAME || "postgres"
const pgUser = process.env.USER || process.env.USERNAME || "postgres";
const dbUrl = envUrl.includes("neon.tech") || !envUrl
  ? `postgresql://${pgUser}@localhost:15432/stellar_dominion`
  : envUrl;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
});
