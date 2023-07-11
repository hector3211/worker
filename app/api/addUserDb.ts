import { db, users } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (token && token.name && token.email) {
    const checkUser = await db
      .select()
      .from(users)
      .where(eq(users.email, token.email));
    if (!checkUser) {
      const user = await db
        .insert(users)
        .values({ email: token.email, name: token.name });
      return (res.statusCode = 201), res.json(user);
    }
    return (res.statusCode = 200), res.json(checkUser);
  } else {
    return (
      (res.statusCode = 400), (res.statusMessage = "Error I messed up dude!!")
    );
  }
}
