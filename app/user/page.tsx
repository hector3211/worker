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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

async function CutterView() {
  const currUser = await getServerSession(authOptions);
  if (!currUser) {
    console.log(`Redirected!`);
    redirect("/");
  }
  const data = await getUsersJobs(currUser.user.email);
  return (
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
                      className="h-[180px] lg:h-[250px] shadow-2xl"
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
                <div className="h-[180px] lg:h-[250px] flex flex-col space-x-2 justify-center items-center bg-gray-700 rounded-md">
                  <AiOutlinePicture className="animate-pulse bg-cover text-8xl" />
                  <p className="text-rose-500">No Pictues Provided</p>
                </div>
              )}
              <div className="flex mt-5 justify-evenly items-start">
                {job.sink && job.sink.length > 0 && (
                  <div className="flex flex-col ">
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
                  <p>{job.due_date ? job.due_date : "No Due Date Provided"}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {job && <DoneButton jobId={job.id} isCompleted={job.completed!} />}
          </CardFooter>
        </Card>
      ))}
    </ScrollArea>
  );
}

async function FabricatorView() {
  return (
    <ScrollArea className="w-full md:w-1/2 lg:w-1/3 p-3">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Sinks</TableHead>
            <TableHead>Edges</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Completed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

export default async function UserProfile() {
  const currUser = await getServerSession(authOptions);
  // const authUser = await userServerAction(currUser);
  if (!currUser) {
    console.log(`Redirected!`);
    redirect("/");
  }
  const data = await getUsersJobs(currUser.user.email);
  return (
    <main className=" py-5">
      <div className="px-6 lg:px-8">
        <div
          className="absolute inset-x-0 bottom-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 sm:right-30"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-yellowprimary to-greenprimary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      <div className="flex justify-center h-[720px] md:h-[750px] lg:h-[800px]">
        <ScrollArea className="border border-white rounded-md w-full md:w-1/2 lg:w-1/3 p-3">
          <h1 className="text-right font-light text-sm">All</h1>
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
                          className="min-w-full h-[180px] lg:h-[250px] shadow-2xl"
                          href={`${pic}`}
                          target="_blank"
                        >
                          <img
                            key={idx}
                            src={`${pic}`}
                            alt={`Picture ${idx} of job`}
                            className="h-full w-full rounded-md"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="h-[180px] lg:h-[250px] flex flex-col space-x-2 justify-center items-center bg-gray-700 rounded-md">
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
