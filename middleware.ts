import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const key = process.env.ADMIN_SECRET;
  if (request.nextUrl.pathname === "/dashboard") {
    if (!token || token?.userRole !== key) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = { matcher: ["/user/(.*)", "/jobs/(.*)", "/dashboard"] };
