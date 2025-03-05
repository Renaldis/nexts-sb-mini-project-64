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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

type FormRegisterProps = {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  loading: boolean;
};

export default function FormRegister({
  form,
  onSubmit,
  loading,
}: FormRegisterProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
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
                <Input type="date" placeholder="Date of Birth ..." {...field} />
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password ..."
                    {...field}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-blue-600" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </Button>
        <span className="text-sm">
          Do you have an account?
          <Link href="/login" className="ml-2 font-semibold hover:border-b">
            Login Now
          </Link>
        </span>
      </form>
    </Form>
  );
}
