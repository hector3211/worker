"use client";
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
import { useFieldArray, useForm } from "react-hook-form";
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
  }),

  cutters: z.array(
    z.object({
      email: z.string().nonempty({ message: "Please provide a cutter name!" }),
    })
  ),
});

export type JobForm = z.infer<typeof formSchema>;

export default function JobForm({ url }: JobFormProps) {
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
    console.log(`Add JobForm values: ${JSON.stringify(values)}`);
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
      },
      cutters: cutterArr,
    };

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
                          <SelectItem value="carlos@yahoo.com">
                            Carlos
                          </SelectItem>
                          <SelectItem value="robert@yahoo.com">
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
