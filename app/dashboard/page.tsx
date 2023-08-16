import { getJobs, getTodaysJobs } from "../_serverActions";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { DataTable } from "../jobs/Datatable";
import { columns } from "../jobs/columns";
import Footer from "../components/Footer";
import { ScrollArea } from "../components/ui/scroll-area";
import Loading from "../loading";
import { Separator } from "../components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

async function fetchJobs() {
  const recentJobs = await getTodaysJobs();
  const allJobs = await getJobs();
  return {
    recent: recentJobs,
    all: allJobs,
  };
}

export default async function DashBoard() {
  const { recent, all } = await fetchJobs();

  return (
    <main className="pb-10">
      <div className=" px-6 lg:px-8">
        <div
          className="absolute inset-x-0 -top-80 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
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
      <div className="flex flex-col">
        {recent && recent.length > 0 ? (
          <Suspense fallback={<Loading />}>
            <Table>
              <TableCaption>A list of todays invoices.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.invoice}</TableCell>
                    <TableCell className="flex flex-col">
                      {job.sink?.map((sink, idx) => (
                        <p key={idx}>{sink}</p>
                      ))}
                    </TableCell>
                    <TableCell className="flex flex-col">
                      {job.edge?.map((edge, idx) => (
                        <p key={idx}>{edge}</p>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      {job.completed === false ? "⚠️" : "✅"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Suspense>
        ) : null}
        <Separator className="w-full" />
        {all ? (
          <Suspense fallback={<Loading />}>
            <DataTable columns={columns} data={all} />
          </Suspense>
        ) : null}
      </div>
    </main>
  );
}
