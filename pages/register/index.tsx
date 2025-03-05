import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormRegister from "./formRegister";

const formSchema = z.object({
  name: z.string().nonempty({ message: "Name is required" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Email is not valid" }),
  birth_date: z.string().nonempty({ message: "Birth date is required" }),
  phone: z.string().nonempty({ message: "Phone is required" }),
  hobby: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function Register() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

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

  const { reset, handleSubmit } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Registration successful!",
          icon: "success",
          timer: 3000,
          showConfirmButton: false,
        }).then(() => {
          router.push("/login");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Registration failed!",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred!",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
      reset();
    }
  }

  return (
    <div>
      <h1 className="text-center font-bold text-xl">Register</h1>
      <FormRegister
        form={form}
        onSubmit={handleSubmit(onSubmit)}
        loading={loading}
      />
    </div>
  );
}
