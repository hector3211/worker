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
      return <Link href={`/job/${result.id}`}>{result.invoice}</Link>;
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
    header: "Cutter",
    cell: ({ row }) => {
      const results = row.original.user;
      return (
        <div>
          {results.map((cutter) => (
            <p>{cutter.userId}</p>
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
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => {
      const job = row.original;
      const cutterIds: number[] = job.user.map((id) => {
        return id.userId;
      });

      return (
        <EditButton
          id={job.id}
          invoice={job.invoice}
          sinks={job.sink}
          edges={job.edge}
          cutterIds={cutterIds}
          completed={job.completed as boolean}
        />
      );
    },
  },
];
