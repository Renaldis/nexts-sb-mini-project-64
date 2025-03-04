import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, ChevronDown, LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useProfile } from "@/context/profileContextProvider";
import { useEffect, useState } from "react";
import { cookies } from "next/headers";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Header = () => {
  const { profile, loading, getUserColor } = useProfile();
  const router = useRouter();
  async function handleLogout() {
    Cookies.remove("sb_token");
    Cookies.remove("gmail");
    Cookies.remove("userId");
    Cookies.remove("color");
    router.reload();
  }
  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    if (Cookies.get("userId")) setIsLogin(true);
  }, []);

  const { data } = useSWR("/api/me", fetcher);

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
                  <Avatar>
                    <AvatarFallback
                      className="bg-green-600 text-white font-bold"
                      style={{ backgroundColor: getUserColor(data?.data.name) }}
                    >
                      {profile?.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
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
