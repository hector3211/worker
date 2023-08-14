"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "../components/Editjobbutton";
import { Job, JobData } from "@/db/schema";
import Link from "next/link";
import DeleteButton from "../components/Deletebutton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<JobData>[] = [
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => {
      const result = row.original;
      return (
        <Link className="font-medium " href={`/job/${result.id}`}>
          #{result.invoice}
        </Link>
      );
    },
  },
  {
    accessorKey: "sink",
    header: "Sink",
    cell: ({ row }) => {
      const results = row.original.sink;
      return (
        <div className="flex flex-col ml-3">
          {results?.map((sink, idx) => (
            <p key={idx}>{sink}</p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "edge",
    header: "Edge",
    cell: ({ row }) => {
      const results = row.original.edge;
      return (
        <div className="flex flex-col ml-3">
          {results?.map((edge, idx) => (
            <p key={idx}>{edge}</p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "cutter",
    header: "Cutters",
    cell: ({ row }) => {
      const results = row.original.user;
      return (
        <div className="flex flex-col ml-3">
          {results.map((cutter, idx) => (
            <p key={idx}>{cutter.userName.split(" ")[0]}</p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Sent",
    cell: ({ row }) => {
      const date = row.original.created_at;
      return <p>{date.toISOString().slice(0, 10)}</p>;
    },
  },
  {
    accessorKey: "completed",
    header: "Done",
    cell: ({ row }) => {
      const result = row.original;
      return <p key={result.id}>{result.completed === false ? "⚠️" : "✅"}</p>;
    },
  },
  {
    accessorKey: "due_date",
    header: "Due_Date",
  },
  {
    id: "editActions",
    enableHiding: true,
    cell: ({ row }) => {
      const job = row.original;
      const cutterEmails: string[] = job.user.map((cutter) => {
        return cutter.userEmail;
      });
      let myDate: Date | null = new Date();
      const mystring: string | null = job.due_date;
      if (mystring) {
        myDate = new Date(mystring);
        // Split the date string into year, month, and day components
        const [yearStr, monthStr, dayStr] = mystring.split("-");
        // JavaScript's Date object uses 0-based month index, so we need to subtract 1 from the month
        const month = parseInt(monthStr, 10) - 1;
        // Create the Date object with the components
        myDate = new Date(parseInt(yearStr, 10), month, parseInt(dayStr, 10));
      } else {
        myDate = null;
      }

      return (
        <EditButton
          key={job.id}
          id={job.id}
          invoice={job.invoice}
          sinks={job.sink}
          edges={job.edge}
          cutterEmails={cutterEmails}
          completed={job.completed as boolean}
          dueDate={myDate}
        />
      );
    },
  },
  {
    id: "deleteActions",
    enableHiding: true,
    cell: ({ row }) => {
      const job = row.original;

      return (
        <div key={job.id}>
          <DeleteButton jobInvoice={job.invoice} jobId={job.id} />
        </div>
      );
    },
  },
];
