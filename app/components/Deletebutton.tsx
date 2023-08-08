"use client";
import { useState, useTransition } from "react";
import { deleteJob } from "../_serverActions";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

type DeleteButtonProps = {
  jobId: number;
  jobInvoice: string;
};

export default function DeleteButton({ jobId, jobInvoice }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  async function removeJob(id: number) {
    console.log(`The removeJob function got clicked with jobID: ${id}`);
    startTransition(async () => await deleteJob(id));
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="hover:bg-rose-400" variant={"ghost"}>
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-bold text-2xl">
            Are you sure?
          </AlertDialogTitle>
          <AlertDescription>
            <div className="flex w-full items-center space-x-1">
              <p>This actions will delete job with Invoice</p>
              <Separator orientation="vertical" className="h-3" />
              <p className="font-medium">#{jobInvoice}</p>
            </div>
          </AlertDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeJob(jobId).then(() => setOpen(false))}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
