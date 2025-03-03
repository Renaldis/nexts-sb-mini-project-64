import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import useSWR from "swr";
import FormPost from "@/components/formPost";
import { useState } from "react";
import Cookies from "js-cookie";
import DropDownMenuEdit from "@/components/dropDownMenuEdit";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  updated_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
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

  const [myId, setMyId] = useState(Cookies.get("userId"));

  if (postsError || usersError)
    return <p className="text-red-500">Gagal mengambil data.</p>;
  if (postsLoading || usersLoading) return <p>Loading...</p>;

  const posts: Post[] = postsData?.data || [];
  const users: User[] = usersData?.data || [];

  return (
    <div className="flex flex-col gap-4">
      <FormPost />
      {posts.map((post) => {
        const user = users.find((u) => u.id === post.user_id);

        return (
          <Card className="p-4 border w-full max-w-md" key={post.id}>
            <CardHeader className="flex flex-row items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
                {user?.name?.charAt(0) || "U"}
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
                  {new Date(post.created_at).toLocaleDateString("id-ID")}
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
                  // onClick={() => setLikes(likes + 1)}
                  className="flex items-center space-x-1"
                >
                  <Heart size={16} />
                  {/* <span>{likes} Like</span> */}
                </button>
                <button className="flex items-center space-x-1">
                  <MessageCircle size={16} />
                  {/* <span>{replies} Replies</span> */}
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
