import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { PulseLoader } from "react-spinners";
import { IconHeart } from "@tabler/icons-react";

interface BlogFile {
  id: string;
  url: string;
}

interface Owner {
  id: string;
  fullname: string;
}

interface Comment {
  id: string;
  message: string;
  userId: {
    fullname: string;
    first_name: string;
    last_name: string;
    id: string;
  };
  blogId: string;
  parentId: string | null;
  replies: Comment[];
  likes: number;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  files: BlogFile[];
  likes: number;
  comments: number;
  owner: Owner;
}

export default function PostDetail() {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");

    async function fetchBlog() {
      try {
        const res = await fetch(`${backendUrl}/api/blog/single?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const json = await res.json();
        setBlog(json.data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchComments() {
      try {
        const res = await fetch(`${backendUrl}/api/blog/comments?id=${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const json = await res.json();
        setComments(json.data?.comments || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    }

    fetchBlog();
    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PulseLoader size={8} />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <div className="max-w-6xl px-4 py-6 mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border rounded-xl shadow-md">
        {/* Left Side: Image & Author */}
        <div className="flex flex-col items-start">
          <div className="flex items-start gap-3 mb-3">
            <img
              src="https://github.com/shadcn.png"
              className="h-10 w-10 rounded-full border object-cover"
              alt="Author"
            />
            <div>
              <h6 className="text-sm font-semibold">{blog.owner.fullname}</h6>
              <span className="text-xs text-muted-foreground">
                @{blog.owner.fullname.toLowerCase().replace(/\s+/g, "")}
              </span>
            </div>
          </div>

          <div
            className="aspect-square w-full rounded-lg border bg-muted mb-4"
            style={{
              backgroundImage: `url(${backendUrl}${blog.files[0]?.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>

        {/* Right Side: Description & Comments */}
        <div className="flex flex-col">
          <div>
            <h1 className="text-xl font-bold mb-2">{blog.title}</h1>
            <div className="text-muted-foreground text-sm mb-4 leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: blog.description }} />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mb-4">
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-4 py-2 border rounded-full text-muted-foreground hover:bg-muted"
              >
                <HeartIcon className="h-4 w-4" />
                <span>{blog.likes}</span>
                <span className="hidden sm:inline">Like</span>
              </Button>
              <div className="flex items-center gap-2 px-4 py-2 border rounded-full text-muted-foreground text-sm">
                <MessageCircleIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {blog.comments} Comments
                </span>
              </div>
            </div>

            <Separator className="mb-4" />
          </div>

          {/* Comments Section */}
          <CommentsSection comments={comments} />
        </div>
      </div>
    </div>
  );
}
function CommentsSection({ comments }: { comments: Comment[] }) {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshComments = async () => {
    const id = new URLSearchParams(window.location.search).get("id");
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;

    try {
      const res = await fetch(`${backendUrl}/api/blog/comments?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const json = await res.json();
      setAllComments(json.data?.comments || []);
    } catch (err) {
      console.error("Failed to refresh comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshComments();
  }, []);

  return (
    <div className="space-y-6 mt-4">
      <h2 className="text-lg font-semibold mb-3">Comments</h2>
      <CommentForm onCommentPosted={refreshComments} parentId={null} />
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading comments...</p>
      ) : allComments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      ) : (
        allComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            level={0}
            onReplyPosted={refreshComments}
          />
        ))
      )}
    </div>
  );
}

function CommentForm({
  onCommentPosted,
  parentId,
}: {
  onCommentPosted: () => void;
  parentId: string | null;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;
  const blogId = new URLSearchParams(window.location.search).get("id");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${backendUrl}/api/blog/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          blogId,
          message,
          parentId,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      setMessage("");
      onCommentPosted();
    } catch (err) {
      setError("Failed to post comment.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        className="w-full p-3 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={2}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md"
      >
        {loading ? "Posting..." : parentId ? "Reply" : "Post Comment"}
      </button>
    </form>
  );
}

function CommentItem({
  comment,
  level,
  onReplyPosted,
}: {
  comment: Comment;
  level: number;
  onReplyPosted: () => void;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);

  return (
    <div
      className={`ml-${Math.min(
        level * 4,
        12
      )} p-3 bg-white rounded-lg border shadow-sm`}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-gray-800">
            By: {comment.userId.fullname}
          </div>
          <div className="text-sm text-gray-600 mt-1">{comment.message}</div>
          <button
            className="text-xs text-blue-500 mt-1 hover:underline"
            onClick={() => setShowReplyInput((prev) => !prev)}
          >
            {showReplyInput ? "Cancel" : "Reply"}
          </button>
        </div>
        <div className="flex items-center gap-1 text-red-500">
          <IconHeart size={18} />
          <span className="text-sm text-gray-800">{comment.likes}</span>
        </div>
      </div>

      {showReplyInput && (
        <div className="mt-2">
          <CommentForm
            parentId={comment.id}
            onCommentPosted={() => {
              setShowReplyInput(false);
              onReplyPosted();
            }}
          />
        </div>
      )}

      {/* Render nested replies */}
      <div className="mt-2 space-y-2">
        {comment.replies?.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            level={level + 1}
            onReplyPosted={onReplyPosted}
          />
        ))}
      </div>
    </div>
  );
}
