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

interface BlogFile {
  id: string;
  url: string;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  files: BlogFile[];
}

export default function BlogCard({ blog }: { blog: Blog }) {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;
  return (
    <Card className="w-full shadow-md hover:scale-105 transition-transform cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <img
            src="https://github.com/shadcn.png"
            className="h-8 w-8 rounded-full bg-secondary object-contain"
            alt=""
            height={32}
            width={32}
          />
          <div className="flex flex-col gap-0.5">
            <h6 className="text-sm leading-none font-medium">shadcn</h6>
            <span className="text-xs">@shadcn</span>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontalIcon />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className="relative aspect-video bg-muted border-y"
          style={{
            backgroundImage: `url(${backendUrl}${blog.files[0].url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pt-3 pb-4 px-6">
          <h2 className="font-semibold">{blog.title}</h2>
          <div className="mt-1 text-sm text-muted-foreground">
            <div dangerouslySetInnerHTML={{ __html: `${blog.description}` }} />
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex py-2 px-2 w-full flex-wrap">
        <Button variant="ghost" className="text-muted-foreground">
          <HeartIcon /> <span className="hidden sm:inline">Like</span>
        </Button>
        <Button variant="ghost" className="text-muted-foreground">
          <MessageCircleIcon />
          <span className="hidden sm:inline">Comment</span>
        </Button>
        <Button variant="ghost" className="text-muted-foreground">
          <ShareIcon /> <span className="hidden sm:inline">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
