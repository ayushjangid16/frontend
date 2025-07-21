// EditProfileDialog.tsx
import React, { useState } from "react";
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
import { Camera, Upload } from "lucide-react";
import { type UserType } from "./Profile";

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
  const [formData, setFormData] = useState({
    fullname: profile.fullname,
    email: profile.email,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = () => {
    // Simulate avatar upload
    // (Integrate with real avatar storage in a real app)
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 1000));

    onProfileUpdate(formData);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-2">
              <AvatarImage src="" alt={formData.fullname} />
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
