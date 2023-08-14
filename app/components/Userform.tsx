"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { addNewUser } from "../_serverActions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name needs to be atleast 2 or more characters." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .nonempty({ message: "Name cannot be empty." }),
  email: z
    .string()
    .email({ message: "Invalid Email Address." })
    .nonempty({ message: "Must have an email." }),
  role: z.string().nonempty({ message: "User must have a role." }),
});

export type UserForm = z.infer<typeof formSchema>;

export default function UserForm() {
  const router = useRouter();
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });
  async function onSubmit(values: UserForm) {
    console.log(`new registered user values: ${JSON.stringify(values)}`);
    const result = await addNewUser(values);
    console.log(`new User added to DB: ${JSON.stringify(result)}`);
    if (result) {
      form.setValue("name", "");
      form.setValue("email", "");
      form.setValue("role", "");
    }
  }
  return (
    <div className="w-full md:w-3/4 md:mx-auto rounded-md p-1 outline outlne-white outline-2 bg-gradient-to-r from-gray-800 to-gray-200">
      <Form {...form}>
        <Card className="drop-shadow-2xl dark:bg-zinc-950">
          <CardHeader>
            <CardTitle>Regiester a user</CardTitle>
            <CardDescription>
              Please provide the following credientials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus
                        className="dark:bg-zinc-950 "
                        placeholder="John Doe"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="dark:bg-zinc-950"
                        placeholder="Johndoe@gmail.com"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent
                          className="dark:bg-zinc-950"
                          position="popper"
                        >
                          <SelectItem value="Cutter">Cutter</SelectItem>
                          <SelectItem value="Fabricator">Fabricator</SelectItem>
                          <SelectItem value="Guest">Guest</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-28 w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
