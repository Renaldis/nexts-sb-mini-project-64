import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR, { useSWRConfig } from "swr";
import { useProfile } from "@/context/profileContextProvider";
import { Ellipsis } from "lucide-react";
import Cookies from "js-cookie";
import { Badge } from "./ui/badge";
import { Replies, User } from "@/types";
import type { Post } from "@/types";
import { useState } from "react";

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
  posts: Post[];
}) {
  const { formatDate, profile, getUserColor } = useProfile();
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

  const [isEdit, setIsEdit] = useState(false);
  const [editReplies, setEditReplies] = useState<Replies | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      const url = isEdit ? `/api/replies/update` : `/api/replies/post`;
      const method = isEdit ? "PATCH" : "POST";
      const body = JSON.stringify(
        isEdit
          ? { reply_id: editReplies?.id, content: replyContent }
          : { post_id: postId, content: data.content.trim() }
      );
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (!response.ok) throw new Error("Gagal mengupdate post");

      mutate(`/api/replies/post?post_id=${postId}`);
      mutate(`/api/replies/post`);
      toast.success("Replies successfully!", {
        autoClose: 1000,
        position: "top-center",
      });
      setIsEdit(false);
      setEditReplies(null);
      reset();
      setReplyContent("");

      const userIdCookies = Cookies.get("userId");
      if (!userIdCookies)
        toast.error("must login first", {
          autoClose: 1000,
          position: "top-center",
        });
      const postOwner = posts.find((post: Post) => post.id === postId)?.user_id;
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
            message: `${profile?.name} membalas postingan anda.`,
          }),
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message, {
          autoClose: 1000,
          position: "top-center",
        });
      } else {
        toast.error("Terjadi kesalahan saat memperbarui post.", {
          autoClose: 1000,
          position: "top-center",
        });
      }
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
      toast.success("delete succesfully", {
        autoClose: 1000,
        position: "top-center",
      });
    }
  };
  const handleEdit = (replies: Replies) => {
    setIsEdit(true);
    setEditReplies(replies);
    setReplyContent(replies.content);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setEditReplies(null);
    setReplyContent("");
    reset();
  };
  const userIdLogin = Cookies.get("userId");
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[400px] h-screen overflow-y-auto bg-white text-slate-800 dark:text-slate-100 dark:bg-slate-800 my-5">
        <div className="overflow-y-auto">
          <div className="sticky top-0 z-50 bg-white dark:bg-slate-800">
            <DialogHeader className="mb-4">
              <DialogTitle>Komentar</DialogTitle>
              <DialogDescription>Tambahkan balasan Anda.</DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 bg-white dark:bg-transparent"
            >
              <Textarea
                {...register("content")}
                className="w-full bg-blue-50 dark:text-slate-800"
                placeholder="your replies ..."
                value={replyContent}
                onChange={handleInputChange}
              />
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content.message}</p>
              )}
              {!isEdit ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full mb-4"
                >
                  {isSubmitting ? "Submitting..." : "Submit Reply"}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full mb-4"
                  >
                    {isSubmitting ? "Saving Changes..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    className="cursor-pointer w-full mb-4"
                    onClick={handleCancelEdit}
                  >
                    {isSubmitting ? "Cancelling..." : "Cancel"}
                  </Button>
                </div>
              )}
            </form>
          </div>
          <div className="space-y-2 mb-10">
            {repliesData?.replies.length > 0 ? (
              repliesData.replies.map((replies: Replies) => {
                const user = users.find((u) => u.id === replies.user_id);
                return (
                  <div
                    key={replies.id}
                    className="border shadow-md rounded-lg p-4 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm">
                          <div
                            className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full text-lg font-bold"
                            style={{
                              backgroundColor: getUserColor(user?.name),
                            }}
                          >
                            {profile?.name?.charAt(0) || "U"}
                          </div>
                          <span>{user?.name} </span>
                        </div>

                        {Number(userIdLogin) === user?.id && (
                          <Badge
                            variant="outline"
                            className="text-slate-600 dark:text-slate-100"
                          >
                            (You)
                          </Badge>
                        )}
                      </div>
                      {Number(userIdLogin) === user?.id && (
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Ellipsis className="text-black cursor-pointer dark:text-white" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="absolute -right-6">
                              <DropdownMenuItem
                                onClick={() => handleEdit(replies)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-500"
                                onClick={() => handleDeleteReply(replies.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div className="space-x-2">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {formatDate(replies.created_at)} lalu
                        </span>
                        {replies.created_at !== replies.updated_at ? (
                          <Badge
                            variant="outline"
                            className="text-slate-600 dark:text-slate-100"
                          >
                            Edited
                          </Badge>
                        ) : (
                          ""
                        )}
                      </div>
                      <span className="text-sm text-black dark:text-slate-300">
                        {replies.content}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-center">
                --------Tidak ada balasan tersedia.--------
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
