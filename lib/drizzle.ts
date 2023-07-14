import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import {
  serial,
  timestamp,
  pgTable,
  numeric,
  varchar,
  bigint,
  boolean,
  uniqueIndex,
  text,
} from "drizzle-orm/pg-core";
import { InferModel, relations, sql } from "drizzle-orm";

// export type JobType = {
//   invoice: number;
//   sink: string;
//   edge: string;
//   picture: number;
// };

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 250 }).notNull(),
    name: varchar("name").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);

export const userRaltions = relations(users, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  invoice: varchar("invoice").notNull(),
  sink: varchar("sink", { length: 100 }),
  edge: varchar("edge", { length: 100 }),
  cutter: varchar("cutter", { length: 20 }),
  picture: text("picture"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const jobRaltions = relations(jobs, ({ one }) => ({
  user: one(users, {
    fields: [jobs.cutter],
    references: [users.name],
  }),
}));

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;
export type Job = InferModel<typeof jobs>;
export type NewJob = InferModel<typeof jobs, "insert">;
export type UpdateJob = InferModel<typeof jobs, "select">;

const postgresUrl = process.env.POSTGRES_URL as string;

// // for migrations
// const migrationClient = postgres(postgresUrl, { max: 1 });
// migrate(drizzle(migrationClient), { migrationsFolder: "dizzle" });

// for query purposes
const queryClient = postgres(postgresUrl);
export const db: PostgresJsDatabase = drizzle(queryClient);

export async function seed() {
  try {
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            name VARCHAR NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS jobs (
            id SERIAL PRIMARY KEY,
            invoice VARCHAR NOT NULL,
            sink VARCHAR(100),
            edge VARCHAR(100),
            cutter VARCHAR(20),
            picture VARCHAR,
            completed BOOLEAN DEFAULT FALSE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
  } catch (err) {
    console.log("Seed Failed!");
    console.log(err);
  }
}
