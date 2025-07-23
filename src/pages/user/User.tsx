import Navbar from "@/components/Navbar";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Badge, Mail, User } from "lucide-react";
import { removeUser } from "@/store/slices/userSlice";
import { errorToast } from "@/components/customToast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PulseLoader } from "react-spinners";
import { type Blog } from "@/components/BlogCard";
import { Heart, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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
  posts: Blog[];
};

function UserPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const backendImageUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  useEffect(() => {
    setIsLoading(true);
    const id = new URLSearchParams(window.location.search).get("id");
    const fetchUser = async () => {
      const response = await fetch(`${backendUrl}/user?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      setIsLoading(false);
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
              <CardContent className="flex flex-col items-center gap-6">
                <Avatar className="h-28 w-28">
                  <AvatarImage
                    src={`${backendImageUrl}${profile?.avatar_url?.[0]?.url}`}
                    alt={profile?.avatar_url?.[0]?.url ?? ""}
                  />
                  <AvatarFallback>
                    {getInitials(profile.fullname)}
                  </AvatarFallback>
                </Avatar>

                <h2 className="text-3xl font-semibold text-gray-900">
                  {profile.fullname}
                </h2>

                <FollowButton userId={profile.id} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <Stat
                  label="Posts"
                  value={profile.posts.length}
                  icon={<Badge />}
                />
              </CardContent>
            </Card>

            <Separator />

            <main className="px-6 pb-10 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              {!isLoading ? (
                profile.posts.map((ele, index) => (
                  <PostCard key={index} blog={ele} />
                ))
              ) : (
                <div className="col-span-full flex justify-center items-center h-40">
                  <PulseLoader size={8} />
                </div>
              )}
            </main>
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

const PostCard = ({ blog }: { blog: Blog }) => {
  const backendImageUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/detail?id=${blog.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
    >
      {/* Image */}
      {blog.files?.length > 0 && (
        <img
          src={`${backendImageUrl}${blog.files[0].url}`}
          alt={blog.title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
      )}

      {/* Content */}
      <div className="p-5 flex flex-col justify-between h-48">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
            {blog.title}
          </h3>
          <p
            className="text-gray-600 text-sm leading-relaxed line-clamp-3"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>

        {/* Footer: Likes & Comments */}
        <div className="flex items-center space-x-6 mt-4">
          <span className="flex items-center text-red-500 space-x-1">
            <Heart className="w-5 h-5" />
            <span className="font-semibold text-gray-700">{blog.likes}</span>
          </span>
          <span className="flex items-center text-blue-500 space-x-1">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold text-gray-700">{blog.comments}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

const FollowButton = ({ userId }: { userId: string }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Optional: Fetch initial follow status when component mounts
  useEffect(() => {
    // fetch follow status from backend if needed
    // setIsFollowing(true or false)
  }, [userId]);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      // Replace this with actual API call
      if (isFollowing) {
        // Unfollow API
      } else {
        // Follow API
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      // handle error (toast etc)
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={toggleFollow} disabled={loading} className="w-1/4">
      {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default UserPage;
