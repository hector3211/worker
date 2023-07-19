import { between, eq, sql } from "drizzle-orm";
import {
  EditableJob,
  Job,
  NewJob,
  NewUser,
  User,
  db,
  jobs,
  users,
} from "./drizzle";

export async function editJob(job: EditableJob) {
  try {
    await db
      .update(jobs)
      .set({
        sink: job.sink,
        edge: job.edge,
        cutter: job.cutter,
        completed: job.completed,
      })
      .where(eq(jobs.id, job.id));
  } catch (err) {
    console.log(`editJob function failed! dbactions file with error ${err}`);
  }
}

export async function getJob(id: number) {
  try {
    const job: Job[] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job[0] as Job;
  } catch (err) {
    console.log(`getJob function failed! dbactions file with error ${err}`);
  }
}

export async function getRecentJobs() {
  try {
    const currDateTime = new Date();
    const todayAtSixeAm = new Date();
    todayAtSixeAm.setHours(6, 0, 0, 0);
    const recentJobs = await db
      .select()
      .from(jobs)
      .where(between(jobs.createdAt, todayAtSixeAm, currDateTime));

    return recentJobs as Job[];
  } catch (err) {
    console.log(
      `GetRecentJobs function failed! dbactions file with error ${err}`
    );
  }
}

export async function getAllJobs() {
  try {
    const allJobs = await db.select().from(jobs);
    return allJobs as Job[];
  } catch (err) {
    console.log(
      `GettingAllJobs functin failed! Dbactions file with error ${err}`
    );
  }
}

export async function insertNewJob(job: NewJob) {
  try {
    const newJob = await db
      .insert(jobs)
      .values({
        invoice: job.invoice,
        sink: job.sink,
        edge: job.edge,
        cutter: job.cutter,
        picture: job.picture,
      })
      .returning();

    return newJob[0] as Job;
  } catch (err) {
    console.log(
      `InsertNewJob functin failed! Dbactions file with error ${err}`
    );
  }
}

export async function lookUpUser(email: string) {
  try {
    const checkUser: User[] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    return checkUser[0] as User;
  } catch (err) {
    console.log(`LookUpUser functin failed! Dbactions file with error ${err}`);
    throw new Error(
      `LookUpUser functin failed! Dbactions file with error ${err}`
    );
  }
}

export async function insertNewUser(newUser: NewUser) {
  try {
    const user: User[] = await db
      .insert(users)
      .values({ email: newUser.email, name: newUser.name })
      .returning();
    return user[0] as User;
  } catch (err) {
    console.log(
      `insertNewUser functin failed! Dbactions file with error ${err}`
    );
    throw new Error(
      `insertNewUser functin failed! Dbactions file with error ${err}`
    );
  }
}
