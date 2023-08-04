"use client";
import { updateJob } from "@/app/_serverActions";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { EditableJob } from "@/db/schema";

type EditButtonProps = {
  id: number;
  invoice: string;
  sinks: string[] | null;
  edges: string[] | null;
  cutterEmails: string[] | undefined;
  completed: boolean | null;
  dueDate: Date | null;
};

const formSchema = z.object({
  id: z.number(),
  invoice: z.string(),
  sinks: z.array(z.object({ value: z.string() })).nullable(),
  edges: z.array(z.object({ value: z.string() })).nullable(),
  completed: z.boolean().nullable(),
  dueDate: z.date().nullable(),
  cutterEmails: z.array(
    z.object({
      email: z.string().email(),
    })
  ),
});

type EditableJobForm = z.infer<typeof formSchema>;

export function EditButton({
  id,
  invoice,
  sinks,
  edges,
  cutterEmails,
  completed,
  dueDate,
}: EditButtonProps) {
  // console.log(`current cutterEmails passed to EditButton: ${cutterEmails}\n`);
  // console.log(`current date time passed: ${dueDate}\n`);
  const [open, setOpen] = useState(false);
  const [alertPop, setAlertPop] = useState<true | false>(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<EditableJobForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id,
      invoice: invoice,
      sinks:
        sinks &&
        sinks.map((sink) => {
          return { value: sink };
        }),
      edges:
        edges &&
        edges.map((edge) => {
          return { value: edge };
        }),
      cutterEmails:
        cutterEmails &&
        cutterEmails.map((email) => {
          return { email };
        }),
      completed: completed && completed,
      dueDate: dueDate && dueDate,
    },
  });

  const {
    fields: sinkField,
    append: sinkAppend,
    remove: sinkRemove,
  } = useFieldArray({
    name: "sinks",
    control: form.control,
  });
  const {
    fields: edgeField,
    append: edgeAppend,
    remove: edgeRemove,
  } = useFieldArray({
    name: "edges",
    control: form.control,
  });
  const {
    fields: cutterField,
    append: cutterAppend,
    remove: cutterRemove,
  } = useFieldArray({
    name: "cutterEmails",
    control: form.control,
  });
  async function onSubmit(values: EditableJobForm) {
    console.log(
      `EditJob Form Values for updating job step ONE: ${JSON.stringify(values)}`
    );
    // console.log(
    //   `Reformated due-date: ${values.dueDate?.toISOString().slice(0, 10)}`
    // );
    if (values && values.sinks && values.edges && values.dueDate) {
      console.log(`Things are starting to heat up!`);
      const sinkArr = values.sinks.map((sink) => {
        return sink.value;
      });
      const edgeArr = values.edges.map((edge) => {
        return edge.value;
      });

      const cutterArr = values.cutterEmails.map((cutter) => {
        return cutter.email;
      });
      const editedJob: EditableJob = {
        ...values,
        sinks: sinkArr,
        edges: edgeArr,
        due_date: values.dueDate.toISOString().slice(0, 10),
        completed: values.completed ? values.completed : false,
        cutters: cutterArr,
      };
      console.log(
        `EditJob Form Values for updating job: ${JSON.stringify(editedJob)}`
      );
      startTransition(async () => await updateJob(editedJob));
      if (!isPending) {
        setOpen((prev) => !prev);
      }
      // setAlertPop(true);
      // const timer = setTimeout(() => setAlertPop(false), 3000);
      // return () => clearTimeout(timer);
    } else {
      console.log(`Things are starting to heat down!`);
    }
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>Edit</Button>
        </DialogTrigger>
        <DialogContent className="dark:bg-zinc-950 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit job {invoice}</DialogTitle>
            <DialogDescription>
              Make changes to your job here. Click submit when you're done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div>
                {sinkField.map((field, idx) => (
                  <FormField
                    control={form.control}
                    key={field.id}
                    name={`sinks.${idx}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sink</FormLabel>
                        <div className="flex items-center space-x-1">
                          <FormControl>
                            <Input
                              className="dark:bg-zinc-950"
                              placeholder="Sink Modal"
                              {...field}
                              required
                            />
                          </FormControl>
                          <Button
                            type="button"
                            size="sm"
                            className="h-10"
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
                    name={`edges.${idx}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Edge</FormLabel>
                        <div className="flex items-center space-x-1">
                          <FormControl>
                            <Input
                              className="dark:bg-zinc-950"
                              placeholder="Edge Profile"
                              {...field}
                              required
                            />
                          </FormControl>
                          <Button
                            type="button"
                            size="sm"
                            className="h-10"
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
                    name={`cutterEmails.${idx}.email`}
                    render={({ field }) => (
                      <FormItem className="mt-3">
                        <FormLabel>Cutter</FormLabel>
                        <div className="flex items-center space-x-1">
                          <FormControl className="text-black">
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  className="text-black"
                                  placeholder={"Select cutter"}
                                />
                              </SelectTrigger>
                              <SelectContent
                                className="dark:bg-zinc-950"
                                position="popper"
                              >
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
                            size="sm"
                            className="h-10"
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
                  size="sm"
                  className="mt-1"
                  onClick={() => cutterAppend({ email: "" })}
                >
                  Add Cutter
                </Button>
              </div>
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col mt-3">
                    <FormLabel>Date of Installation</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
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
                          selected={field.value ? field.value : undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Installation date for job.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormControl className="">
                      <Checkbox
                        checked={field.value !== null && field.value}
                        onCheckedChange={(e) => field.onChange(e.valueOf())}
                      />
                    </FormControl>
                    <Label className="relative bottom-1 left-2">
                      Completed
                    </Label>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  disabled={isPending}
                  type="submit"
                  className="mt-5 w-full"
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      {alertPop && (
        <Alert className="w-1/2 absolute top-0 left-1/4 lg:w-96 lg:left-[40%]">
          <Terminal className="h-4 w-4" />
          <AlertTitle className="text-left text-lg">
            {form.getValues().invoice} ✅
          </AlertTitle>
          <AlertDescription className="text-left">
            {"Successfully updated!"}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
