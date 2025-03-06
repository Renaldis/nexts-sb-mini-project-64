import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Bell, ChevronDown, LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

import ProfileAvatar from "./profileAvatar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Header = () => {
  const { setTheme } = useTheme();
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
      <div className="flex justify-between items-center sticky top-0">
        <Link
          href={"/"}
          className="font-bold text-xl ms-2 text-black dark:text-white"
        >
          Public Diary
        </Link>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="bg-white dark:bg-slate-900"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-slate-900" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isLogin ? (
            <div className="relative">
              <Menubar className="bg-transparent">
                <MenubarMenu>
                  <MenubarTrigger className="flex gap-1 cursor-pointer bg-transparent">
                    <ProfileAvatar />
                    <ChevronDown className="text-black dark:text-white" />
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
      </div>
    </header>
  );
};

export default Header;
