import Head from "next/head";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProfile } from "@/context/profileContextProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FormPost from "@/components/formPost";
import MyPost from "./myPost";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const UserProfile = () => {
  const { profile, loading, getUserColor } = useProfile();
  const { data } = useSWR("/api/me", fetcher);
  if (loading) return <p>Loading...</p>;

  const userProfile = [
    {
      label: "Email",
      profile: profile?.email,
    },
    {
      label: "Hobby",
      profile: profile?.hobby,
    },
    {
      label: "Date of Birth",
      profile: profile?.birth_date
        ? new Date(profile.birth_date).toLocaleDateString("id-ID")
        : "N/A",
    },
    {
      label: "Phone",
      profile: profile?.phone,
    },
  ];

  return (
    <>
      <Head>
        <title>Nexts Mini Project - MyProfile</title>
      </Head>
      <div className="flex flex-col gap-4 overflow-y-scroll max-h-[100vh]">
        <Card>
          <div className="flex justify-center">
            <CardHeader className="flex flex-col items-center">
              <Avatar>
                <AvatarFallback
                  className="bg-green-600 text-white font-bold"
                  style={{ backgroundColor: getUserColor(data?.data.name) }}
                >
                  {profile?.name.slice(0, 1)}
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
        <FormPost />
        <MyPost />
      </div>
    </>
  );
};

export default UserProfile;
