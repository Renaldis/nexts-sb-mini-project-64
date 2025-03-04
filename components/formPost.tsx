import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";

const formSchema = z.object({
  content: z.string().min(3, { message: "Content minimal 3 karakter" }),
});

type FormData = z.infer<typeof formSchema>;

export default function FormPost() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    const userId = Cookies.get("userId");

    if (!userId) {
      toast.error("User tidak ditemukan, silakan login ulang.");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userId),
          content: data.content.trim(),
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Gagal menambahkan post");
      }

      reset();
      toast.success("Post Succesfully!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      mutate("/api/posts?type=all");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan, coba lagi.");
    }
  };

  return (
    <Card className="sticky top-0">
      <CardHeader>
        <h2 className="text-lg font-bold">Create New Post</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Textarea
              id="content"
              {...register("content")}
              className="w-full"
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit Post"}
          </Button>
        </form>
      </CardContent>
      <ToastContainer />
    </Card>
  );
}
