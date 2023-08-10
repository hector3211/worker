"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

// This is staying because I might switch back to NextAuth
// because it is free
export function SignOut() {
  return (
    <Button
      className="w-full text-md rounded-md font-medium"
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  );
}

export function SignIn() {
  return (
    <Button
      variant={"ghost"}
      className="hover:dark:bg-gray-900 dark:text-white text-md rounded-md font-medium"
      onClick={() => signIn()}
    >
      Sign in
    </Button>
  );
}
