import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Heart, MessageCircle } from "lucide-react";
import useSWR from "swr";
import FormPost from "@/components/formPost";
import { useState } from "react";
import Cookies from "js-cookie";
import DropDownMenuEdit from "@/components/dropDownMenuEdit";
import { Badge } from "@/components/ui/badge";
import RepliesDialog from "@/components/replies";
import { useProfile } from "@/context/profileContextProvider";
import Link from "next/link";
import { Post, Replies, Likes, User } from "@/types";
import { handleLike } from "@/utils/likeService";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const { formatDate, getUserColor, profile } = useProfile();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  return (
    <div className="flex flex-col gap-4 overflow-y-scroll min-h-screen">
      <FormPost />
      {posts?.length > 0 ? (
        posts.map((post) => {
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
                    {Number(user?.id) === Number(Cookies.get("userId")) ? (
                      <Link href="/profile">
                        <p className="font-semibold hover:bg-slate-50 rounded-full dark:hover:bg-transparent ">
                          {user?.name || "Unknown User"}
                          <span className="text-gray-500 ml-2">
                            {user?.id === Number(myId) ? "(You)" : null}
                          </span>
                        </p>
                      </Link>
                    ) : (
                      <Link href={`/profile/${user?.id}`}>
                        <p className="font-semibold hover:bg-slate-50 dark:hover:bg-transparent rounded-full">
                          {user?.name || "Unknown User"}
                          <span className="text-gray-500 ml-2">
                            {user?.id === Number(myId) ? "(You)" : null}
                          </span>
                        </p>
                      </Link>
                    )}
                    <p className="text-xs text-gray-400">{user?.email}</p>
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
                  {user?.id === Number(myId) ? (
                    <DropDownMenuEdit postId={post.id} currentContent={post} />
                  ) : null}
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
            </div>
          );
        })
      ) : (
        <div className="dark:bg-slate-600 bg-slate-100 rounded-full mt-10">
          <p className="text-center text-slate-800 dark:text-slate-100  p-2">
            --------- tidak ada posts tersedia ---------
          </p>
        </div>
      )}
      <RepliesDialog
        posts={posts}
        open={open}
        setOpen={setOpen}
        postId={selectedPost?.id}
      />
    </div>
  );
}
