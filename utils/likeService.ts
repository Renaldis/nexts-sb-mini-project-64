import { mutate } from "swr";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const handleLike = async (
  post_id: number,
  posts: any[],
  profile: any
) => {
  const userIdCookies = Cookies.get("userId");

  if (!userIdCookies) {
    toast.error("Must login first");
    return;
  }

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
          message: `${profile?.name} liked your post.`,
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
