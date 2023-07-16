import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const token = await getToken({ req });
  const adminKey = process.env.ADMIN_KEY;
  const adminSecret = process.env.ADMIN_SECRET;
  if (token) {
    return new Response("Gotcha!", { status: 200 });
  }
  return new Response("Error with token", { status: 401 });
}
