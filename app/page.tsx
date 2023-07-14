import { seed } from "@/lib/drizzle";
import UploadThing from "./example-uploader";
import { getAllJobs, getRecentJobs } from "@/lib/Dbactions";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditButton } from "@/components/Editjobbutton";

async function fetchRecentJobs() {
  // const recentJobs = await getRecentJobs();
  const recentJobs = await getAllJobs();
  return recentJobs;
}

export default async function Home() {
  const jobs = await fetchRecentJobs();
  return (
    <main className="">
      <UploadThing />
      <h1 className="text-center text-white text-3xl">Recently Added</h1>
      <div className="h-1 bg-white w-full"></div>
      <div className="py-11 flex  overflow-auto">
        {jobs?.map((job) => (
          <Card className="w-[300px] relative mx-2">
            <CardHeader>
              <CardTitle>#{job.invoice}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="absolute top-[-10px] right-[-10px]">
                <Avatar>
                  <AvatarImage src="https://media.licdn.com/dms/image/C4E03AQG7ty6QC0J36A/profile-displayphoto-shrink_200_200/0/1638498523408?e=1694649600&v=beta&t=axi7a5fY_J4Mrcfi3kwgAC7LVDQJ3VSdGuuxz3bmaXo" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
              <div className="py-1 flex justify-evenly items-center">
                <div className="flex items-center">
                  <Label className="mr-1">Edge:</Label>
                  <p className="uppercase">{job.edge}</p>
                </div>
                <div className="flex items-center">
                  <Label className="mr-1">Sink:</Label>
                  <p>{job.sink}</p>
                </div>
              </div>
              <div>
                <Link href={`${job.picture}`} target="_blank">
                  <img
                    src={`${job.picture}`}
                    alt="Job picture"
                    className="w-[250px] rounded-md"
                  />
                </Link>
              </div>
            </CardContent>
            <CardFooter>
              {job.sink &&
                job.edge &&
                job.cutter &&
                job.picture &&
                job.completed && (
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
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
} // this up there is actually disgusting
