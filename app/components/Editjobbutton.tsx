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
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
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

type EditButtonProps = {
  id: number;
  invoice: string;
  sinks: string[] | null;
  edges: string[] | null;
  cutterIds: number[] | undefined;
  completed: boolean | null;
};

const formSchema = z.object({
  id: z.number(),
  invoice: z.string(),
  sinks: z.array(z.object({ value: z.string() })).nullable(),
  edges: z.array(z.object({ value: z.string() })).nullable(),
  completed: z.boolean().nullable(),
  cutterIds: z.array(
    z.object({
      id: z.number(),
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
}: EditButtonProps) {
  console.log(`current cutterIds passed to EditButton: ${cutterIds}\n`);
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
      cutterIds:
        cutterIds &&
        cutterIds.map((id) => {
          return { id: id };
        }),
      completed: completed && completed,
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
    console.log(
      `EditJob Form Values for updating job: ${JSON.stringify(values)}`
    );
    // startTransition(async () => await updateJob(values));
    // setOpen((prev) => !prev);
    // setAlertPop(true);
    // const timer = setTimeout(() => setAlertPop(false), 3000);
    // return () => clearTimeout(timer);
  }

  return (
    <div className="text-gray-500">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>Edit</Button>
        </DialogTrigger>
        <DialogContent className="text-black sm:max-w-[425px]">
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
                              placeholder="Sink Modal"
                              {...field}
                              required
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
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
                    name={`edges.${idx}.value`}
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
                    name={`cutterIds.${idx}.id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cutter</FormLabel>
                        <div className="flex items-center space-x-1">
                          <FormControl className="text-black">
                            <Select
                              defaultValue={field.value.toString()}
                              onValueChange={field.onChange}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue
                                  className="text-black"
                                  placeholder={field.value.toString()}
                                />
                              </SelectTrigger>
                              <SelectContent position="popper">
                                <SelectItem value="hector">Hector</SelectItem>
                                <SelectItem value="carlos">Carlos</SelectItem>
                                <SelectItem value="robert">Robert</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
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
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => cutterAppend({ id: -0 })}
                >
                  Add Cutter
                </Button>
              </div>
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
                  className="mt-5 bg-blue-500 w-full"
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
