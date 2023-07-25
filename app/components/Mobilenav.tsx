import UploadThing from "../Uploadthing";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { SignIn, SignOut } from "./Authactions";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function MobileNavButton() {
  const userFromSession = await getServerSession(authOptions);
  return (
    <div className="block md:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"secondary"} className="text-md">
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-5">
          <DropdownMenuItem>
            <Button variant={"link"}>
              <Link href={"/"}>Home</Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button variant={"link"}>
              <Link href={"/about"}>Jobs</Link>
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {userFromSession ? <SignOut /> : <SignIn />}
          </DropdownMenuItem>
          {userFromSession?.user.role && <UploadThing />}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
