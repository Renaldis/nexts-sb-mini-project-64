import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSWRConfig } from "swr";
import { useEffect } from "react";
import type { Post } from "@/types";

const formSchema = z.object({
  content: z.string().min(3, { message: "Content minimal 3 karakter" }),
});

type FormData = z.infer<typeof formSchema>;

export default function EditPostDialog({
  postId,
  currentContent,
  open,
  setOpen,
}: {
  postId: number;
  currentContent?: Post;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { mutate } = useSWRConfig();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { content: currentContent?.content },
  });

  useEffect(() => {
    setValue("content", currentContent?.content ?? "");
  }, [currentContent?.content, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/posts/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId, content: data.content.trim() }),
      });

      if (!response.ok) throw new Error("Gagal mengupdate post");

      mutate("/api/posts?type=all");
      toast.success("Post updated successfully!");
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Terjadi kesalahan saat memperbarui post.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[400px] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100">
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
          <DialogDescription>
            Update konten post Anda di sini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            {...register("content")}
            className="w-full dark:bg-slate-100 dark:text-slate-800"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer bg-slate-500 dark:bg-slate-100 text-white dark:text-slate-800 dark:hover:bg-slate-500"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer dark:bg-slate-500 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
