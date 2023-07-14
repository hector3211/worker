"use client";
import { updateJob } from "@/app/_serverActions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
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
import { AlertPop } from "./Alertpopup";

type EditButtonProps = {
  id: number;
  invoice: string;
  sink: string | null;
  edge: string | null;
  cutter: string | null;
  picture: string | null;
  completed: boolean | null;
  createdAt: Date;
};

const formSchema = z.object({
  id: z.number().int(),
  invoice: z.string(),
  sink: z.string().max(100).nullable(),
  edge: z.string().max(100).nullable(),
  cutter: z.string().max(20).nullable(),
  picture: z.string().nullable(),
  completed: z.boolean().nullable().default(false),
  createdAt: z.date(),
});

export function EditButton({
  id,
  invoice,
  sink,
  edge,
  cutter,
  picture,
  completed,
  createdAt,
}: EditButtonProps) {
  const [alertPop, setAlertPop] = useState<true | false>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: id,
      invoice: invoice,
      sink: sink,
      edge: edge,
      cutter: cutter,
      picture: picture,
      completed: completed,
      createdAt: createdAt,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateJob(values);
    setAlertPop((prev) => !prev);
    setTimeout(() => {
      setAlertPop((prev) => !prev);
    }, 3000);
  }
  return (
    <div>
      {alertPop && (
        <AlertPop invoice={invoice} message={"Successfully updated job!"} />
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">Edit</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit job {invoice}</DialogTitle>
            <DialogDescription>
              Make changes to your job here. Click save when you're done.
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
              <DialogFooter>
                <Button type="submit" className="mt-5 bg-blue-500 w-full">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
