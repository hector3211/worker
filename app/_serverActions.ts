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
import { and, between, eq, like, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { utapi } from "uploadthing/server";

export async function utapiDelete(file: string): Promise<void> {
  await utapi.deleteFiles(file);
}

export async function getTodaysJobs(): Promise<Job[] | undefined> {
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
    // updating selected job
    const updatedJob = await db
      .update(jobs)
      .set({
        sink: job.sinks,
        edge: job.edges,
        completed: job.completed,
        due_date: job.due_date,
      })
      .where(eq(jobs.id, job.id))
      .returning({ updatedJobId: jobs.id });
    console.log(`Just updated ✅ jobID: ${updatedJob}`);

    // querying all users on selected job
    const usersOnJob = await db
      .select()
      .from(usersToJobs)
      .where(eq(usersToJobs.jobId, job.id));

    // current cutters for job selected
    const currentUserEmails = usersOnJob.map((user) => {
      return user.userEmail;
    });
    console.log(`Current cutter's list: ${currentUserEmails}`);
    // new list of cutters for editing
    const newEmails = job.cutters;
    console.log(`New cutter's list: ${newEmails}`);

    // getting old cutter list
    const emailsToDelete = currentUserEmails?.filter(
      (email) => !newEmails?.includes(email)
    );
    console.log(`Current emails to delete from DB: ${emailsToDelete}`);
    // deleting cutters no longer on selected job
    if (emailsToDelete.length > 0) {
      for (const email of emailsToDelete) {
        const userDeletedFromJob = await db
          .delete(usersToJobs)
          .where(
            and(eq(usersToJobs.userEmail, email), eq(usersToJobs.jobId, job.id))
          )
          .returning({
            deletedUserWithEmail: usersToJobs.userEmail,
            jobId: usersToJobs.jobId,
          });
        console.log(`Just Deleted 💥 ${JSON.stringify(userDeletedFromJob)}`);
      }
    } else {
      console.log(`No Emails to Delete!`);
    }

    // newly added emails('cutters') to job
    const emailsToInsert = newEmails?.filter(
      (email) => !currentUserEmails.includes(email)
    );
    console.log(`New emails to insert in DB! :${emailsToInsert}`);
    if (emailsToInsert && emailsToInsert.length > 0) {
      for (const email of emailsToInsert) {
        const userToInsert = await getCutterInfo(email);
        if (userToInsert) {
          // inserting new emails(cutters) associated with selected job
          const newAddedUserToJob = await db
            .insert(usersToJobs)
            .values({
              userId: userToInsert.id,
              jobId: job.id,
              userEmail: userToInsert.email,
              userName: userToInsert.name,
            })
            .returning({ userEmail: usersToJobs.userEmail });
          console.log(
            `Inserted new_user_to_job ✅ : ${newAddedUserToJob[0].userEmail}`
          );
        } else {
          console.log(`Error userToInsert failed! line: 86`);
        }
      }
    } else {
      console.log(`No Emails to Insert`);
    }
    revalidateTag("jobdata");
    console.log(`Everything worked correctly!!! 🆕`);
  } catch (err) {
    console.log(
      `editJob function failed! _serveractions file with error ${err}`
    );
  }
}

export async function getManyUsers() {
  try {
    const users = await db.query.users.findMany({});
    return users;
  } catch (err) {
    console.log(
      `getManyUsers function failed! _serveractions file with error ${err}`
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
      `GettingAllJobs functin failed! _serveractions file with error ${err}`
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
): Promise<UsersToJob | undefined> {
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
      `InsertNewJob functin failed! _serveractions file with error ${err}`
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
    console.log(
      `LookUpUser functin failed! _serveractions file with error ${err}`
    );
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
      `insertNewUser functin failed! _serveractions file with error ${err}`
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
