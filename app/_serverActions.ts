"use server";

import { getAllJobs, insertNewJob } from "@/lib/Dbactions";
import { Job, NewJob } from "@/lib/drizzle";
import { revalidatePath } from "next/cache";

export async function getJobs() {
  await getAllJobs();
  revalidatePath("/");
}

export async function addNewJob(job: NewJob) {
  await insertNewJob(job);
  revalidatePath("/");
}
