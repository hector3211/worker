"use client";
import { useTransition } from "react";
import { deleteJob } from "../_serverActions";
import { Button } from "./ui/button";

type DeleteButtonProps = {
  jobId: number;
};

export default function DeleteButton({ jobId }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  async function removeJob(id: number) {
    const res = await deleteJob(id);
    startTransition(async () => await deleteJob(id));
    if (!res) {
      console.log(`Deleted job client function failed!`);
    }
    console.log(`Successfully deleted job with ID: ${id}`);
  }

  if (isPending) {
    return (
      <Button disabled className="hover:bg-rose-400" variant={"ghost"}>
        Delete
      </Button>
    );
  }
  return (
    <Button
      className="hover:bg-rose-400"
      variant={"ghost"}
      onClick={() => removeJob(jobId)}
    >
      Delete
    </Button>
  );
}
