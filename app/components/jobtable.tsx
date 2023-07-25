import { Job } from "@/lib/drizzle";
import { EditButton } from "./Editjobbutton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

type TableProps = {
  jobs: Job[] | null | undefined;
  category: string;
};

export default async function JobTable({ jobs, category }: TableProps) {
  const userSession = await getServerSession(authOptions);
  return (
    <div className="text-white w-5/6 lg:max-w-3xl mx-auto mt-10 py-3 px-10 border border-white rounded-md">
      <Table>
        <TableCaption>{`A list of your ${category} invoices.`}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Sink</TableHead>
            <TableHead>Edge</TableHead>
            <TableHead>Cutter</TableHead>
            <TableHead>Done</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs?.map((job) => (
            <TableRow key={job.invoice}>
              <TableCell className="font-medium">
                <Link href={`/job/${job.id}`}>{job.invoice}</Link>
              </TableCell>
              <TableCell>{job.sink}</TableCell>
              <TableCell>{job.edge}</TableCell>
              <TableCell>{job.cutter}</TableCell>
              <TableCell className="">{`${
                job.completed === false ? "⚠️" : "✅"
              }`}</TableCell>
              {userSession?.user.role === process.env.ADMIN_SECRET && (
                <TableCell>
                  <EditButton
                    id={job.id}
                    invoice={job.invoice}
                    sink={job.sink}
                    edge={job.edge}
                    cutter={job.cutter}
                    completed={job.completed as boolean}
                    picture={job.picture}
                    createdAt={job.createdAt}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
