import { useRouter } from "next/router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useSWR from "swr";
import UserPost from "./userPost";
import { useProfile } from "@/context/profileContextProvider";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useSWR(
    id ? `/api/users/profile?userId=${id}` : null,
    fetcher
  );
  const { getUserColor } = useProfile();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data?.data) return <p className="text-gray-500">User not found</p>;

  const profile = data.data;

  const userProfile = [
    { label: "Email", profile: profile?.email },
    { label: "Hobby", profile: profile?.hobby || "N/A" },
    {
      label: "Date of Birth",
      profile: profile?.birth_date
        ? new Date(profile.birth_date).toLocaleDateString("id-ID")
        : "N/A",
    },
    { label: "Phone", profile: profile?.phone || "N/A" },
  ];

  return (
    <div className="flex flex-col gap-4 overflow-y-scroll max-h-[100vh]">
      <Card>
        <div className="flex justify-center">
          <CardHeader className="flex flex-col items-center">
            <Avatar>
              <AvatarFallback
                className="bg-green-600 text-white font-bold"
                style={{ backgroundColor: getUserColor(profile?.name) }}
              >
                {profile?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold mt-2">{profile?.name}</h2>
          </CardHeader>
        </div>
        <CardContent>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            {userProfile.map((user, idx) => (
              <div key={idx}>
                <p className="font-semibold">{user.label}</p>
                <p className="text-gray-600">{user.profile}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <UserPost />
    </div>
  );
};

export default UserProfile;
