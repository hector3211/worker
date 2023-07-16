import { authMiddleware } from "@clerk/nextjs";
import { redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // if (auth.userId && req.nextUrl.pathname !== "/user") {
    //   const url = new URL("/user", req.url);
    //   return NextResponse.redirect(url);
    // }
  },
  publicRoutes: [
    "/",
    "/job/(.*)",
    "/(user)(.*)",
    "/api/uploadthing",
    "/api/user",
    "/api/user/current",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
