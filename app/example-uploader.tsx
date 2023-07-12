"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";

import { UploadButton } from "../utils/uploadthing";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChangeEvent, FormEvent, useState } from "react";

type FormSchema = {
  invoice?: string;
  sink?: string;
  edge?: string;
  cutter?: string;
  pictureUrl?: string;
};
export default function UploadThing() {
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const [formState, setFormState] = useState<FormSchema>({});
  console.log(`image url: ${imgUrl}`);
  function onFieldChange(
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) {
    let value = e.target.value;
    console.log(`Current Value: ${value}`);
    setFormState({
      ...formState,
      [e.target.id]: value,
    });
  }

  async function saveUserJob() {
    console.log(`FORM STATE: ${JSON.stringify(formState)}`);
  }
  return (
    <div className="flex min-h-screen flex-col items-center p-24">
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
          setImgUrl(res?.[0].fileUrl);
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR!: Not Signed Authorized!`);
        }}
      />
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create Job</CardTitle>
          <CardDescription>
            Register a new job with a cutter today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="invoice">Invoice</Label>
              <Input
                id="invoice"
                placeholder="Invoice numer of your project"
                required
                onChange={(e) => onFieldChange(e)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="sink">Sink</Label>
              <Input
                id="sink"
                placeholder="Sink modal"
                onChange={(e) => onFieldChange(e)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="edge">Edge</Label>
              <Input
                id="edge"
                placeholder="Edge profile"
                onChange={(e) => onFieldChange(e)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="cutter">cutter</Label>
              <select
                className="outline outline-gray-300 outline-1 rounded-md h-10"
                id="cutter"
                onChange={(e) => onFieldChange(e)}
              >
                <option value={"Hector"}>Hector</option>
                <option value={"Carlos"}>Carlos</option>
                <option value={"Robert"}>Robert</option>
              </select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={saveUserJob} className="bg-blue-500 w-full">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
