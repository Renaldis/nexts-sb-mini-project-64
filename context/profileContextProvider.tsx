import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { formatDistanceToNow, format } from "date-fns";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  birth_date: string;
  phone: string;
  hobby?: string;
  created_at: string;
  updated_at: string;
} | null;

type ProfileContextType = {
  profile: UserProfile;
  loading: boolean;
  formatDate: (value: string) => string;
  getUserColor: (value: string | undefined) => string;
  convertTime: (value: string) => string;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [profile, setProfile] = useState<UserProfile>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLogin, setIsLogin] = useState<boolean>(!!Cookies.get("userId"));

  // if (Cookies.get("userId")) setIsLogin(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/me");
        const result = await response.json();
        if (response.ok) {
          setProfile(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLogin) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isLogin]);
  function formatDate(value: string): string {
    const date = new Date(value);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mnt`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jm`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} hr`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 604800)} mgg`;
    if (diffInSeconds < 31536000)
      return `${Math.floor(diffInSeconds / 2592000)} bln`;

    return `${Math.floor(diffInSeconds / 31536000)} thn`;
  }
  function getUserColor(name: string | undefined) {
    if (!name) return "#000000"; // Default warna jika nama tidak ada

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).slice(-2);
    }

    return color;
  }

  const convertTime = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays >= 30) {
      return format(date, "MMMM yyyy"); // "March 2025"
    }
    return formatDistanceToNow(date, { addSuffix: true }); // "5 minutes ago", "2 days ago", etc.
  };
  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        formatDate,
        getUserColor,
        convertTime,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
