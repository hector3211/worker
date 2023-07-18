"use client";
// You need to import our styles for the button to look right. Best to import in the root /layout.tsx but this is fine
import "@uploadthing/react/styles.css";
import { UploadButton } from "../../utils/uploadthing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
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
} from "./ui/form";
import { addNewJob } from "../_serverActions";
import { AlertPop } from "./Alertpopup";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

type JobFormProps = {
  url: string;
};

const formSchema = z.object({
  invoice: z.string(),
  sink: z.string().max(100),
  edge: z.string().max(100),
  cutter: z.string().max(20),
  picture: z.string(),
});

export default function JobForm({ url }: JobFormProps) {
  const [alertPop, setAlertPop] = useState<true | false>(false);
  const [invoiceNum, setInvoiceNum] = useState<string>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice: "",
      sink: "",
      edge: "",
      cutter: "",
      picture: url,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(`Form values: ${JSON.stringify(values)}`);
    await addNewJob(values);
    setAlertPop((prev) => !prev);
    setTimeout(() => {
      setAlertPop((prev) => !prev);
    }, 3000);
  }
  return (
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
                <Input placeholder="Invoice Number" {...field} required />
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
                <Input placeholder="Sink Modal" {...field} required />
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
                <Input placeholder="Edge Profile" {...field} required />
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
      {alertPop && (
        <AlertPop
          invoice={invoiceNum}
          message={"Successfully uploaded new job!"}
        />
      )}
    </Form>
  );
}
