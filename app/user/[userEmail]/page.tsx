"use sever";
import { User } from "@clerk/nextjs/dist/types/server";
import { insertNewUser, lookUpUser } from "@/lib/Dbactions";
import { currentUser } from "@clerk/nextjs";

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
    <div>
      <h1>user</h1>
      <p>Name: {authUser?.email}</p>
      <p>Email: {authUser?.email}</p>
    </div>
  );
}
