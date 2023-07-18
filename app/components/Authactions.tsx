"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

// This is staying because I might switch back to NextAuth
// because it is free
export function SignOut() {
  return (
    <Button
      variant={"ghost"}
      className="text-md sm:text-lg rounded-md font-medium"
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
      className="text-md sm:text-lg rounded-md font-medium"
      onClick={() => signIn()}
    >
      Sign in
    </Button>
  );
}
