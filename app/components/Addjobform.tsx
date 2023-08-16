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
import { useEffect, useState } from "react";
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
import { addNewJob, utapiDelete } from "../_serverActions";
import { AlertPop } from "./Alertpopup";
import { NewJobWithUser } from "@/db/schema";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@/utils/uploadthing";
import { Separator } from "./ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
      id: z.string(),
    })
  ),
});

export type JobForm = z.infer<typeof formSchema>;

export default function JobForm() {
  const [isPending, setIsPending] = useState<true | false>(false);
  const [showPopUp, setShowPopUp] = useState<true | false>(false);
  const [urlPaste, setUrlPaste] = useState<string[]>([]);
  const [fileKeys, setFileKeys] = useState<string[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const form = useForm<JobForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: {
        invoice: "",
        sinks: [{ value: "pl-250" }],
        edges: [{ value: "flat" }],
      },
      cutters: [{ id: "" }],
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
    setIsPending(true);
    const sinkArr = values.job.sinks.map((sink) => {
      return sink.value;
    });
    const edgeArr = values.job.edges.map((edge) => {
      return edge.value;
    });

    const cutterArr: number[] = values.cutters.map((cutter) => {
      return parseInt(cutter.id);
    });

    const newJob: NewJobWithUser = {
      job: {
        invoice: values.job.invoice,
        sink: sinkArr,
        edge: edgeArr,
        pictures: values.job.picture,
        due_date: values.job.dueDate.toISOString().slice(0, 10),
      },
      cutters: cutterArr,
    };

    console.log(`Add JobForm values: ${JSON.stringify(newJob)}`);

    try {
      await addNewJob(newJob);
      setIsPending(false);
      setShowPopUp(true);
      setUrlPaste([]);
      form.setValue("cutters", [{ id: "" }]);
      form.setValue("job.sinks", [{ value: "pl-250" }]);
      form.setValue("job.edges", [{ value: "flat" }]);
      form.setValue("job.picture", []);
      form.setValue("job.invoice", "");
    } catch (err) {
      setErrMsg(
        `Sorry something went wrong! this feature will be back shortly`
      );
      console.log(`AddJobForm Failed with error: ${err}`);
    }
  }
  async function deletePic(idx: number) {
    const toDelete = fileKeys[idx];
    const urlSelected = urlPaste[idx];
    await utapiDelete(toDelete);
    setUrlPaste((prev) => {
      return prev.filter((pic) => pic !== urlSelected);
    });
  }
  useEffect(() => {
    const popTimer = setTimeout(() => {
      setShowPopUp(false);
    }, 5000);

    return () => clearTimeout(popTimer);
  }, [showPopUp]);
  return (
    <div className="w-full md:w-3/4 md:mx-auto lg:w-1/2 rounded-md p-1 outline outlne-white outline-2 bg-gradient-to-r from-gray-800 to-gray-200">
      <Card className="drop-shadow-2xl dark:bg-zinc-950">
        <CardHeader>
          <CardTitle>Add a new job</CardTitle>
          <CardDescription>
            Please provide the following credientials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              if (res) {
                // alert(`Upload Completed Please Copy URL: ${res[0].fileUrl}`);
                setUrlPaste([...urlPaste, res[0].fileUrl]);
                setFileKeys([...fileKeys, res[0].fileKey]);
                form.setValue("job.picture", [...urlPaste, res[0].fileUrl]);
              }
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              // alert(`ERROR!: Not Signed Authorized!`);
              setErrMsg(
                `Sorry something went wrong! feature will be back shortly`
              );
              console.log(`Current uploadthing error in button: ${error}`);
            }}
          />
          <div className="flex flex-shrink justify-center items-center space-x-1">
            {urlPaste.map((pic, idx) => (
              <div key={idx} className="relative mb-3">
                <img
                  src={`${pic}`}
                  alt="Job picture"
                  className="rounded-md w-[250px] h-[150px]"
                />
                <Button
                  variant={"secondary"}
                  className="absolute top-1 right-1 text-md w-8 h-8"
                  onClick={() => deletePic(idx)}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
          {errMsg && <p className="text-rose-400 text-md">{errMsg}</p>}
          <Separator className="w-full" />
          {urlPaste.length > 0 ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="job.invoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice</FormLabel>
                      <FormControl>
                        <Input
                          autoFocus
                          placeholder="Invoice Number"
                          {...field}
                          required
                        />
                      </FormControl>
                      <FormMessage />
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
                              <Input
                                placeholder="Sink Modal"
                                {...field}
                                required
                              />
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
                          <FormMessage />
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
                              <Input
                                placeholder="Edge Profile"
                                {...field}
                                required
                              />
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
                          <FormMessage />
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
                      name={`cutters.${idx}.id`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cutter</FormLabel>
                          <div className="flex items-center space-x-1">
                            <FormControl>
                              <Select onValueChange={field.onChange} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Cutter" />
                                </SelectTrigger>
                                <SelectContent
                                  typeof="number"
                                  position="popper"
                                  className="dark:bg-zinc-950"
                                >
                                  <SelectItem value="1">Hector</SelectItem>
                                  <SelectItem value="2">Carlos</SelectItem>
                                  <SelectItem value="3">Robert</SelectItem>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => cutterAppend({ id: "" })}
                  >
                    Add Cutter
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="job.dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-2">
                      <FormLabel>Installation date</FormLabel>
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
                        Pick a due date for this job
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isPending}
                  type="submit"
                  className="mt-5 bg-blue-600 w-full text-white"
                >
                  Submit
                </Button>
                {errMsg && (
                  <p className="text-rose-400">Something went wrong</p>
                )}
              </form>
            </Form>
          ) : null}
        </CardContent>
      </Card>
      {showPopUp ? (
        <AlertPop
          invoice={`Invoice  #${form.getValues("job.invoice")}`}
          message={"Created Job!"}
          alertType="add"
        />
      ) : null}
    </div>
  );
}
