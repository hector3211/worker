import { eq } from "drizzle-orm";
import { User, db, users } from "./drizzle";

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
