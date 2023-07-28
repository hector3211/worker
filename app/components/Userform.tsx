"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
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
  name: z.string(),
  email: z.string().email({ message: "Invalid Email Address." }),
  role: z.string().max(5, {
    message: "Invalid role string, must be five characters or less.",
  }),
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
    <div className=" w-2/3 rounded-md p-3 outline outlne-white outline-2 bg-gradient-to-r from-gray-500 to-indigo-500">
      <Form {...form}>
        <Card className="drop-shadow-2xl">
          <CardHeader>
            <CardTitle>Regiester a user</CardTitle>
            <CardDescription>
              Please provide the following credientials to register a user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} required />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invoice</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Johndoe@gmail.com"
                        {...field}
                        required
                      />
                    </FormControl>
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
                        <SelectContent position="popper">
                          <SelectItem value="Guest">Guest</SelectItem>
                          <SelectItem value="Cutter">Cutter</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-28 bg-blue-500 w-full">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      </Form>
    </div>
  );
}
