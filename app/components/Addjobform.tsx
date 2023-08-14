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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { NewJobWithUser } from "@/db/schema";
import "@uploadthing/react/styles.css";
import { UploadButton } from "@/utils/uploadthing";
import { Separator } from "./ui/separator";

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

export default function JobForm() {
  const [showPopUp, setShowPopUp] = useState<true | false>(false);
  const [urlPaste, setUrlPaste] = useState<string[]>([]);
  const [fileKeys, setFileKeys] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const form = useForm<JobForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job: {
        invoice: "",
        sinks: [{ value: "pl-250" }],
        edges: [{ value: "flat" }],
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
        pictures: values.job.picture,
        due_date: values.job.dueDate.toISOString().slice(0, 10),
      },
      cutters: cutterArr,
    };

    console.log(`Add JobForm values: ${JSON.stringify(newJob)}`);

    await addNewJob(newJob).then(() => {
      setOpen((prev) => !prev);
      setShowPopUp(true);
      setUrlPaste([]);
      form.setValue("cutters", [{ email: "" }]);
      form.setValue("job.sinks", [{ value: "pl-250" }]);
      form.setValue("job.edges", [{ value: "flat" }]);
      form.setValue("job.picture", []);
      form.setValue("job.invoice", "");
      form.setValue("job.dueDate", new Date());
    });
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
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="text-md md:text-lg hover:bg-gray-300 hover:dark:bg-gray-900 dark:text-white"
          >
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
                              <Select onValueChange={field.onChange} required>
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
                {errMsg && (
                  <p className="text-rose-400">Something went wrong</p>
                )}
              </form>
            </Form>
          ) : null}
        </DialogContent>
      </Dialog>
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
