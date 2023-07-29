"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "../components/Editjobbutton";
import { Job, JobData } from "@/db/schema";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<JobData>[] = [
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ row }) => {
      const result = row.original;
      return (
        <Link className="font-medium" href={`/job/${result.id}`}>
          {result.invoice}
        </Link>
      );
    },
  },
  {
    accessorKey: "sink",
    header: "Sink",
  },
  {
    accessorKey: "edge",
    header: "Edge",
  },
  {
    accessorKey: "cutter",
    header: "Cutters",
    cell: ({ row }) => {
      const results = row.original.user;
      return (
        <div className="flex flex-col ml-3">
          {results.map((cutter, idx) => (
            <p key={idx}>{cutter.userName}</p>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Done",
    cell: ({ row }) => {
      const result = row.original;
      return <p>{result.completed === false ? "⚠️" : "✅"}</p>;
    },
  },
  {
    accessorKey: "due_date",
    header: "Due_Date",
  },
  {
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => {
      const job = row.original;
      const cutterEmails: string[] = job.user.map((cutter) => {
        return cutter.userEmail;
      });

      return (
        <EditButton
          id={job.id}
          invoice={job.invoice}
          sinks={job.sink}
          edges={job.edge}
          cutterEmails={cutterEmails}
          completed={job.completed as boolean}
        />
      );
    },
  },
];
