"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "../components/Editjobbutton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColumnJob = {
  id: number;
  invoice: string;
  sink: string | null;
  edge: string | null;
  cutter: string | null;
  picture: string | null;
  completed: boolean | null;
  createdAt: Date;
};

export const columns: ColumnDef<ColumnJob>[] = [
  {
    accessorKey: "invoice",
    header: "invoice",
  },
  {
    accessorKey: "sink",
    header: "sink",
  },
  {
    accessorKey: "edge",
    header: "edge",
  },
  {
    accessorKey: "cutter",
    header: "cutter",
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
          picture={job.picture}
          createdAt={job.createdAt}
        />
      );
    },
  },
];
