import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import useSWR, { mutate } from "swr";

import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/context/profileContextProvider";
import { Badge } from "@/components/ui/badge";
import DropDownMenuEdit from "@/components/dropDownMenuEdit";
import RepliesDialog from "@/components/replies";
import { useRouter } from "next/router";

interface Post {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}
interface User {
  id: number;
  name: string;
  email: string;
}
interface Replies {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
}

interface Likes {
  id: number;
  user_id: number;
  post_id: number;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserPost() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isLoading } = useSWR(
    `/api/posts/user?userId=${id}`,
    fetcher
  );

  const { data: usersData } = useSWR("/api/users", fetcher);
  const { data: repliesData } = useSWR(`/api/replies/post`, fetcher);
  const { data: likesData } = useSWR("/api/likes", fetcher);
  const { loading, formatDate, getUserColor } = useProfile();

  const myId = Cookies.get("userId");

  const [open, setOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-500">Gagal mengambil data post.</p>;
  if (isLoading) return <p>Loading...</p>;

  const posts: Post[] = data?.data || [];
  const users: User[] = usersData?.data || [];
  const likes: Likes[] = likesData?.data || [];

  const handleLike = async (post_id: number) => {
    const userIdCookies = Cookies.get("userId");
    if (!userIdCookies) toast.error("must login first");
    try {
      const response = await fetch("/api/likes/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(userIdCookies),
          post_id: Number(post_id),
        }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal mengupdate post");
      mutate("/api/likes");
      toast.success(result.message, {
        autoClose: 1000,
        position: "top-center",
      });

      const postOwner = posts.find((post) => post.id === post_id)?.user_id;
      if (postOwner && Number(postOwner) !== Number(userIdCookies)) {
        const responseNotif = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: postOwner,
            sender_id: Number(userIdCookies),
            type: "like",
            post_id: post_id,
            message: `User ${userIdCookies} liked your post.`,
          }),
        });
        const notifResult = await responseNotif.json();
        if (notifResult.message !== "Notifikasi sudah ada") {
          console.log("Notifikasi berhasil dikirim");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memperbarui post.", {
        autoClose: 1000,
        position: "top-center",
      });
    }
  };
  return (
    <>
      <div className="space-y-4 h-screen">
        {data?.data.map((post: Post) => {
          const user = users.find((u) => u.id === post.user_id);
          const likedPost = likes.filter((l: Likes) => l.post_id === post.id);
          const LikedUser = likes.find(
            (l: Likes) => l.user_id === Number(myId) && l.post_id === post.id
          );
          const postReplies = repliesData?.data.filter(
            (r: Replies) => r.post_id === post.id
          );
          return (
            <Card className="p-4 border w-full max-w-md" key={post.id}>
              <CardHeader className="flex flex-row items-center space-x-3">
                <div
                  className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full text-lg font-bold"
                  style={{ backgroundColor: getUserColor(user?.name) }}
                >
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{user?.name || "User"} </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || "N/A"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(post.created_at)}
                  </p>
                  {post.created_at !== post.updated_at ? (
                    <Badge variant="outline">Edited</Badge>
                  ) : (
                    ""
                  )}
                </div>
                <DropDownMenuEdit postId={post.id} currentContent={post} />
              </CardHeader>
              <CardContent>
                <p className="mb-3">{post.content}</p>
                <div className="flex items-center space-x-4 text-gray-500">
                  <button
                    className="flex items-center space-x-1 hover:font-bold cursor-pointer"
                    onClick={() => handleLike(post?.id)}
                  >
                    {LikedUser ? (
                      <Heart size={16} color="red" />
                    ) : (
                      <Heart size={16} />
                    )}

                    <span>{likedPost?.length} Like</span>
                  </button>
                  <button className="flex items-center space-x-1 cursor-pointer hover:text-slate-900">
                    <MessageCircle size={16} />
                    <span>{postReplies?.length}</span>
                    <span
                      onClick={() => {
                        setOpen(true), setSelectedPost(post);
                      }}
                    >
                      Replies
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <RepliesDialog
          posts={posts}
          open={open}
          setOpen={setOpen}
          postId={selectedPost?.id}
        />
      </div>
      <ToastContainer />
    </>
  );
}
