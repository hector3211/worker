"use client";

import "@uploadthing/react/styles.css";
import { UploadButton } from "../utils/uploadthing";
import { useState } from "react";
import { AlertPop } from "./components/Alertpopup";
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

export default function UploadThing() {
  const [urlPaste, setUrlPaste] = useState<string[]>([]);
  const [showBtn, setShowBtn] = useState<true | false>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-black" variant={"secondary"}>
          +Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="text-black">
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
            }
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR!: Not Signed Authorized!`);
          }}
        />
        <Button onClick={() => setShowBtn(true)}>Done</Button>
        <Separator className="w-full" />
        {urlPaste.length > 0 && showBtn && <JobForm url={urlPaste} />}
      </DialogContent>
    </Dialog>
  );
}
