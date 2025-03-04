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
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyPost() {
  const { profile, loading, formatDate, getUserColor } = useProfile();
  const [likes, setLikes] = useState(0);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  if (loading) return <p>Loading...</p>;

  const userId = Cookies.get("userId");

  const { data, error, isLoading } = useSWR(
    userId ? "/api/posts?type=me" : null,
    fetcher
  );

  const { data: usersData } = useSWR("/api/users", fetcher);

  const { data: repliesData } = useSWR(`/api/replies/post`, fetcher);

  if (!userId) {
    toast.error("User tidak ditemukan, silakan login ulang.");
    return <p>Silakan login untuk melihat post Anda.</p>;
  }

  if (error) return <p className="text-red-500">Gagal mengambil data post.</p>;
  if (isLoading) return <p>Loading...</p>;

  const posts: Post[] = data?.data || [];
  const users: User[] = usersData?.data || [];
  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const user = users.find((u) => u.id === post.user_id);
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
                  {profile?.name || "User"}{" "}
                  <span className="text-gray-500">(You)</span>
                </p>
                <p className="text-sm text-gray-500">
                  {profile?.email || "N/A"}
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
                  onClick={() => setLikes(likes + 1)}
                  className="flex items-center space-x-1"
                >
                  <Heart size={16} />
                  <span>{likes} Like</span>
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
        );
      })}
      <RepliesDialog open={open} setOpen={setOpen} postId={selectedPost?.id} />
    </div>
  );
}
