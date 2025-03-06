import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useState } from "react";

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
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export const formSchemaLogin = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z.string().min(8),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  async function onSubmit(values: z.infer<typeof formSchemaLogin>) {
    setLoading(true);
    console.log("Submitting values:", values);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log("Response from backend:", data);

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Login successful!",
          icon: "success",
          confirmButtonText: "OK",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          Cookies.set("userId", data.data.userId, {
            expires: new Date(data.data.expires_at),
          });
          Cookies.set("sb_token", data.data.token, {
            expires: new Date(data.data.expires_at),
            path: "/",
          });
          router.reload();
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: data.message || "Login failed!",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Frontend error:", error);
      Swal.fire({
        title: "Error!",
        text: "Login failed due to network error!",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  }

  console.log("Form instance:", form);

  return (
    <div className="h-screen">
      <h1 className="text-center font-bold text-xl">Login</h1>

      <Form {...form}>
        <form
          onSubmit={form?.handleSubmit(onSubmit)}
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
            Dont have an account ?
            <Link
              href="/register"
              className="ml-2 font-semibold hover:border-b"
            >
              Register Now
            </Link>
          </span>
        </form>
      </Form>
    </div>
  );
}
