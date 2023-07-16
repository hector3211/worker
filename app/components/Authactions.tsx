"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

// This is staying because I might switch back to NextAuth
// because it is free
export function SignOut() {
  return (
    <Button
      variant={"link"}
      className="text-md lg:text-lg rounded-md"
      onClick={() => signOut()}
    >
      Sign out
    </Button>
  );
}

export function SignIn() {
  return (
    <Button
      variant={"link"}
      className="p-0 text-md lg:text-lg rounded-md"
      onClick={() => signIn()}
    >
      Sign in
    </Button>
  );
}
