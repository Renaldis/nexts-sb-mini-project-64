import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useMemo } from "react";

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
  function formatDate(value: string) {
    const date = new Date(value);
    return date.toDateString();
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

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        formatDate,
        getUserColor,
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
