import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import useSWR from "swr";
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/context/profileContextProvider";
import { Badge } from "@/components/ui/badge";
import DropDownMenuEdit from "@/components/dropDownMenuEdit";
import RepliesDialog from "@/components/replies";
import { Post, User, Likes, Replies } from "@/types";
import { handleLike } from "@/utils/likeService";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyPost() {
  const userId = Cookies.get("userId");
  const { profile, loading, formatDate, getUserColor } = useProfile();
  const { data: repliesData } = useSWR(`/api/replies/post`, fetcher);
  const { data: likesData } = useSWR("/api/likes", fetcher);
  const { data: usersData } = useSWR("/api/users", fetcher);
  const { data, error, isLoading } = useSWR(
    userId ? "/api/posts?type=me" : null,
    fetcher
  );

  const [open, setOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (loading) return <p>Loading...</p>;
  const myId = Cookies.get("userId");
  if (!userId) {
    toast.error("User tidak ditemukan, silakan login ulang.");
    return <p>Silakan login untuk melihat post Anda.</p>;
  }
  if (error) return <p className="text-red-500">Gagal mengambil data post.</p>;
  if (isLoading) return <p>Loading...</p>;
  const posts: Post[] = data?.data || [];
  const users: User[] = usersData?.data || [];
  const likes: Likes[] = likesData?.data || [];

  return (
    <div className="space-y-4">
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
          <Card className="p-4 border w-full max-w-md" key={post.id}>
            <CardHeader className="flex flex-row items-center space-x-3">
              <div
                className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full text-lg font-bold"
                style={{ backgroundColor: getUserColor(user?.name) }}
              >
                {profile?.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1">
                <p className="font-semibold">
                  {profile?.name || "User"}
                  <span className="text-gray-500">(You)</span>
                </p>
                <p className="text-sm text-gray-500">
                  {profile?.email || "N/A"}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-gray-400">
                    {formatDate(post.created_at)} lalu
                  </p>
                  {post.created_at !== post.updated_at ? (
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
              </div>
              <DropDownMenuEdit postId={post.id} currentContent={post} />
            </CardHeader>
            <CardContent>
              <p className="mb-3">{post.content}</p>
              <div className="flex items-center space-x-4 text-gray-500">
                <button
                  className="flex items-center space-x-1 hover:font-bold cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                  onClick={() => handleLike(post.id, posts, profile)}
                >
                  {LikedUser ? (
                    <Heart size={16} color="red" />
                  ) : (
                    <Heart size={16} />
                  )}

                  <span>{likedPost?.length} Like</span>
                </button>
                <button className="flex items-center space-x-1 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">
                  <MessageCircle size={16} />
                  <span>{postReplies?.length}</span>
                  <span
                    onClick={() => {
                      setOpen(true);
                      setSelectedPost(post);
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
  );
}
