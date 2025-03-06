import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useProfile } from "@/context/profileContextProvider";
import { CheckCircle } from "lucide-react";
import { type Notification } from "@/types";

export default function Notification({
  markAsRead,
  notifications,
}: {
  markAsRead: (value: number) => void;
  notifications: Notification[];
}) {
  const { convertTime, getUserColor } = useProfile();
  return (
    <>
      <div className="max-w-lg mx-auto ">
        <ul className="space-y-3">
          {notifications?.length === 0 ? (
            <p className="text-gray-500 text-center">Tidak ada notifikasi</p>
          ) : (
            notifications?.map((notif: Notification) => {
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
                    } ml-2`}
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
    </>
  );
}
