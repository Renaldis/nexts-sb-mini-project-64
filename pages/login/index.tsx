import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useState } from "react";
import FormLogin from "./formLogin";

const formSchema = z.object({
  email: z.string().nonempty({ message: "Email is required" }),
  password: z.string().min(8),
});

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

  return (
    <div className="h-screen">
      <h1 className="text-center font-bold text-xl">Login</h1>
      <FormLogin
        form={form}
        loading={loading}
        onSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
}
