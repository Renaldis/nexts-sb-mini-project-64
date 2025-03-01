import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

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

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
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
