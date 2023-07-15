"use client";

import { Job } from "@/lib/drizzle";
import { EditButton } from "./Editjobbutton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import Link from "next/link";

type TableProps = {
  jobs: Job[] | null | undefined;
};

export default function RecentJobs({ jobs }: TableProps) {
  return (
    <div className="flex overflow-x-auto scroll-smooth max-w-full p-4 space-x-2 bg-neutral rounded-box">
      {jobs?.map((job) => (
        <Card className="min-w-[350px]">
          <CardHeader>
            <CardTitle>{job.invoice}</CardTitle>
            <CardDescription>{job.completed}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div>
                <Link href={`${job.picture}`} target="_blank">
                  <img
                    src={`${job.picture}`}
                    alt={`#${job.invoice} picture`}
                    className="min-w-[250px] rounded-md"
                  />
                </Link>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-around items-center">
                <div>
                  <Label>Cutter</Label>
                  <p>{job.cutter}</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <Label>Sink</Label>
                  <p>{job.sink}</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <Label>Edge</Label>
                  <p>{job.edge}</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div>
                  <Label>completed</Label>
                  <p>{job.completed === false ? "False" : "True"}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <EditButton
              id={job.id}
              invoice={job.invoice}
              sink={job.sink}
              edge={job.edge}
              cutter={job.cutter}
              picture={job.picture}
              completed={job.completed}
              createdAt={job.createdAt}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
