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
import { Job, JobData, JobsWithUsers, User } from "@/db/schema";

type TableProps = {
  jobData: JobData[];
  category: string;
};

export default async function JobTable({ jobData, category }: TableProps) {
  const userSession = await getServerSession(authOptions);
  console.log(
    `jobs to JobTable : ${JSON.stringify(
      jobData.flatMap((user) => user.user)
    )}\n`
  );
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
          {jobData.map((job) => (
            <TableRow key={job.invoice}>
              <TableCell className="font-medium">
                <Link href={`/job/${job.id}`}>{job.invoice}</Link>
              </TableCell>
              <TableCell>{job.sink}</TableCell>
              <TableCell>{job.edge}</TableCell>
              <TableCell className="">{`${
                job.completed === false ? "⚠️" : "✅"
              }`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
