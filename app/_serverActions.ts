"use server";

import {
  editJob,
  getAllJobs,
  insertNewJob,
  insertNewUser,
  lookUpUser,
} from "@/lib/dbactions";
import { EditableJob, Job, NewJob, NewUser, User } from "@/lib/drizzle";
import { revalidatePath } from "next/cache";
import { utapi } from "uploadthing/server";

export async function utapiDelete(file: string) {
  await utapi.deleteFiles(file);
}

export async function updateJob(job: EditableJob) {
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
