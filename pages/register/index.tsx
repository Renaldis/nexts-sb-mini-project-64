import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Email is not valid" }),
  birth_date: z.string().nonempty({ message: "Birth_date is required" }),
  phone: z.string().nonempty({ message: "phone is required" }),
  hobby: z.string(),
  password: z.string().min(8),
});

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      birth_date: "",
      phone: "",
      hobby: "",
      password: "",
    },
  });
  const { reset } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setLoading(true);
    console.log(values);

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        body: JSON.stringify(values),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      reset();
    }
  }
  return (
    <div>
      <h1 className="text-center font-bold text-xl">Register</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-[70%] mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-red-700">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Name ..." {...field} />
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
                <FormLabel>
                  Email <span className="text-red-700">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Email ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birth_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Date of Birth <span className="text-red-700">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Name ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone <span className="text-red-700">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Phone ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hobby"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hobby</FormLabel>
                <FormControl>
                  <Input placeholder="Hobby ..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-700">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Password ..."
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-600"
            disabled={loading}
          >
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
