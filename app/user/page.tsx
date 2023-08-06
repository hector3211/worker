import { IoWarningOutline } from "react-icons/io5";
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
import { Button } from "@/components/ui/button";
import { Label } from "@/app/components/ui/label";
import DoneButton from "../components/Markdonebutton";

export default async function UserProfile() {
  const currUser = await getServerSession(authOptions);
  // const authUser = await userServerAction(currUser);
  if (!currUser) {
    console.log(`Redirected!`);
    redirect("/");
  }
  const data = await getUsersJobs(currUser.user.email);
  return (
    <main>
      <div className="flex justify-center">
        <ScrollArea className="max-h-screen w-full md:w-1/2 p-3">
          {data?.map((job) => (
            <Card
              key={job.id}
              className="my-2 bg-gray-300 text-black dark:bg-gray-900 dark:text-white"
            >
              <CardHeader>
                <CardTitle>
                  Invoice {job.invoice} with JobId: {job.id}
                </CardTitle>
                <CardDescription>Job attributes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  {job.pictures && job.pictures?.length > 0 ? (
                    <div className="flex flex-col">
                      {job.pictures?.map((pic, idx) => (
                        <img
                          key={idx}
                          src={`${pic}`}
                          alt={`Picture ${idx} of job`}
                          className="w-[150px]"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-[180px] flex space-x-2 justify-center items-center bg-gray-700 rounded-md">
                      <IoWarningOutline className="animate-pulse text-orange-500 md:text-2xl" />
                      <p className="text-rose-500">No Pictues Provided</p>
                    </div>
                  )}
                  <div className="flex mt-5 justify-evenly items-center">
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
