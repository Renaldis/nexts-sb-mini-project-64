import { useProfile } from "@/context/profileContextProvider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProfileAvatar() {
  const { profile, getUserColor } = useProfile();
  const { data } = useSWR("/api/me", fetcher);
  return (
    <>
      <Avatar>
        <AvatarFallback
          className="bg-green-600 text-white font-bold"
          style={{ backgroundColor: getUserColor(data?.data.name) }}
        >
          {profile?.name.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
    </>
  );
}
