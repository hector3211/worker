import { insertNewUser, lookUpUser } from "@/lib/dbactions";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NewUser } from "@/lib/drizzle";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
    async session({ session, token, user }) {
      if (token && session) {
        session.user.role = token.userRole as string;
      }
      return session;
    },
    async jwt({ token }) {
      if (token && token.email === process.env.ADMIN_KEY) {
        token.userRole = process.env.ADMIN_SECRET;
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
