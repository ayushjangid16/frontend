// ProfilePage.tsx
import React, { useEffect, useState } from "react";
import ProfileSection from "./profileSection";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "@/store/slices/userSlice";
import { errorToast } from "@/components/customToast";

export type UserType = {
  id: string;
  first_name: string;
  last_name: string;
  fullname: string;
  email: string;
  followers: number;
  following: number;
  avatar_url: [
    {
      id: string;
      url: string;
    }
  ];
};

const ProfilePage: React.FC = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserType | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`${backendUrl}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      if (!response.ok) {
        errorToast(result.error.message);
        const logoutMessages = [
          "User not found or deleted.",
          "Invalid or expired token.",
          "Please Provide a Token.",
          "Invalid Token",
        ];
        if (logoutMessages.includes(result.error.message)) {
          dispatch(removeUser());
          localStorage.clear();
          navigate("/login", { replace: true });
        }
        return;
      }

      setProfile(result.data);
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6 mt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">
            Manage your account information and settings
          </p>
        </div>

        {profile && (
          <>
            <ProfileSection profile={profile} setProfile={setProfile} />

            <Card>
              <CardHeader>
                <CardTitle>Social Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Stat
                  label="Followers"
                  value={profile.followers}
                  icon={<Users />}
                />
                <Stat
                  label="Following"
                  value={profile.following}
                  icon={<UserPlus />}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </>
  );
};

const Stat = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) => (
  <div className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
    <div className="flex justify-center text-primary mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default ProfilePage;
