"use server";

import { db } from "@/db";
import {
  EditableJob,
  Job,
  JobData,
  JobsWithUsers,
  NewJobWithUser,
  NewUser,
  NewUsersToJob,
  User,
  UsersToJob,
  jobs,
  users,
  usersToJobs,
} from "@/db/schema";
import { adminKey, adminSecret } from "@/utils/globalConsts";
import { between, eq, like, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { utapi } from "uploadthing/server";
import { JobForm } from "./components/Addjobform";

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
      for (const email of job.cutters) {
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, email));
        await db
          .update(usersToJobs)
          .set({
            userId: user[0].id,
            userName: user[0].name,
            userEmail: user[0].email,
          })
          .where(eq(usersToJobs.jobId, job.id));
        // await db
        //   .insert(usersToJobs)
        //   .values({
        //     userId: user[0].id,
        //     userName: user[0].name,
        //     userEmail: user[0].email,
        //     jobId: job.id,
        //   })
        //   .onConflictDoUpdate({
        //     target: usersToJobs.userId,
        //     set: { jobId: job.id },
        //     where: sql`${usersToJobs.jobId} = '${job.id}'`,
        //   });
      }
    }
    revalidateTag("jobdata");
  } catch (err) {
    console.log(`editJob function failed! dbactions file with error ${err}`);
  }
}

export async function getManyUsers() {
  try {
    const users = await db.query.users.findMany({});
    return users;
  } catch (err) {
    console.log(
      `getManyUsers function failed! dbactions file with error ${err}`
    );
  }
}

export async function getJobs(): Promise<JobData[] | undefined> {
  try {
    const allJobs = await db.query.jobs.findMany({
      with: {
        user: true,
      },
    });

    revalidateTag("jobdata");
    return allJobs;
  } catch (err) {
    console.log(
      `GettingAllJobs functin failed! Dbactions file with error ${err}`
    );
  }
  revalidatePath("/");
}

export async function getCutterInfo(email: string): Promise<User | undefined> {
  console.log(`getcutterINFO email: ${email}`);
  const user = await db.select().from(users).where(eq(users.email, email));
  return user[0];
}

// export async function getCutterId(email: string): Promise<number | undefined> {
//   console.log(`cutterId function with email: ${email}\n`);
//   const id = await db.select().from(users).where(eq(users.email, email));
//   console.log(`CurrerID function with user id: ${JSON.stringify(id)}\n`);
//
//   return id[0].id;
// }

export async function addNewJob(
  job: NewJobWithUser
): Promise<UsersToJob | void> {
  // console.log(`job object getting passed down: ${JSON.stringify(job)}\n`);
  try {
    const newJob = await db
      .insert(jobs)
      .values({
        ...job.job,
      })
      .returning();
    const cutterList: NewUsersToJob[] = [];
    if (job.cutters) {
      for (const cutter of job.cutters) {
        // console.log(`current cutter name: ${cutter}\n`);
        const cutterInfo = await getCutterInfo(cutter);
        if (cutterInfo) {
          // console.log(`Got cutter ID⭐: ${cutterId}\n`);
          cutterList.push({
            userId: cutterInfo.id,
            jobId: newJob[0].id,
            userName: cutterInfo.name,
            userEmail: cutterInfo.email,
          });
        } else {
          console.log(
            `getCutterInfo in addNewJob function FAILED getting cutter ID!\n`
          );
          // throw new Error(`In addNewJob getting cutter ID failed!`);
        }
      }
    }

    const newUserToJob = await db
      .insert(usersToJobs)
      .values(cutterList)
      .returning();

    console.log(`NEW JOB ADDED✅:${newUserToJob}\n`);
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
    if (user && user.email === adminSecret) {
      const newUser: User[] = await db
        .insert(users)
        .values({ email: user.email, name: user.name, role: adminKey })
        .returning();
      return newUser[0] as User;
    }
    const newUser: User[] = await db
      .insert(users)
      .values({ email: user.email, name: user.name, role: user.role })
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
            role VARCHAR DEFAULT "Guest",
            due_date DATE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

        CREATE TABLE IF NOT EXISTS jobs (
          id SERIAL PRIMARY KEY,
          invoice TEXT UNIQUE NOT NULL,
          sinks JSON,
          edges JSON,
            prictures JSON,
          completed BOOLEAN DEFAULT FALSE,
          due_date DATE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        );

        CREATE TABLE IF NOT EXISTS users_to_jobs (
          user_id INTEGER REFERENCES users(id),
            user_email VARCHAR REFERENCES users(email),
            user_name VARCHAR REFERENCES users(name),
          job_id INTEGER REFERENCES jobs(id),
          PRIMARY KEY (user_id, job_id)
        );

        ALTER TABLE users_to_jobs
        ADD CONSTRAINT fk_users FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE CASCADE;

        ALTER TABLE users_to_jobs
        ADD CONSTRAINT fk_users FOREIGN KEY (user_email)
        REFERENCES users(email) ON DELETE CASCADE;

        ALTER TABLE users_to_jobs
        ADD CONSTRAINT fk_users FOREIGN KEY (user_name)
        REFERENCES users(name) ON DELETE CASCADE;

        ALTER TABLE users_to_jobs
        ADD CONSTRAINT fk_jobs FOREIGN KEY (job_id)
        REFERENCES jobs(id) ON DELETE CASCADE;
    `);
  } catch (err) {
    console.log("Seed Failed!");
    console.log(err);
  }
}
