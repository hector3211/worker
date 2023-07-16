import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import UploadThing from "./Addjobform";

export default async function MobileNavButton() {
  const user = await currentUser();
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
            <Link href={"/"}>Home</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={"/about"}>Jobs</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {user ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <Link href={"/sign-in"}>SignIn</Link>
            )}
          </DropdownMenuItem>
          {user && (
            <DropdownMenuItem>
              <UploadThing />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
