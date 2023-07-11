"use server";

import { eq } from "drizzle-orm";
import { User, db, users } from "./drizzle";

export async function lookUpUser(email: string): Promise<boolean> {
  const checkUser = await db.select().from(users).where(eq(users.email, email));

  if (checkUser) {
    return true;
  }
  return false;
}

export async function insertNewUser(email: string, name: string) {
  const user = await db.insert(users).values({ email: email, name: name });
  if (user) {
    return user;
  }

  return null;
}
