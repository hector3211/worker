import Link from "next/link";
import { Button } from "./ui/button";
import MobileNavButton from "./Mobilenav";
import { UserButton, currentUser } from "@clerk/nextjs";
import UploadThing from "./Addjobform";

export default async function Nav() {
  const userFromSession = await currentUser();

  return (
    <div className="fixed z-50 bg-transparent backdrop-blur-xl top-0 flex w-full justify-between items-center px-5 lg:px-8 py-3">
      <Button variant={"ghost"}>
        <Link href={"/"}>
          <h1 className="text-xl md:text-3xl font-extrabold">Worker</h1>
        </Link>
      </Button>
      <div className="hidden md:flex md:justify-between">
        <UploadThing />
        <Button variant={"link"} className="text-lg lg:text-xl">
          <Link href={"/"}>Home</Link>
        </Button>
        <Button variant={"link"} className="text-lg lg:text-xl">
          <Link href={"/about"}>about</Link>
        </Button>
        {userFromSession && (
          <Button variant={"link"} className="text-lg lg:text-xl">
            <Link href={`/user/`}>Jobs</Link>
          </Button>
        )}
        <Button variant={"link"} className="text-lg lg:text-xl">
          {userFromSession ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href={"/sign-in"}>SignIn</Link>
          )}
        </Button>
      </div>
      <MobileNavButton />
    </div>
  );
}
