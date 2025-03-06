import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";

import { Bell, ChevronDown, LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import ProfileAvatar from "./profileAvatar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Header = () => {
  const router = useRouter();
  async function handleLogout() {
    Cookies.remove("sb_token");
    Cookies.remove("userId");
    router.reload();
  }
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (Cookies.get("sb_token")) setIsLogin(true);
  }, []);

  const user_id = Cookies.get("userId");
  const { data: dataNotification } = useSWR(
    user_id ? `/api/notifications?user_id=${user_id}` : null,
    fetcher
  );

  return (
    <header className="border-b w-full p-2">
      <div className="flex justify-between items-center">
        <Link href={"/"} className="font-bold text-xl ms-2">
          Public Diary
        </Link>
        {isLogin ? (
          <div className="relative">
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="flex gap-1 cursor-pointer">
                  <ProfileAvatar />
                  <ChevronDown />
                </MenubarTrigger>

                <MenubarContent className="absolute -left-28">
                  <Link href={"/profile"}>
                    <MenubarItem className="cursor-pointer">
                      <UserIcon /> My Profile
                    </MenubarItem>
                  </Link>
                  <Link href={"/notifications"}>
                    <MenubarItem className="cursor-pointer">
                      <Bell />
                      {dataNotification?.length > 0 ? (
                        <span className="font-semibold">
                          {dataNotification.length}
                        </span>
                      ) : (
                        ""
                      )}
                      Notifications
                    </MenubarItem>
                  </Link>
                  <MenubarItem
                    className="cursor-pointer"
                    onClick={() => handleLogout()}
                  >
                    <LogOut />
                    Logout
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
