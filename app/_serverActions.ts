"use server";

import { cookies } from "next/headers";
import {
  editJob,
  getAllJobs,
  insertNewJob,
  insertNewUser,
  lookUpUser,
} from "@/lib/dbactions";
import { EditableJob, Job, NewJob, NewUser, User } from "@/lib/drizzle";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "next-auth";
import { getToken } from "next-auth/jwt";

export async function setCookie(req: NextRequest) {
  const token = await getToken({ req });
  const adminKey = process.env.ADMIN_KEY;
  const adminSecret = process.env.ADMIN_SECRET;
  if (token) {
    if (token.userRole === adminSecret) {
    }
  }
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
