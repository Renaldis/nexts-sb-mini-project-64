import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Heart, MessageCircle } from "lucide-react";
import useSWR, { mutate } from "swr";
import FormPost from "@/components/formPost";
import { useState } from "react";
import Cookies from "js-cookie";
import DropDownMenuEdit from "@/components/dropDownMenuEdit";
import { Badge } from "@/components/ui/badge";
import RepliesDialog from "@/components/replies";
import { useProfile } from "@/context/profileContextProvider";
import { toast } from "react-toastify";

interface Post {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  updated_at: string;
  id_likes_post_id: number;
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

export default function Home() {
  const { formatDate, getUserColor } = useProfile();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const {
    data: postsData,
    error: postsError,
    isLoading: postsLoading,
  } = useSWR("/api/posts?type=all", fetcher);

  const {
    data: usersData,
    error: usersError,
    isLoading: usersLoading,
  } = useSWR("/api/users", fetcher);

  const { data: repliesData } = useSWR(`/api/replies/post`, fetcher);
  const { data: likesData } = useSWR("/api/likes", fetcher);
  const myId = Cookies.get("userId");

  if (postsError || usersError)
    return <p className="text-red-500">Gagal mengambil data.</p>;
  if (postsLoading || usersLoading) return <p>Loading...</p>;

  const posts: Post[] = postsData?.data || [];
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
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan saat memperbarui post.", {
        autoClose: 1000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FormPost />
      {posts.map((post) => {
        const user = users.find((u) => u.id === post.user_id);
        const likedPost = likes.filter((l: Likes) => l.post_id === post.id);
        const LikedUser = likes.find(
          (l: Likes) => l.user_id === Number(myId) && l.post_id === post.id
        );

        const postReplies = repliesData?.data.filter(
          (r: Replies) => r.post_id === post.id
        );

        return (
          <div key={post.id}>
            <Card className="p-4 border w-full max-w-md">
              <CardHeader className="flex flex-row items-center space-x-3">
                <div
                  className={`w-10 h-10 text-white flex items-center justify-center rounded-full text-lg font-bold`}
                  style={{ backgroundColor: getUserColor(user?.name) }}
                >
                  {user?.name?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {user?.name || "Unknown User"}
                    <span className="text-gray-500 ml-2">
                      {user?.id === Number(myId) ? "(You)" : null}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <p className="text-xs text-gray-400">
                    {formatDate(post.created_at)}
                  </p>
                  {post.created_at !== post.updated_at ? (
                    <Badge variant="outline">Edited</Badge>
                  ) : (
                    ""
                  )}
                </div>
                {user?.id === Number(myId) ? (
                  <DropDownMenuEdit postId={post.id} currentContent={post} />
                ) : null}
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
                        setOpen(true),
                          setSelectedPost(post),
                          setSelectedUser(user);
                      }}
                    >
                      Replies
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
      <RepliesDialog open={open} setOpen={setOpen} postId={selectedPost?.id} />
    </div>
  );
}
