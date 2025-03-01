import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "react-toastify";
import Cookies from "js-cookie";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/context/profileContextProvider";

interface Post {
  id: number;
  content: string;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyPost() {
  const { profile, loading } = useProfile();
  const [likes, setLikes] = useState(0);
  const [replies, setReplies] = useState(0);

  if (loading) return <p>Loading...</p>;

  const userId = Cookies.get("userId");

  const { data, error, isLoading } = useSWR(
    userId ? "/api/posts?type=me" : null,
    fetcher
  );
  console.log(data);

  if (!userId) {
    toast.error("User tidak ditemukan, silakan login ulang.");
    return <p>Silakan login untuk melihat post Anda.</p>;
  }

  if (error) return <p className="text-red-500">Gagal mengambil data post.</p>;
  if (isLoading) return <p>Loading...</p>;

  const posts: Post[] = data?.data || [];
  console.log(posts);
  

  return (
    <>
      {posts.map((post) => {
        return (
          <Card className="p-4 border w-full max-w-md" key={post.id}>
            <CardHeader className="flex flex-row items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 text-white flex items-center justify-center rounded-full text-lg font-bold">
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
                  {new Date(post.created_at).toLocaleDateString("id-ID")}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" asChild>
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <button className="flex items-center space-x-1">
                  <MessageCircle size={16} />
                  <span>{replies} Replies</span>
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
