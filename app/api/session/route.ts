import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest, res: Response) {
  const secret = process.env.NEXTAUTH_SECRET;
  const sess = await getServerSession(authOptions);
  return NextResponse.json({ session: sess });
}
