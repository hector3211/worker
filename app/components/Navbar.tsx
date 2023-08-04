"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { SignIn, SignOut } from "./Authactions";
import UploadThing from "../Uploadthing";
import { useSession } from "next-auth/react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

export default function Nav() {
  const { data: session } = useSession();
  const pathName = usePathname();
  console.log(`current path: ${pathName}`);

  return (
    <div className={`flex  justify-between items-center px-5 lg:px-8 py-3`}>
      <div className="md:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className="text-lg lg:text-4xl font-medium"
            >
              Menu
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 ml-5">
            <div className="flex flex-col items-start">
              <Link href={"/"}>
                <Button variant={"ghost"} className="text-md">
                  Home
                </Button>
              </Link>
              {session?.user.role && (
                <div>
                  {pathName === "/dashboard" ? (
                    <Button disabled>Dashbaord</Button>
                  ) : (
                    <Button>
                      <Link href={"/dashboard"}>Dashbaord</Link>
                    </Button>
                  )}
                </div>
              )}
              {session?.user.email && (
                <Link href={`/user`}>
                  <Button variant={"ghost"} className="text-md">
                    Projects
                  </Button>
                </Link>
              )}
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
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="hidden md:flex md:space-x-5 lg:space-x-4 md:items-center">
        <div className="flex ml-4 space-x-1 lg:space-x-4">
          <Link href={"/"}>
            <Button variant={"ghost"} className="text-md lg:text-lg">
              Home
            </Button>
          </Link>
          {session?.user.role && (
            <div>
              {pathName === "/dashboard" ? (
                <Button className="md:text-lg" disabled>
                  Dashbaord
                </Button>
              ) : (
                <Button variant={"ghost"} className="md:text-lg">
                  <Link href={"/dashboard"}>Dashbaord</Link>
                </Button>
              )}
            </div>
          )}
          {session?.user.email && (
            <div>
              {pathName === "/user" ? (
                <Link href={`/user`}>
                  <Button disabled className="md:text-lg">
                    Projects
                  </Button>
                </Link>
              ) : (
                <Link href={`/user`}>
                  <Button variant={"ghost"} className="md:text-lg">
                    Projects
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1 text-black">
        <div className="hidden md:flex md:space-x-1">
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
        </div>
        {session && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative rounded-full">
                <img
                  src={`${session.user.image}`}
                  alt="Image user"
                  className="w-10 rounded-full hover:cursor-pointer transition ease-in-out delay-75 hover:bg-blue-500 hover:translate-y-[-1px] hover:scale-105"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="mr-3 lg:mr-8">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>Check out your stats</CardDescription>
                    </div>
                    <div className="relative">
                      <img
                        src={`${session.user.image}`}
                        alt="Image user"
                        className="h-10 mr-1 rounded-full hover:cursor-pointer"
                      />
                      <span className="absolute top-0 right-1 flex h-3 w-3">
                        <span className="animate-ping inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="absolute top-0 right-0 inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col my-1">
                    <Label>Name</Label>
                    <p>{session.user.name}</p>
                  </div>
                  <div className="flex flex-col my-1">
                    <Label>Email</Label>
                    <p>{session.user.email}</p>
                  </div>
                  <div className="flex flex-col my-1">
                    <Label>Role</Label>
                    <p>{session.user.role ? "Admin" : "Guest"}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col w-full space-y-3">
                    <div className="flex flex-col space-y-1 md:hidden">
                      {session.user.role && <UploadThing />}
                      {session?.user.role && (
                        <div>
                          {pathName === "/register" ? (
                            <Button disabled className="w-full">
                              <Link href={"/register"}>+User</Link>
                            </Button>
                          ) : (
                            <Button variant={"outline"} className="w-full">
                              <Link href={"/register"}>+User</Link>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    <Separator />
                    {session && <SignOut />}
                  </div>
                </CardFooter>
              </Card>
            </PopoverContent>
          </Popover>
        )}
        {!session && <SignIn />}
      </div>
    </div>
  );
}
