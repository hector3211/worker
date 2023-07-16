"use client";

// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";

import { UploadButton } from "../utils/uploadthing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { addNewJob } from "../app/_serverActions";
import { AlertPop } from "@/components/Alertpopup";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const formSchema = z.object({
  invoice: z.string(),
  sink: z.string().max(100),
  edge: z.string().max(100),
  cutter: z.string().max(20),
  picture: z.string(),
});

export default function UploadThing() {
  const [urlPaste, setUrlPaste] = useState<string | undefined>(undefined);
  const [alertPop, setAlertPop] = useState<true | false>(false);
  const [invoiceNum, setInvoiceNum] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice: "",
      sink: "",
      edge: "",
      cutter: "",
      picture: urlPaste,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(`Form values: ${JSON.stringify(values)}`);
    setInvoiceNum(values.invoice);
    await addNewJob(values);
    setAlertPop((prev) => !prev);
    setTimeout(() => {
      setAlertPop((prev) => !prev);
    }, 3000);
  }
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"}>Add job</Button>
        </DialogTrigger>
        <DialogContent className="bg-transparent backdrop-blur-lg">
          <div className="flex flex-col items-center">
            <p>Please upload job pictures</p>
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
            <Card className="w-[450px]">
              <CardHeader>
                <CardTitle>Create New Job</CardTitle>
                <CardDescription>
                  Send off a new job in one-click
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="picture"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Picture URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={"picture url"}
                              {...field}
                              type="text"
                              required
                            />
                          </FormControl>
                          <FormDescription>
                            {form.formState.errors.picture?.message}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="invoice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Invoice Number"
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sink</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Sink Modal"
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="edge"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Edge</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Edge Profile"
                              {...field}
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cutter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cutter</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Cutter" />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="hector">Hector</SelectItem>
                                <SelectItem value="carlos">Carlos</SelectItem>
                                <SelectItem value="robert">Robert</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="mt-5 bg-blue-500 w-full">
                      Submit
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            {alertPop && (
              <AlertPop
                invoice={invoiceNum}
                message={"Successfully uploaded new job!"}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
