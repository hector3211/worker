"use server";

import { db } from "@/db";
import {
  EditableJob,
  Job,
  JobData,
  NewJobWithUser,
  NewUser,
  User,
  UsersToJob,
  jobs,
  users,
  usersToJobs,
} from "@/db/schema";
import { between, eq, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { utapi } from "uploadthing/server";

export async function utapiDelete(file: string) {
  await utapi.deleteFiles(file);
}

export async function getRecentJobs() {
  try {
    const currDateTime = new Date();
    const todayAtSixeAm = new Date();
    todayAtSixeAm.setHours(6, 0, 0, 0);
    const recentJobs = await db
      .select()
      .from(jobs)
      .where(between(jobs.created_at, todayAtSixeAm, currDateTime));

    return recentJobs as Job[];
  } catch (err) {
    console.log(
      `GetRecentJobs function failed! dbactions file with error ${err}`
    );
  }
}
export async function updateJob(job: EditableJob) {
  try {
    await db
      .update(jobs)
      .set({
        sink: job.sinks,
        edge: job.edges,
        completed: job.completed,
      })
      .where(eq(jobs.id, job.id));

    if (job.cutters) {
      for (const cutter of job.cutters) {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.name, cutter));
        await db
          .update(usersToJobs)
          .set({
            userId: user[0].id,
          })
          .where(eq(usersToJobs.jobId, job.id));
      }
    }
  } catch (err) {
    console.log(`editJob function failed! dbactions file with error ${err}`);
  }
}

export async function getJobs(): Promise<JobData[] | undefined> {
  try {
    const allJobs = await db.query.jobs.findMany({
      with: {
        user: true,
      },
    });
    return allJobs;
  } catch (err) {
    console.log(
      `GettingAllJobs functin failed! Dbactions file with error ${err}`
    );
  }
  revalidatePath("/");
}

export async function getCutterId(name: string): Promise<number | undefined> {
  const id = await db.select().from(users).where(eq(users.name, name));

  return id[0].id;
}

export async function addNewJob(
  job: NewJobWithUser
): Promise<UsersToJob | void> {
  try {
    if (job) {
    }
    const newJob = await db
      .insert(jobs)
      .values({
        ...job.job,
      })
      .returning();
    const cutterList: UsersToJob[] = [];
    if (job.cutters) {
      for (const cutter of job.cutters) {
        const cutterId = await getCutterId(cutter.name);
        if (cutterId) {
          cutterList.push({ userId: cutterId, jobId: newJob[0].id });
        } else {
          console.log(`In addNewJob getting cutter ID failed!`);
          throw new Error(`In addNewJob getting cutter ID failed!`);
        }
      }
    }

    const newUserToJob = await db
      .insert(usersToJobs)
      .values(cutterList)
      .returning();

    console.log(`NEW JOB ADDED:${newUserToJob}\n`);
    return newUserToJob[0];
  } catch (err) {
    console.log(
      `InsertNewJob functin failed! Dbactions file with error ${err}`
    );
  }
  // revalidatePath("/");
  revalidateTag("jobdata");
}

export async function lookUpUserByEmail(
  email: string
): Promise<boolean | undefined> {
  try {
    const checkUser: User[] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (checkUser[0].id) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(`LookUpUser functin failed! Dbactions file with error ${err}`);
    // throw new Error(
    //   `LookUpUser functin failed! Dbactions file with error ${err}`
    // );
  }
}

export async function addNewUser(user: NewUser): Promise<User | undefined> {
  try {
    const newUser: User[] = await db
      .insert(users)
      .values({ email: user.email, name: user.name })
      .returning();
    return newUser[0] as User;
  } catch (err) {
    console.log(
      `insertNewUser functin failed! Dbactions file with error ${err}`
    );
    // throw new Error(
    //   `insertNewUser functin failed! Dbactions file with error ${err}`
    // );
  }
}

export async function seed() {
  try {
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
           id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
            role TEXT DEFAULT "Guest",
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          invoice TEXT UNIQUE NOT NULL,
          sinks JSON,
          edges JSON,
          completed BOOLEAN DEFAULT FALSE,
          due_date DATE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        );

        CREATE TABLE IF NOT EXISTS users_to_jobs (
          user_id INTEGER REFERENCES users(id),
          job_id INTEGER REFERENCES jobs(id),
          PRIMARY KEY (user_id, job_id)
        );

        ALTER TABLE users_to_jobs
        ADD CONSTRAINT fk_users FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE;

        ALTER TABLE users_to_jobs
        ADD CONSTRAINT fk_jobs FOREIGN KEY (job_id)
        REFERENCES jobs(id) ON DELETE CASCADE;
    `);
  } catch (err) {
    console.log("Seed Failed!");
    console.log(err);
  }
}
