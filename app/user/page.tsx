"use sever";
import { User } from "@clerk/nextjs/dist/types/server";
import { insertNewUser, lookUpUser } from "@/lib/Dbactions";
import { currentUser } from "@clerk/nextjs";
import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";

type PageProps = {
  params: {
    userEmail: string;
  };
};

async function userServerAction(currUser: User | null) {
  if (currUser) {
    const userEmail = currUser.emailAddresses?.[0].emailAddress;
    const userName = currUser?.firstName;
    console.log(`Current User: ${userEmail} / ${userName}\n`);
    if (userEmail && userName) {
      const checkUser = await lookUpUser(userEmail);
      if (!checkUser) {
        const addUser = await insertNewUser(userEmail, userName);
        return addUser;
      }
      console.log(`CheckerUser Ran correctly!`);
      return checkUser;
    }
  }
}

export default async function UserProfile() {
  const userFromSession = await currentUser();
  const authUser = await userServerAction(userFromSession);

  return (
    <div className="text-white flex flex-col justify-center items-center text-xl">
      <div className="flex justify-between">
        <p className="text-3xl ">{authUser?.name}</p>
      </div>
      <div className="flex justify-between">
        <p>{authUser?.email}</p>
      </div>
    </div>
  );
}
