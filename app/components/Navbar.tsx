import Link from "next/link";
import { Button } from "./ui/button";
import MobileNavButton from "./Mobilenav";
import { getServerSession } from "next-auth";
import { SignIn, SignOut } from "./Authactions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UploadThing from "../Uploadthing";

export default async function Nav() {
  const userFromSession = await getServerSession(authOptions);

  return (
    <div
      className={`fixed z-50 bg-gray-400 top-0 flex w-full justify-between items-center px-5 lg:px-8 py-3`}
    >
      <Button variant={"ghost"}>
        <Link href={"/"}>
          <h1 className="text-xl md:text-3xl font-extrabold">Worker</h1>
        </Link>
      </Button>
      <div className="hidden md:flex md:justify-between">
        {userFromSession?.user.role && <UploadThing />}
        <Button variant={"link"} className="text-lg lg:text-xl">
          <Link href={"/"}>Home</Link>
        </Button>
        {userFromSession ? <SignOut /> : <SignIn />}
      </div>
      <MobileNavButton />
    </div>
  );
}
