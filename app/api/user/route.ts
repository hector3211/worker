import { db, users } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function CheckUser() {
  const secret = process.env.NEXTAUTH_SECRET;
  const req = NextRequest.caller();
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
      return NextResponse.json({ user });
    }
    return NextResponse.json({ checkUser });
  } else {
    return NextResponse.error();
  }
}
const handler = CheckUser();
export { handler as GET, handler as POST };
