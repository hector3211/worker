import { insertNewUser, lookUpUser } from "@/lib/dbactions";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NewUser, User } from "@/lib/drizzle";
import { redirect } from "next/navigation";
import Nav from "@/components/Navbar";

type PageProps = {
  params: {
    userEmail: string;
  };
};

async function userServerAction(user: Session | null) {
  const currUser = user?.user;
  if (currUser) {
    const userEmail = currUser?.email;
    const userName = currUser?.name;
    const newUser: NewUser = {
      email: userEmail as string,
      name: userName as string,
    };
    console.log(`Current User: ${userEmail} / ${userName}\n`);
    if (userEmail && userName) {
      const checkUser = await lookUpUser(userEmail);
      if (!checkUser) {
        const addUser = await insertNewUser(newUser);
        return addUser;
      }
      console.log(`CheckerUser Ran correctly!`);
      return checkUser;
    }
  }
}

export default async function UserProfile({ params: userEmail }: PageProps) {
  const currUser = await getServerSession(authOptions);
  // const authUser = await userServerAction(currUser);
  if (!currUser) {
    redirect("/");
  }
  return (
    <main>
      <Nav />
      <h1>user</h1>
      <p>Name: {currUser?.user?.name}</p>
      <p>Email: {currUser?.user?.email}</p>
    </main>
  );
}
