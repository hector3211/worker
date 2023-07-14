"use server";

import {
  editJob,
  getAllJobs,
  insertNewJob,
  insertNewUser,
  lookUpUser,
} from "@/lib/dbactions";
import { Job, NewJob, NewUser, User } from "@/lib/drizzle";
import { revalidatePath } from "next/cache";

export async function updateJob(job: Job) {
  await editJob(job);
  revalidatePath("/");
}

export async function getJobs() {
  await getAllJobs();
  revalidatePath("/");
}

export async function addNewJob(job: NewJob) {
  await insertNewJob(job);
  revalidatePath("/");
}

export async function lookUpUserByEmail(email: string) {
  await lookUpUser(email);
}

export async function addNewUser(user: NewUser) {
  await insertNewUser(user);
  revalidatePath("/");
}
