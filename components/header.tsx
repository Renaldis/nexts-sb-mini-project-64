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

const Header = () => {
  const router = useRouter();
  async function handleLogout() {
    Cookies.remove("sb_token");
    router.reload();
  }
  return (
    <header className="border-b w-full p-2">
      <div className="flex justify-between items-center">
        <Link href={"/"} className="font-bold text-xl">
          Sanber Daily
        </Link>
        <div className="relative">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="flex gap-1 cursor-pointer">
                <Avatar>
                  <AvatarFallback className="bg-green-600 text-white font-bold">
                    CN
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
      </div>
    </header>
  );
};

export default Header;
