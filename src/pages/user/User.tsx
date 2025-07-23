import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Badge, Mail, User } from "lucide-react";
import { removeUser } from "@/store/slices/userSlice";
import { errorToast } from "@/components/customToast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type UserType = {
  id: string;
  first_name: string;
  last_name: string;
  fullname: string;
  email: string;
  followers: number;
  following: number;
  avatar_url:
    | [
        {
          id: string | null;
          url: string | null;
        }
      ]
    | null;
  posts: number;
};

function UserPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const backendImageUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserType | null>(null);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

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
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6 mt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        </div>

        {profile && (
          <>
            {/* <ProfileSection profile={profile} setProfile={setProfile} /> */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={`${backendImageUrl}${profile?.avatar_url?.[0]?.url}`}
                      alt={profile?.avatar_url?.[0]?.url ?? ""}
                    />
                    <AvatarFallback>
                      {getInitials(profile.fullname)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{profile.fullname}</h2>
                  <p className="text-gray-600 flex items-center mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    {profile.email}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <User className="w-4 h-4 mr-2" />
                    Member ID: {profile.id}
                  </p>
                </div>
              </CardContent>
            </Card>

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
    </div>
  );
}

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

export default UserPage;
