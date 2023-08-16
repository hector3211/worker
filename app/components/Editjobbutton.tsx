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
import { AlertPop } from "./Alertpopup";

type EditButtonProps = {
  id: number;
  invoice: string;
  sinks: string[] | null;
  edges: string[] | null;
  cutterIds: number[] | undefined;
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
  cutterIds: z.array(
    z.object({
      id: z.string(),
    })
  ),
});

type EditableJobForm = z.infer<typeof formSchema>;

export function EditButton({
  id,
  invoice,
  sinks,
  edges,
  cutterIds,
  completed,
  dueDate,
}: EditButtonProps) {
  // console.log(`current cutterEmails passed to EditButton: ${cutterEmails}\n`);
  // console.log(`current date time passed: ${dueDate}\n`);
  const [isPending, setIsPending] = useState<true | false>(false);
  const [showPopUp, setShowPopUp] = useState<true | false>(false);
  const [open, setOpen] = useState(false);
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
      cutterIds:
        cutterIds &&
        cutterIds.map((id) => {
          return { id: id.toString() };
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
    name: "cutterIds",
    control: form.control,
  });
  async function onSubmit(values: EditableJobForm) {
    console.log("edit button got pressed");
    console.log(
      `EditJob Form Values for updating job step ONE: ${JSON.stringify(values)}`
    );
    // console.log(
    //   `Reformated due-date: ${values.dueDate?.toISOString().slice(0, 10)}`
    // );
    setIsPending(true);
    if (values && values.sinks && values.edges && values.dueDate) {
      console.log(`Things are starting to heat up!`);
      const sinkArr = values.sinks.map((sink) => {
        return sink.value;
      });
      const edgeArr = values.edges.map((edge) => {
        return edge.value;
      });

      const cutterArr = values.cutterIds.map((cutter) => {
        return Number(cutter.id);
      });
      const editedJob: EditableJob = {
        ...values,
        sinks: sinkArr,
        edges: edgeArr,
        due_date: values.dueDate.toISOString().slice(0, 10),
        completed: values.completed ? values.completed : false,
        cutterIds: cutterArr,
      };
      console.log(
        `EditJob Form Values for updating job: ${JSON.stringify(editedJob)}`
      );
      await updateJob(editedJob).then(() => {
        setOpen(false);
        setIsPending(false);
        setShowPopUp(true);
      });
      // setAlertPop(true);
      // const timer = setTimeout(() => setAlertPop(false), 3000);
      // return () => clearTimeout(timer);
    } else {
      console.log(`Things are starting to heat down!`);
    }
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
          <Button variant={"ghost"}>Edit</Button>
        </DialogTrigger>
        <DialogContent className="dark:bg-zinc-950 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit job {invoice}</DialogTitle>
            <DialogDescription>Make changes to your job here</DialogDescription>
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
                            className="h-10 hover:bg-rose-400"
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
                            className="h-10 hover:bg-rose-400"
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
                    name={`cutterIds.${idx}.id`}
                    render={({ field }) => (
                      <FormItem className="mt-3">
                        <FormLabel>Cutter</FormLabel>
                        <div className="flex items-center space-x-1">
                          <FormControl className="text-black">
                            <Select
                              defaultValue={field.value.toString()}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  className="text-black"
                                  placeholder={"Select cutter"}
                                />
                              </SelectTrigger>
                              <SelectContent
                                typeof="number"
                                className="dark:bg-zinc-950"
                                position="popper"
                              >
                                <SelectItem value="1">Hector</SelectItem>
                                <SelectItem value="2">Carlos</SelectItem>
                                <SelectItem value="3">Robert</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            type="button"
                            size="sm"
                            className="h-10 hover:bg-rose-400"
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
                  size="sm"
                  className="mt-1"
                  onClick={() => cutterAppend({ id: "" })}
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
      {showPopUp ? (
        <AlertPop
          invoice={`Invoice  #${form.getValues("invoice")}`}
          message={"Successfully edited Job!"}
          alertType="edit"
        />
      ) : null}
    </div>
  );
}
