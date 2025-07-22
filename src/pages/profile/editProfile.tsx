import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";
import { type UserType } from "./Profile";
import { errorToast, successToast } from "@/components/customToast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "@/store/slices/userSlice";

interface EditProfileDialogProps {
  profile: UserType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdate: (profile: Partial<UserType>) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
  profile,
  open,
  onOpenChange,
  onProfileUpdate,
}) => {
  const backendUrl: string = import.meta.env.VITE_BACKEND_BASE_URL;
  const backendImage: string = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullname: profile.fullname,
    email: profile.email,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    `${backendImage}${profile?.avatar_url?.[0]?.url}`
  );

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);

      // now make a call to db

      const fileData = new FormData();
      fileData.append("user", file);

      const response = await fetch(`${backendUrl}/profile/image`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: fileData,
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

      successToast("Profile Image Changed");
    }
  };

  const handleSubmit = async () => {};

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   let avatarUrl = profile?.avatar_url?.[0]?.url;

  //   if (avatarFile) {
  //     const uploadData = new FormData();
  //     uploadData.append("avatar", avatarFile);

  //     try {
  //       // const res = await fetch("/api/upload-avatar", {
  //       //   method: "POST",
  //       //   body: uploadData,
  //       // });

  //       // const data = await res.json();
  //       // avatarUrl = data.url;
  //     } catch (error) {
  //       console.error("Avatar upload failed:", error);
  //     }
  //   }

  //   onProfileUpdate({ ...formData, avatarUrl });
  //   setIsLoading(false);
  //   onOpenChange(false);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage
                src={avatarPreview ?? ""}
                alt={avatarPreview ?? ""}
              />
              <AvatarFallback>
                {formData.fullname
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAvatarUpload}
              className="flex items-center gap-1"
            >
              <Upload className="h-4 w-4" />
              Upload Avatar
            </Button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.fullname}
              onChange={(e) => handleInputChange("fullname", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
