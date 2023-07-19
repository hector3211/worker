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
import { useForm } from "react-hook-form";
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
  sink: string | null;
  edge: string | null;
  cutter: string | null;
  completed: boolean;
};

const formSchema = z.object({
  id: z.number(),
  invoice: z.string(),
  sink: z.string().max(100).nullable(),
  edge: z.string().max(100).nullable(),
  cutter: z.string().max(20).nullable(),
  completed: z.boolean().default(false),
});

export function EditButton({
  id,
  invoice,
  sink,
  edge,
  cutter,
  completed,
}: EditButtonProps) {
  const [open, setOpen] = useState(false);
  const [alertPop, setAlertPop] = useState<true | false>(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id,
      invoice: invoice,
      sink: sink && sink,
      edge: edge && edge,
      cutter: cutter && cutter,
      completed: completed && completed,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(`Values for updating job: ${JSON.stringify(values)}`);
    startTransition(async () => await updateJob(values));
    setOpen((prev) => !prev);
    setAlertPop(true);
    const timer = setTimeout(() => setAlertPop(false), 3000);
    return () => clearTimeout(timer);
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
                        value={`${sink ? sink : ""}`}
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
                        value={`${edge ? edge : ""}`}
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
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={`${cutter ? cutter : ""}`}
                            placeholder={`${cutter ? cutter : "Select Cutter"}`}
                          />
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
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormControl className="">
                      <Checkbox
                        checked={field.value}
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
