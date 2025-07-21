import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Send, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { errorToast, successToast } from "@/components/customToast";
import { removeUser } from "@/store/slices/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IconHeartFilled } from "@tabler/icons-react";

interface Blog {
  id: string;
  title: string;
  description: string;
  files: [
    {
      id: string;
      url: string;
    }
  ];
  likes: number;
  comments: number;
  owner: {
    id: string;
    fullname: string;
  };
  likedByMe: boolean;
}

interface Comment {
  id: string;
  message: string;
  userId: {
    id: string;
    first_name: string;
    last_name: string;
    fullname: string;
  };
  blogId: string;
  parentId: string | null;
  likes: number;
  likedByMe: number;
  replies: Comment[];
}

export default function PostDetail() {
  const [blog, setBlog] = useState<Blog>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [totalComments, setTotalComments] = useState<number>();
  const [newComment, setNewComment] = useState("");
  const [page, setPage] = useState(0);
  const backendImageUrl = import.meta.env.VITE_BACKEND_BASE_IMAGE_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const fetchBlog = async () => {
    const id = new URLSearchParams(window.location.search).get("id");

    const response = await fetch(`${backendUrl}/blog/single?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const result = await response.json();

    if (!response.ok) {
      errorToast(result.error.message);
      const allMessages = [
        "User not found or deleted.",
        "Invalid or expired token.",
        "Please Provide a Token.",
        "Invalid Token",
      ];
      if (allMessages.includes(result.error.message)) {
        dispatch(removeUser());
        localStorage.clear();
        navigate("/login", { replace: true });
      }
      return;
    }

    setBlog(result.data);
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchComments = async () => {
    if (!blog?.id) return;

    const response = await fetch(
      `${backendUrl}/blog/comments?id=${blog.id}&page=${page}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      errorToast(result.error.message);
      const allMessages = [
        "User not found or deleted.",
        "Invalid or expired token.",
        "Please Provide a Token.",
        "Invalid Token",
      ];
      if (allMessages.includes(result.error.message)) {
        dispatch(removeUser());
        localStorage.clear();
        navigate("/login", { replace: true });
      }
      return;
    }

    if (page === 0) {
      setComments(result.data.comments);
    } else {
      setComments((prev) => [...prev, ...result.data.comments]);
    }

    setTotalComments(result.metadata.total);
  };

  useEffect(() => {
    if (blog?.id) {
      fetchComments();
    }
  }, [blog, page]);

  useEffect(() => {
    setComments([]);
    setPage(0);
  }, [blog]);

  const togglePostLike = async () => {
    const key: string = blog?.likedByMe ? "dislike" : "like";

    const response = await fetch(
      `${backendUrl}/blog/react?id=${blog?.id}&key=${key}`,
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const result = await response.json();
    if (!response.ok) {
      errorToast(result.error.message);
      const allMessages = [
        "User not found or deleted.",
        "Invalid or expired token.",
        "Please Provide a Token.",
        "Invalid Token",
      ];
      if (allMessages.includes(result.error.message)) {
        dispatch(removeUser());
        localStorage.clear();
        navigate("/login", { replace: true });
      }
      return;
    }

    key === "dislike"
      ? successToast("Blog Disliked")
      : successToast("Blog Liked");
    fetchBlog();
  };

  const handleScroll = () => {
    const isBottom =
      document.documentElement.scrollTop +
        document.documentElement.clientHeight >=
      document.documentElement.scrollHeight - 10;

    if (isBottom) {
      setPage(page + 1);
    }
  };
  useEffect(() => {
    document.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addComment = async () => {
    const response = await fetch(`${backendUrl}/blog/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        message: newComment,
        blogId: blog?.id,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      errorToast(result.error.message);
      const allMessages = [
        "User not found or deleted.",
        "Invalid or expired token.",
        "Please Provide a Token.",
        "Invalid Token",
      ];
      if (allMessages.includes(result.error.message)) {
        dispatch(removeUser());
        localStorage.clear();
        navigate("/login", { replace: true });
      }
      return;
    }

    successToast("Comment Posted Successfully");
    setNewComment("");
    setPage(0);
    fetchComments();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 px-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={20} className="mr-2" />
          <Link to={"/home"} className="text-sm font-medium">
            Back to posts
          </Link>
        </Button>

        {/* Post Content */}
        <Card className="mb-8 overflow-hidden">
          <div className="aspect-[16/9] overflow-hidden">
            {blog?.files?.[0]?.url && (
              <img
                src={`${backendImageUrl}/${blog.files[0].url}`}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <CardContent className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
              {blog?.title}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <Avatar>
                <AvatarFallback>
                  {blog?.owner?.fullname?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Posted by</p>
                <p className="font-medium text-foreground">
                  {blog?.owner?.fullname}
                </p>
              </div>
            </div>

            <div
              className="prose prose-sm max-w-none text-foreground mb-6"
              dangerouslySetInnerHTML={{ __html: blog?.description ?? "" }}
            />

            <Separator className="mb-4" />

            {/* Post Actions */}
            <div className="flex items-center gap-6">
              <Button
                variant={blog?.likedByMe ? "ghost" : "ghost"}
                onClick={togglePostLike}
                className={`gap-2 hover:bg-transparent ${
                  blog?.likedByMe
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {blog?.likedByMe ? (
                  <IconHeartFilled size={18} className="fill-red-500" />
                ) : (
                  <Heart size={18} />
                )}
                <span className="font-medium">{blog?.likes ?? 0} likes</span>
              </Button>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle size={18} />
                <span className="text-sm font-medium">
                  {totalComments} comments
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-foreground">Comments</h2>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            <div className="mb-8">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-sm">Y</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="min-h-[80px] resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <Button onClick={addComment} disabled={!newComment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Comments List */}
            <div className="space-y-1">
              {comments.map((comment, index) => (
                <CommentComponent
                  key={comment.id}
                  currComment={comment}
                  depth={0}
                  path={[index]}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const CommentComponent: React.FC<{
  currComment: Comment;
  depth?: number;
  path?: number[];
}> = ({ currComment, depth = 0, path = [] }) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const [comment, setComment] = useState<Comment>(currComment);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleCommentLike = async () => {
    // Like logic here
    const key = comment.likedByMe ? "dislike" : "like";

    const response = await fetch(
      `${backendUrl}/comment/react?commentId=${comment.id}&blogId=${comment.blogId}&key=${key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      errorToast(result.error.message);
      const allMessages = [
        "User not found or deleted.",
        "Invalid or expired token.",
        "Please Provide a Token.",
        "Invalid Token",
      ];
      if (allMessages.includes(result.error.message)) {
        dispatch(removeUser());
        localStorage.clear();
        navigate("/login", { replace: true });
      }
      return;
    }

    key === "dislike"
      ? successToast("Comment Disliked Successfully")
      : successToast("Comment Liked Successfully");

    setComment((prev) => ({
      ...prev,
      likedByMe: key === "dislike" ? 0 : 1,
      likes: key === "dislike" ? prev.likes - 1 : prev.likes + 1,
    }));
  };

  const addReply = async () => {
    // Reply logic here

    const response = await fetch(`${backendUrl}/blog/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        message: replyText,
        parentId: comment.id,
        blogId: comment.blogId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      errorToast(result.error.message);
      const allMessages = [
        "User not found or deleted.",
        "Invalid or expired token.",
        "Please Provide a Token.",
        "Invalid Token",
      ];
      if (allMessages.includes(result.error.message)) {
        dispatch(removeUser());
        localStorage.clear();
        navigate("/login", { replace: true });
      }
      return;
    }

    successToast("Replied Successfully");
    setReplyText("");

    const id = result.data._id;

    const currComment: Comment = {
      blogId: comment.blogId,
      id,
      message: replyText,
      likedByMe: 0,
      parentId: comment.id,
      likes: 0,
      replies: [],
      userId: comment.userId,
    };

    setComment((prev) => ({
      ...prev,
      replies: [currComment, ...prev.replies],
    }));

    setReplyingTo(null);
  };

  const isReplying = replyingTo === comment.id;

  return (
    <div
      className={`${depth > 0 ? "ml-6 pl-4 border-l-2 border-reply-line" : ""}`}
    >
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-sm">
                {comment.userId.fullname[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-foreground">
                  {comment.userId.fullname}
                </span>
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-3">
                {comment.message}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCommentLike()}
                  className="h-7 px-2 gap-1 text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  {comment?.likedByMe === 1 ? (
                    <IconHeartFilled size={18} className="fill-red-500" />
                  ) : (
                    <Heart size={18} />
                  )}
                  <span className="text-xs">{comment.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                  className="h-7 px-2 gap-1 text-muted-foreground hover:text-foreground hover:bg-transparent"
                >
                  <MessageCircle size={14} />
                  <span className="text-xs">Reply</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isReplying && (
        <div className="ml-6 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex gap-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 min-h-[80px] resize-none"
                  rows={3}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={addReply}
                    disabled={!replyText.trim()}
                    className="px-3"
                  >
                    <Send size={12} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                    className="px-3"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Render replies recursively */}
      {comment.replies.map((reply, idx) => (
        <CommentComponent
          key={reply.id}
          currComment={reply}
          depth={depth + 1}
          path={[...path, idx]}
        />
      ))}
    </div>
  );
};
