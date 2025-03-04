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
import useSWR, { useSWRConfig } from "swr";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useProfile } from "@/context/profileContextProvider";
import { Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { Badge } from "./ui/badge";
import { Post, Replies, Likes, User } from "@/types";

const formSchema = z.object({
  content: z.string().min(3, { message: "Replies minimal 3 karakter" }),
});

type FormData = z.infer<typeof formSchema>;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RepliesDialog({
  postId,
  open,
  setOpen,
  posts,
}: {
  postId: number | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  posts: any;
}) {
  const { formatDate } = useProfile();
  const { mutate } = useSWRConfig();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { data: repliesData } = useSWR(
    postId ? `/api/replies/post?post_id=${postId}` : null,
    fetcher
  );
  const { data: usersData } = useSWR("/api/users", fetcher);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/replies/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          content: data.content.trim(),
        }),
      });

      if (!response.ok) throw new Error("Gagal mengupdate post");

      mutate(`/api/replies/post?post_id=${postId}`);
      mutate(`/api/replies/post`);
      toast.success("Replies successfully!");
      reset();

      const userIdCookies = Cookies.get("userId");
      if (!userIdCookies) toast.error("must login first");
      const postOwner = posts.find((post: any) => post.id === postId)?.user_id;
      if (postOwner && Number(postOwner) !== Number(userIdCookies)) {
        await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: postOwner,
            sender_id: Number(userIdCookies),
            type: "reply",
            post_id: postId,
            message: `User ${userIdCookies} Reply your post.`,
          }),
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memperbarui post.");
    }
  };
  const users: User[] = usersData?.data || [];

  const handleDeleteReply = async (id: number) => {
    const response = await fetch("/api/replies/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
      }),
    });
    mutate(`/api/replies/post?post_id=${postId}`);
    mutate(`/api/replies/post`);
    if (response.ok) {
      toast.success("delete succesfully");
    }
  };

  const userIdLogin = Cookies.get("userId");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[400px] h-screen  overflow-y-auto">
        <div className="overflow-y-auto">
          <div className="sticky top-0 z-50">
            <DialogHeader>
              <DialogTitle>Replies Post</DialogTitle>
              <DialogDescription>Create your own replies.</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 bg-white"
            >
              <Textarea
                {...register("content")}
                className="w-full bg-blue-50"
                placeholder="your replies ..."
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full mb-4"
              >
                {isSubmitting ? "Submitting..." : "Submit Reply"}
              </Button>
            </form>
          </div>
          <div className="space-y-2">
            {repliesData?.replies.length > 0 ? (
              repliesData.replies.map((replies: Replies) => {
                const user = users.find((u) => u.id === replies.user_id);
                return (
                  <div
                    key={replies.id}
                    className="border shadow-md rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          className="inline-flex items-center gap-2 bg-sky-100 px-3
                   py-1 rounded-full text-sm"
                        >
                          <Avatar>
                            <AvatarFallback className="bg-green-600 text-white font-bold text-sm">
                              {user?.name.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user?.name} </span>
                        </div>

                        {Number(userIdLogin) === user?.id && (
                          <Badge variant="outline">(You)</Badge>
                        )}
                      </div>
                      {Number(userIdLogin) === user?.id && (
                        <Trash2
                          className="hover:text-red-900 text-red-600 cursor-pointer"
                          size={24}
                          onClick={() => handleDeleteReply(replies.id)}
                        />
                      )}
                    </div>
                    <div className="flex flex-col space-y-3">
                      <span className="text-sm text-slate-600">
                        {formatDate(replies.created_at)}
                      </span>
                      <span className="text-sm text-black">
                        {replies.content}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-center">
                --------no reply available--------
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
