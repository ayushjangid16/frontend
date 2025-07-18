import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  HeartIcon,
  MessageCircleIcon,
  MoreHorizontalIcon,
  ShareIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BlogFile {
  id: string;
  url: string;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  files: BlogFile[];
  likes: number;
  comments: number;
  owner: {
    id: string;
    fullname: string;
  };
}

export default function BlogCard({ blog }: { blog: Blog }) {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;
  const navigate = useNavigate();

  const handleClick = async () => {
    navigate(`/post/detail?id=${blog.id}`);
  };

  return (
    <Card
      className="w-full shadow-md hover:scale-[1.02] transition-transform cursor-pointer"
      onClick={handleClick}
    >
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <img
            src="https://github.com/shadcn.png"
            className="h-8 w-8 rounded-full bg-secondary object-contain"
            alt="Author avatar"
            height={32}
            width={32}
          />
          <div className="flex flex-col gap-0.5">
            <h6 className="text-sm leading-none font-medium">
              {blog.owner.fullname}
            </h6>
            <span className="text-xs text-muted-foreground">
              @{blog.owner.fullname}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-0">
        <div
          className="relative aspect-video bg-muted border-y"
          style={{
            backgroundImage: `url(${backendUrl}${blog.files[0]?.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pt-3 pb-4 px-6">
          <h2 className="font-semibold text-lg">{blog.title}</h2>
          <div className="mt-1 text-sm text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: blog.description }} />
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-4 py-3">
        {/* Like Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-4 py-2 border rounded-full text-muted-foreground hover:bg-muted"
        >
          <HeartIcon className="h-4 w-4" />
          <span>{blog.likes}</span>
          <span className="hidden sm:inline">Like</span>
        </Button>

        {/* Comment Count (non-clickable) */}
        <div className="flex items-center gap-2 px-4 py-2 border rounded-full text-muted-foreground text-sm">
          <MessageCircleIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{blog.comments} Comments</span>
        </div>

        {/* Share Button */}
        <Button
          variant="ghost"
          className="text-muted-foreground flex items-center gap-2"
        >
          <ShareIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
