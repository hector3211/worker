"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { addNewJob } from "../_serverActions";
import { AlertPop } from "./Alertpopup";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { JobsWithUsers, NewJobWithUser, jobs } from "@/db/schema";

type JobFormProps = {
  url: string[];
};

const formSchema = z.object({
  job: z.object({
    invoice: z
      .string()
      .nonempty({ message: "Please provide an invoice number!" }),
    sinks: z.array(z.object({ value: z.string() })),
    edges: z.array(z.object({ value: z.string() })),
    picture: z.string().array(),
    completed: z.boolean().default(false),
    dueDate: z.date(),
  }),

  cutters: z.array(
    z.object({
      email: z.string(),
    })
  ),
});

export type JobForm = z.infer<typeof formSchema>;

export default function JobForm({ url }: JobFormProps) {
  const [date, setDate] = useState<Date>();
  const [alertPop, setAlertPop] = useState<true | false>(false);
  const [invoiceNum, setInvoiceNum] = useState<string>("");
  const form = useForm<JobForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: {
        invoice: "",
        sinks: [{ value: "pl-250" }],
        edges: [{ value: "flat" }],
        picture: url,
      },
      cutters: [{ email: "" }],
    },
  });
  const {
    fields: sinkField,
    append: sinkAppend,
    remove: sinkRemove,
  } = useFieldArray({
    name: "job.sinks",
    control: form.control,
  });
  const {
    fields: edgeField,
    append: edgeAppend,
    remove: edgeRemove,
  } = useFieldArray({
    name: "job.edges",
    control: form.control,
  });
  const {
    fields: cutterField,
    append: cutterAppend,
    remove: cutterRemove,
  } = useFieldArray({
    name: "cutters",
    control: form.control,
  });

  async function onSubmit(values: JobForm) {
    // console.log(`Add JobForm values: ${JSON.stringify(values)}`);
    const sinkArr = values.job.sinks.map((sink) => {
      return sink.value;
    });
    const edgeArr = values.job.edges.map((edge) => {
      return edge.value;
    });

    const cutterArr = values.cutters.map((cutter) => {
      return cutter.email;
    });

    const newJob: NewJobWithUser = {
      job: {
        invoice: values.job.invoice,
        sink: sinkArr,
        edge: edgeArr,
        due_date: values.job.dueDate.toISOString().slice(0, 10),
      },
      cutters: cutterArr,
    };

    console.log(`Add JobForm values: ${JSON.stringify(newJob)}`);
    await addNewJob(newJob);
    setInvoiceNum(values.job.invoice);
    setAlertPop((prev) => !prev);
    setTimeout(() => {
      setAlertPop((prev) => !prev);
      setInvoiceNum("");
    }, 3000);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="job.invoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice</FormLabel>
              <FormControl>
                <Input placeholder="Invoice Number" {...field} required />
              </FormControl>
            </FormItem>
          )}
        />
        <div>
          {sinkField.map((field, idx) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`job.sinks.${idx}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sink</FormLabel>
                  <div className="flex items-center space-x-1">
                    <FormControl>
                      <Input placeholder="Sink Modal" {...field} required />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 hover:bg-rose-300"
                      onClick={() => sinkRemove(idx)}
                    >
                      Delete
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => sinkAppend({ value: "" })}
          >
            Add Sink
          </Button>
        </div>
        <div>
          {edgeField.map((field, idx) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`job.edges.${idx}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Edge</FormLabel>
                  <div className="flex items-center space-x-1">
                    <FormControl>
                      <Input placeholder="Edge Profile" {...field} required />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 hover:bg-rose-300"
                      onClick={() => edgeRemove(idx)}
                    >
                      Delete
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => edgeAppend({ value: "" })}
          >
            Add Edge
          </Button>
        </div>
        <div>
          {cutterField.map((field, idx) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`cutters.${idx}.email`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cutter</FormLabel>
                  <div className="flex items-center space-x-1">
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Cutter" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="horopesa494@gmail.com">
                            Hector
                          </SelectItem>
                          <SelectItem value="carlos@ymail.com">
                            Carlos
                          </SelectItem>
                          <SelectItem value="robert@ymail.com">
                            Robert
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-10 hover:bg-rose-300"
                      onClick={() => cutterRemove(idx)}
                    >
                      Delete
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={() => cutterAppend({ email: "" })}
          >
            Add Cutter
          </Button>
        </div>
        <FormField
          control={form.control}
          name="job.dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
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
