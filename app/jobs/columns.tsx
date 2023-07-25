"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "../components/Editjobbutton";
import { Job } from "@/lib/drizzle";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Job>[] = [
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

      return (
        <EditButton
          id={job.id}
          invoice={job.invoice}
          sink={job.sink}
          edge={job.edge}
          cutter={job.cutter}
          completed={job.completed as boolean}
        />
      );
    },
  },
];
