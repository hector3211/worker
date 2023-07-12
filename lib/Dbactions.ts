import { eq } from "drizzle-orm";
import { Job, NewJob, User, db, jobs, users } from "./drizzle";

export async function getAllJobs() {
  try {
    const allJobs = await db.select().from(jobs);
    return allJobs;
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
  const checkUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (!checkUser) {
    console.log(`No user in DB!`);
    return;
  }
  return checkUser[0] as User;
}

export async function insertNewUser(email: string, name: string) {
  const user: User[] = await db
    .insert(users)
    .values({ email: email, name: name })
    .returning();
  if (!user) {
    return null;
  }
  return user[0] as User;
}
