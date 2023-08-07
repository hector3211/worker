"use client";

import "@uploadthing/react/styles.css";
import { UploadButton } from "../utils/uploadthing";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import JobForm from "./components/Addjobform";
import { utapiDelete } from "./_serverActions";

export default function UploadThing() {
  const [urlPaste, setUrlPaste] = useState<string[]>([]);
  const [fileKeys, setFileKeys] = useState<string[]>([]);
  const [showBtn, setShowBtn] = useState<true | false>(false);

  async function deletePic(idx: number) {
    const toDelete = fileKeys[idx];
    const urlSelected = urlPaste[idx];
    await utapiDelete(toDelete);
    setUrlPaste((prev) => {
      return prev.filter((pic) => pic !== urlSelected);
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="md:text-lg dark:text-white">
          +Job
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-zinc-950">
        <DialogHeader>
          <DialogTitle>Add a job</DialogTitle>
          <DialogDescription>
            Please add all pictures for a job before moving foward
          </DialogDescription>
        </DialogHeader>
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            if (res) {
              // alert(`Upload Completed Please Copy URL: ${res[0].fileUrl}`);
              setUrlPaste([...urlPaste, res[0].fileUrl]);
              setFileKeys([...fileKeys, res[0].fileKey]);
            }
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR!: Not Signed Authorized!`);
          }}
        />
        <div className="flex flex-shrink justify-center items-center space-x-1">
          {urlPaste.map((pic, idx) => (
            <div key={idx} className="relative">
              <img
                src={`${pic}`}
                alt="Job picture"
                className="rounded-md w-[120px] h-[70px]"
              />
              <Button
                variant={"secondary"}
                className="absolute top-1 right-1 text-xs p-2 h-2 w-2 transition ease-in-out delay-75 hover:bg-red-500 hover:-translate-y-1 hover:scale-105"
                onClick={() => deletePic(idx)}
              >
                X
              </Button>
            </div>
          ))}
        </div>
        {!showBtn && <Button onClick={() => setShowBtn(true)}>Done</Button>}
        <Separator className="w-full" />
        {urlPaste.length > 0 && showBtn && <JobForm url={urlPaste} />}
      </DialogContent>
    </Dialog>
  );
}
