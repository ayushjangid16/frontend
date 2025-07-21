// ProfileSection.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, User, Camera } from "lucide-react";
import EditProfileDialog from "./editProfile";
import { type UserType } from "./Profile";

const ProfileSection = ({
  profile,
  setProfile,
}: {
  profile: UserType;
  setProfile: React.Dispatch<React.SetStateAction<UserType | null>>;
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const backendImageUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleProfileUpdate = (updatedProfile: Partial<UserType>) => {
    setProfile((prev) => ({ ...prev!, ...updatedProfile }));
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle>Profile Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`${backendImageUrl}${profile.avatar_url[0].url}`}
                alt={profile.avatar_url[0].url}
              />
              <AvatarFallback>{getInitials(profile.fullname)}</AvatarFallback>
            </Avatar>
            <Button
              variant="secondary"
              size="sm"
              className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Camera className="h-4 w-4" />
            </Button>
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
            <Badge variant="outline" className="mt-2">
              Standard User
            </Badge>
          </div>
        </CardContent>
      </Card>

      <EditProfileDialog
        profile={profile}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  );
};

export default ProfileSection;
