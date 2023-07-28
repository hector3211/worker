import {
  serial,
  timestamp,
  pgTable,
  varchar,
  boolean,
  uniqueIndex,
  json,
  date,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { InferModel, relations, sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 250 }).notNull(),
    name: varchar("name").notNull(),
    role: varchar("role").default("Guest"),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("unique_idx").on(users.email),
    };
  }
);
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  invoice: varchar("invoice").notNull(),
  sink: json("sinks").$type<string[]>(),
  edge: json("edges").$type<string[]>(),
  pictures: json("pictures").$type<string[]>(),
  completed: boolean("completed").default(false),
  due_date: date("due_date"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const usersToJobs = pgTable(
  "users_to_jobs",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.jobId),
  })
);

export const userRaltions = relations(users, ({ many }) => ({
  jobs: many(usersToJobs),
}));

export const jobRaltions = relations(jobs, ({ many }) => ({
  user: many(usersToJobs),
}));

export const usersToJobsRelations = relations(usersToJobs, ({ one }) => ({
  user: one(users, {
    fields: [usersToJobs.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [usersToJobs.jobId],
    references: [jobs.id],
  }),
}));

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;
export type Job = InferModel<typeof jobs>;
export type NewJob = InferModel<typeof jobs, "insert">;
export type UsersToJob = InferModel<typeof usersToJobs>;
export type NewUsersToJob = InferModel<typeof usersToJobs, "insert">;
export type JobData = {
  id: number;
  invoice: string;
  sink: string[] | null;
  edge: string[] | null;
  pictures: string[] | null;
  completed: boolean | null;
  due_date: string | null;
  created_at: Date;
  user: UsersToJob[];
};
export type JobsWithUsers = {
  jobs: Job[];
  cutters: User[];
};
export type EditableJob = {
  id: number;
  invoice: string;
  sinks: string[] | null;
  edges: string[] | null;
  cutters: string[] | null;
  completed: boolean;
};
export type NewJobWithUser = {
  job: NewJob;
  cutters: string[];
};
