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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Notifications() {
  const user_id = Cookies.get("userId");
  const { data, error } = useSWR(
    user_id ? `/api/notifications?user_id=${user_id}` : null,
    fetcher
  );

  if (error) return <p className="text-red-500">Gagal mengambil notifikasi.</p>;
  const notifications = data || [];

  async function markAsRead(id: number) {
    await fetch(`/api/notifications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    mutate(`/api/notifications?user_id=${user_id}`);
    toast.success("Notifikasi ditandai sebagai dibaca");
  }

  console.log(notifications);
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
            notifications.map((notif: any) => (
              <li
                key={notif.id}
                className={`flex justify-between items-center p-3 rounded-lg shadow-sm transition-all duration-300 bg-white  ${
                  notif.is_read ? "bg-gray-100" : "bg-blue-100"
                }`}
              >
                <p
                  className={`${
                    notif.is_read ? "text-gray-500" : "text-black"
                  }`}
                >
                  {notif.message}
                </p>
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
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
