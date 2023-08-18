import { getJob } from "@/app/_serverActions";
import { Label } from "@/app/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import Link from "next/link";
import { IoWarningOutline } from "react-icons/io5";

type PageProps = {
  params: {
    id: number;
  };
};

export default async function JobHome({ params: { id } }: PageProps) {
  const job = await getJob(id);
  return (
    <main className="pb-12">
      <div className="flex flex-col pt-10">
        {job?.pictures && job.pictures.length > 0 ? (
          <div className="flex flex-col md:flex-row justify-center">
            {job?.pictures?.map((pic, idx) => (
              <Link key={idx} href={pic} target="_blank">
                <img
                  key={idx}
                  alt={`picture #${idx}`}
                  className="w-full lg:h-auto h-64 object-cover object-center rounded"
                  src={`${pic}`}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full">
            <div className="flex justify-center">
              <div className="flex justify-center items-center bg-gray-700 animate-pulse w-[600px] h-[270px] rounded-md ">
                <IoWarningOutline className="text-orange-500 md:text-3xl" />
              </div>
              <div className="flex justify-center items-center bg-gray-700 animate-pulse w-[600px] h-[270px] rounded-md ">
                <IoWarningOutline className="text-orange-500 md:text-3xl" />
              </div>
            </div>
            <p className="text-rose-600">No Pictures Were Provided</p>
          </div>
        )}
        {job ? (
          <Table>
            <TableCaption>Job attributes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Invoice</TableHead>
                <TableHead>Sinks</TableHead>
                <TableHead>Edges</TableHead>
                <TableHead>Cutters</TableHead>
                <TableHead className="text-right">Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key={job.id}>
                <TableCell className="font-medium">#{job.invoice}</TableCell>
                <TableCell>
                  {job.sink?.map((sink, idx) => (
                    <p key={idx}>{sink}</p>
                  ))}
                </TableCell>
                <TableCell>
                  {job.edge?.map((edge, idx) => (
                    <p key={idx}>{edge}</p>
                  ))}
                </TableCell>
                <TableCell>
                  {job.user?.map((user, idx) => (
                    <p key={idx}>{user.userName.split(" ")[0]}</p>
                  ))}
                </TableCell>

                <TableCell className="text-right">
                  {job.completed === false ? "⚠️" : "✅"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : null}
      </div>
    </main>
  );
}
