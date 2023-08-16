"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { SignIn, SignOut } from "./Authactions";
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
import ThemeToggleButton from "./Themebutton";
import { BsFillPersonFill } from "react-icons/bs";
import JobForm from "./Addjobform";

function MobileNav() {
  const { data: session } = useSession();
  const pathName = usePathname();
  return (
    <div className="md:hidden">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"ghost"} className="text-lg lg:text-4xl font-medium">
            Menu
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 ml-5 text-black bg-gray-300 dark:bg-zinc-950 dark:text-white">
          <div className="flex flex-col items-start">
            <Link href={"/"}>
              <Button variant={"ghost"} className="text-md">
                Home
              </Button>
            </Link>
            {session?.user.role ? (
              <>
                {pathName === "/dashboard" ? (
                  <Button disabled>Dashboard</Button>
                ) : (
                  <Link href={"/dashboard"}>
                    <Button variant={"ghost"} className="text-md">
                      Dashboard
                    </Button>
                  </Link>
                )}
              </>
            ) : null}
            {session?.user.role === "Cutter" ? (
              <>
                {pathName === "/user" ? (
                  <Button disabled>Projects</Button>
                ) : (
                  <Link href={`/user`}>
                    <Button variant={"ghost"} className="text-md">
                      Projects
                    </Button>
                  </Link>
                )}
              </>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function StandardNav() {
  const { data: session } = useSession();
  const pathName = usePathname();
  return (
    <div className="hidden md:flex md:space-x-5 lg:space-x-4 md:items-center">
      <div className="flex space-x-1 lg:space-x-4">
        <Link href={"/"}>
          <Button
            variant={"ghost"}
            className="text-lg hover:bg-gray-300 hover:dark:bg-gray-900"
          >
            Home
          </Button>
        </Link>
        {session?.user.role === "admin" && (
          <div>
            {pathName === "/dashboard" ? (
              <Button
                variant={"ghost"}
                className="md:text-lg dark:text-white"
                disabled
              >
                Dashboard
              </Button>
            ) : (
              <Button
                variant={"ghost"}
                className="text-lg hover:bg-gray-300 hover:dark:bg-gray-900"
              >
                <Link href={"/dashboard"}>Dashboard</Link>
              </Button>
            )}
          </div>
        )}
        {session?.user.role === "Cutter" ? (
          <>
            {pathName === "/user" ? (
              <Link href={`/user`}>
                <Button
                  disabled
                  variant={"ghost"}
                  className="md:text-lg dark:text-white"
                >
                  Projects
                </Button>
              </Link>
            ) : (
              <Link href={`/user`}>
                <Button
                  variant={"ghost"}
                  className="text-lg hover:bg-gray-300 hover:dark:bg-gray-900"
                >
                  Projects
                </Button>
              </Link>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function Nav() {
  const { data: session } = useSession();
  const pathName = usePathname();
  // console.log(`current path: ${pathName}`);

  return (
    <div className={`flex  justify-between items-center px-5 lg:px-8 py-3`}>
      <MobileNav />
      <StandardNav />
      <div className="flex items-center space-x-1 text-black">
        <div className="hidden md:flex md:space-x-1">
          {session?.user.role === "admin" ? (
            <>
              {pathName === "/newjob" ? (
                <Button
                  variant={"ghost"}
                  disabled
                  className="md:text-lg dark:text-white"
                >
                  +Job
                </Button>
              ) : (
                <Link href={"/newjob"}>
                  <Button
                    variant={"ghost"}
                    className="text-lg hover:bg-gray-300 hover:dark:bg-gray-900 dark:text-white"
                  >
                    +Job
                  </Button>
                </Link>
              )}
            </>
          ) : null}
          {session?.user.role === "admin" ? (
            <>
              {pathName === "/register" ? (
                <Button
                  variant={"ghost"}
                  disabled
                  className="md:text-lg dark:text-white"
                >
                  <Link href={"/register"}>+User</Link>
                </Button>
              ) : (
                <Button
                  variant={"ghost"}
                  className="text-lg hover:bg-gray-300 hover:dark:bg-gray-900 dark:text-white"
                >
                  <Link href={"/register"}>+User</Link>
                </Button>
              )}
            </>
          ) : null}
        </div>
        {session ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className="hover:bg-gray-300 hover:dark:bg-gray-900"
              >
                <BsFillPersonFill className="w-5 text-lg md:w-10 md:text-2xl  dark:text-white" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="dark:bg-zinc-950 mr-3 lg:mr-8">
              <Card className="dark:bg-zinc-950 border-none">
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
                        className="w-10 mr-1 rounded-full hover:cursor-pointer"
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
                    <p>{session.user.role}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex flex-col w-full space-y-3">
                    <div className="flex flex-col items-center space-y-1 md:hidden">
                      {session?.user.role === "admin" ? (
                        <>
                          {pathName === "/newjob" ? (
                            <Button disabled className="w-full">
                              +Job
                            </Button>
                          ) : (
                            <Link href={"/newjob"}>
                              <Button variant={"ghost"} className="w-full">
                                +Job
                              </Button>
                            </Link>
                          )}
                        </>
                      ) : null}
                      {session?.user.role === "admin" ? (
                        <>
                          {pathName === "/register" ? (
                            <Button disabled className="w-full">
                              <Link href={"/register"}>+User</Link>
                            </Button>
                          ) : (
                            <Button variant={"ghost"} className="w-full">
                              <Link href={"/register"}>+User</Link>
                            </Button>
                          )}
                        </>
                      ) : null}
                    </div>
                    <Separator />
                    {session && <SignOut />}
                  </div>
                </CardFooter>
              </Card>
            </PopoverContent>
          </Popover>
        ) : null}
        {!session ? <SignIn /> : null}
        <ThemeToggleButton />
      </div>
    </div>
  );
}
