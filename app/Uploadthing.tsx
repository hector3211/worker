"use client";

import "@uploadthing/react/styles.css";
import { UploadButton } from "../utils/uploadthing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { useState } from "react";
import { AlertPop } from "./components/Alertpopup";
import { Dialog, DialogContent, DialogTrigger } from "./components/ui/dialog";
import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import JobForm from "./components/Addjobform";

export default function UploadThing() {
  const [urlPaste, setUrlPaste] = useState<string | undefined>(undefined);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-black text-md sm:text-lg" variant={"ghost"}>
          Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="text-black">
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            if (res) {
              // alert(`Upload Completed Please Copy URL: ${res[0].fileUrl}`);
              setUrlPaste(res[0].fileUrl);
            }
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR!: Not Signed Authorized!`);
          }}
        />
        <Separator className="w-full" />
        {urlPaste && <JobForm url={urlPaste} />}
      </DialogContent>
    </Dialog>
  );
}
