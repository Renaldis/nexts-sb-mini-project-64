import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { CheckCircle, Bell } from "lucide-react";
import { useProfile } from "@/context/profileContextProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Notifications() {
  const { convertTime, getUserColor } = useProfile();
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
    <div className="min-h-[800px]">
      <h3 className="text-lg font-semibold flex items-center mb-3">
        <Bell className="mr-2" /> Notifikasi
      </h3>
      <div className="max-w-lg mx-auto ">
        <ul className="space-y-3">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center">Tidak ada notifikasi</p>
          ) : (
            notifications.map((notif: any) => {
              return (
                <li
                  key={notif.id}
                  className={`flex justify-between items-center p-3 rounded-lg shadow-sm transition-all duration-300 bg-white  ${
                    notif.is_read ? "bg-gray-100" : "bg-blue-100"
                  }`}
                >
                  <Avatar>
                    <AvatarFallback
                      className="bg-green-600 text-white font-bold"
                      style={{
                        backgroundColor: getUserColor(notif.sender_name),
                      }}
                    >
                      {notif.sender_name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <p
                    className={`${
                      notif.is_read ? "text-gray-500" : "text-black"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <span className="text-sm text-slate-500">
                    {convertTime(notif.created_at)}
                  </span>
                  {!notif.is_read && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger
                          onClick={() => markAsRead(notif.id)}
                          className="cursor-pointer"
                        >
                          <CheckCircle
                            size={20}
                            className="text-green-500 hover:text-green-700"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark as read</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
