"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { SignIn, SignOut } from "./Authactions";
import UploadThing from "../Uploadthing";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import Link from "next/link";
import UserForm from "./Userform";
import { usePathname } from "next/navigation";

export default function Nav() {
  const { data: session } = useSession();
  const pathName = usePathname();
  console.log(`current path: ${pathName}`);

  return (
    <div className={`flex justify-between items-center px-5 lg:px-8 py-3`}>
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className="text-3xl lg:text-4xl font-medium text-black"
            >
              Worker
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 ml-3">
            <div className="flex flex-col items-start">
              <Link href={"/"}>
                <Button variant={"ghost"} className="text-lg">
                  Home
                </Button>
              </Link>
              <Button variant={"ghost"} className="text-lg">
                Dashbaord
              </Button>
              <Button variant={"ghost"} className="text-md lg:text-lg">
                Team
              </Button>
              <Button variant={"ghost"} className="text-md lg:text-lg">
                Projects
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="hidden md:flex md:space-x-5 lg:space-x-4 md:items-center">
        <div className="ml-4 space-x-1 lg:space-x-4">
          <Link href={"/"}>
            <Button variant={"ghost"} className="text-lg ">
              Home
            </Button>
          </Link>
          {pathName === "/dashboard" ? (
            <Button disabled className="text-lg">
              Dashbaord
            </Button>
          ) : (
            <Button className="text-lg">
              <Link href={"/dashboard"}>Dashbaord</Link>
            </Button>
          )}
          <Button variant={"ghost"} className="text-md lg:text-lg">
            Team
          </Button>
          <Button variant={"ghost"} className="text-md lg:text-lg">
            Projects
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-1 text-black">
        {session?.user.role && <UploadThing />}
        {session?.user.role && (
          <div>
            {pathName === "/register" ? (
              <Button disabled>
                <Link href={"/register"}>+Add User</Link>
              </Button>
            ) : (
              <Button>
                <Link href={"/register"}>+Add User</Link>
              </Button>
            )}
          </div>
        )}
        {session && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative">
                <img
                  src={`${session.user.image}`}
                  alt="Image user"
                  className="w-10 rounded-full hover:cursor-pointer"
                />
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="absolute top-0 right-0 inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="mr-3 h-48">
              <div className="flex flex-col justify-between">
                <div className="p-3 flex flex-col outline outline-1 outline-black rounded-md">
                  <div className="flex space-x-2">
                    <p>Name:</p>
                    <p className="font-medium">{session.user.name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <p>Email:</p>
                    <p className="font-medium">{session.user.email}</p>
                  </div>
                  <div className="flex space-x-2">
                    <p>Role:</p>
                    <p className="font-medium">
                      {session?.user.role === "admin" ? "Admin" : "Guest"}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-5">
                  {session && <SignOut />}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        {!session && <SignIn />}
      </div>
    </div>
  );
}
