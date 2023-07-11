"use client";
import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

export function SignOut() {
  return (
    <Button className="rounded-md" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}

export function SignIn() {
  return (
    <Button
      variant={"outline"}
      className="rounded-md hover:bg-orange-700"
      onClick={() => signIn()}
    >
      Sign in
    </Button>
  );
}
