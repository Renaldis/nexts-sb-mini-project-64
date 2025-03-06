import Head from "next/head";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Bell } from "lucide-react";
import Notification from "./notification";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Notifications() {
  const user_id = Cookies.get("userId");
  const { data: notificationData, error } = useSWR(
    user_id ? `/api/notifications?user_id=${user_id}` : null,
    fetcher
  );

  if (error) return <p className="text-red-500">Gagal mengambil notifikasi.</p>;

  async function markAsRead(id: number) {
    await fetch(`/api/notifications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    mutate(`/api/notifications?user_id=${user_id}`);
    toast.success("Notifikasi ditandai sebagai dibaca");
  }
  const notifications = notificationData || [];

  return (
    <>
      <Head>
        <title>Nexts Mini Project - Notifications</title>
      </Head>
      <div className="min-h-screen">
        <h3 className="text-lg font-semibold flex items-center mb-3">
          <Bell className="mr-2" /> Notifikasi
        </h3>
        <Notification notifications={notifications} markAsRead={markAsRead} />
      </div>
    </>
  );
}
