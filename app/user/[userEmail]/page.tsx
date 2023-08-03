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
      <div className="flex justify-center items-center space-x-3">
        <h1 className="md:text-3xl">Welcome</h1>
        <p className="md:text-3xl font-medium">{currUser?.user?.name}</p>
      </div>
      <div className="flex justify-center">
        <ScrollArea className="max-h-screen w-full md:w-1/2 p-3">
          {data?.map((job) => (
            <Card key={job.id} className="my-2">
              <CardHeader>
                <CardTitle>
                  {job.invoice} with JobId:{job.id}
                </CardTitle>
                <CardDescription>Job attributes</CardDescription>
              </CardHeader>
              <CardContent>
                {job.pictures && job.pictures?.length > 0 ? (
                  <div>
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
                  <p className="text-center bg-rose-400 p-3 rounded-md">
                    Job has no pictures
                  </p>
                )}
                <div>
                  <Label className="font-medium text-lg">Sent Date</Label>
                  <p>{job.created_at.toISOString().slice(0, 10)}</p>
                </div>
                {job.sink && job.sink.length > 0 && (
                  <div>
                    <Label className="font-medium text-lg">Sinks</Label>
                    {job.sink.map((sink, idx) => (
                      <p key={idx}>{sink}</p>
                    ))}
                  </div>
                )}
                {job.edge && job.edge.length > 0 && (
                  <div>
                    <Label className="font-medium text-lg">Edges</Label>
                    {job.edge.map((edge, idx) => (
                      <p key={idx}>{edge}</p>
                    ))}
                  </div>
                )}
                <div>
                  <Label className="font-medium text-lg">Due Date</Label>
                  <p>{job.due_date ? job.due_date : "No Due Date Provided"}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Mark Done</Button>
              </CardFooter>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </main>
  );
}
