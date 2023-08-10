import { getUserInfo } from "@/app/_serverActions";
import { adminKey, adminSecret } from "@/utils/globalConsts";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session) {
        if (token.userRole) {
          session.user.role = token.userRole as string;
        }
      }
      return session;
    },
    async jwt({ token }) {
      const currentUser = await getUserInfo(token.email || "");
      if (token && currentUser) {
        if (currentUser.email === adminKey) {
          token.userRole = adminSecret;
        } else {
          token.userRole = currentUser.role;
        }
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
