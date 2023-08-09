import { IoWarningOutline } from "react-icons/io5";
import { AiOutlinePicture } from "react-icons/ai";
import { getUsersJobs } from "@/app/_serverActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import DoneButton from "../components/Markdonebutton";
import { Separator } from "../components/ui/separator";
import Link from "next/link";

export default async function UserProfile() {
  const currUser = await getServerSession(authOptions);
  // const authUser = await userServerAction(currUser);
  if (!currUser) {
    console.log(`Redirected!`);
    redirect("/");
  }
  const data = await getUsersJobs(currUser.user.email);
  return (
    <main className="py-5">
      <div className="flex justify-center h-[720px] md:h-[750px] lg:h-[800px]">
        <ScrollArea className="w-full md:w-1/2 lg:w-1/3 p-3">
          {data?.map((job) => (
            <Card
              key={job.id}
              className="my-2 bg-gray-300 text-black dark:bg-gray-900 dark:text-white"
            >
              <CardHeader>
                <CardTitle>
                  <div className="flex space-x-1">
                    <p className="font-normal">Invoice</p>
                    <p>#{job.invoice}</p>
                  </div>
                </CardTitle>
                <CardDescription>Job attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  {job.pictures && job.pictures?.length > 0 ? (
                    <div className="flex overflow-x-auto max-w-full p-4 space-x-2 rounded-md ">
                      {job.pictures?.map((pic, idx) => (
                        <Link
                          className="min-w-fit h-[180px] shadow-2xl"
                          href={`${pic}`}
                          target="_blank"
                        >
                          <img
                            key={idx}
                            src={`${pic}`}
                            alt={`Picture ${idx} of job`}
                            className="h-full rounded-md"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[180px] flex flex-col space-x-2 justify-center items-center bg-gray-700 rounded-md">
                      <AiOutlinePicture className="animate-pulse bg-cover text-8xl" />
                      <p className="text-rose-500">No Pictues Provided</p>
                    </div>
                  )}
                  <div className="flex mt-5 justify-evenly items-start">
                    {job.sink && job.sink.length > 0 && (
                      <div className="flex flex-col">
                        <Label className="font-medium text-lg">Sinks</Label>
                        {job.sink.map((sink, idx) => (
                          <p key={idx}>{sink}</p>
                        ))}
                      </div>
                    )}
                    {job.edge && job.edge.length > 0 && (
                      <div className="flex flex-col">
                        <Label className="font-medium text-lg">Edges</Label>
                        {job.edge.map((edge, idx) => (
                          <p key={idx}>{edge}</p>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <Label className="font-medium text-lg">Sent Date</Label>
                      <p>{job.created_at.toISOString().slice(0, 10)}</p>
                    </div>
                    <div className="flex flex-col">
                      <Label className="font-medium text-lg">Due Date</Label>
                      <p>
                        {job.due_date ? job.due_date : "No Due Date Provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {job && (
                  <DoneButton jobId={job.id} isCompleted={job.completed!} />
                )}
              </CardFooter>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </main>
  );
}
