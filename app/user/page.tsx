"use sever";
import { User } from "@clerk/nextjs/dist/types/server";
import { insertNewUser, lookUpUser } from "@/lib/dbactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

type PageProps = {
  params: {
    userEmail: string;
  };
};

// async function userServerAction(currUser: User | null) {
//   if (currUser) {
//     const userEmail = currUser.emailAddresses?.[0].emailAddress;
//     const userName = currUser?.firstName;
//     console.log(`Current User: ${userEmail} / ${userName}\n`);
//     if (userEmail && userName) {
//       const checkUser = await lookUpUser(userEmail);
//       if (!checkUser) {
//         const addUser = await insertNewUser(userEmail, userName);
//         return addUser;
//       }
//       console.log(`CheckerUser Ran correctly!`);
//       return checkUser;
//     }
//   }
// }
//
export default async function UserProfile() {
  const userFromSession = await getServerSession(authOptions);
  // const authUser = await userServerAction(userFromSession);

  return (
    <main className="text-white flex flex-col justify-center items-center text-xl">
      <div className="flex justify-between">
        <p className="text-3xl ">{userFromSession?.user?.name}</p>
      </div>
      <div className="flex justify-between">
        <p>{userFromSession?.user?.email}</p>
      </div>
    </main>
  );
}
