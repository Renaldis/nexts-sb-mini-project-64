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
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

type FormLogin = {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  loading: boolean;
};

export default function FormLogin({ form, onSubmit, loading }: FormLogin) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-[70%] mx-auto"
        >
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-700">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Password ..."
                      type={`${showPassword ? "text" : "password"}`}
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
          <Button
            type="submit"
            className="w-full bg-blue-600 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
          <span className="text-sm">
            Don't have an account ?
            <Link
              href="/register"
              className="ml-2 font-semibold hover:border-b"
            >
              Register Now
            </Link>
          </span>
        </form>
      </Form>
    </>
  );
}
