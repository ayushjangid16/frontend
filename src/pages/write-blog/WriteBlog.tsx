import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/Navbar";

import { useForm, type SubmitHandler } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PulseLoader } from "react-spinners";
import { errorToast, successToast } from "@/components/customToast";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { removeUser } from "@/store/slices/userSlice";
import { hasPermission } from "@/utils/permissions";

import RichTextEditor from "reactjs-tiptap-editor";

import { BaseKit } from "reactjs-tiptap-editor";
import { Bold } from "reactjs-tiptap-editor/lib/Bold.js";
import { BulletList } from "reactjs-tiptap-editor/lib/BulletList.js";
import { Color } from "reactjs-tiptap-editor/lib/Color.js";
import { FontFamily } from "reactjs-tiptap-editor/lib/FontFamily.js";
import { FontSize } from "reactjs-tiptap-editor/lib/FontSize.js";
import { Heading } from "reactjs-tiptap-editor/lib/Heading.js";
import { Highlight } from "reactjs-tiptap-editor/lib/Highlight.js";
import { History } from "reactjs-tiptap-editor/lib/History.js";
import { Italic } from "reactjs-tiptap-editor/lib/Italic.js";

import "reactjs-tiptap-editor/style.css";

const extensions = [
  BaseKit,
  Heading,
  Italic,
  Bold,
  BulletList,
  Color,
  Highlight,
  FontFamily,
  FontSize,
  History,
];

interface BlogForm {
  title: string;
  description: string;
  blog: FileList;
}

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

function WriteBlog() {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  // @ts-ignore
  const userData = useSelector((state) => state.userReducer.userData);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, reset, setValue } = useForm<BlogForm>();

  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string>("");

  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const valid = hasPermission("create_blog", userData.userInfo.permissions);

    if (!valid) {
      navigate("/home", { replace: true });
    }
  }, [userData]);

  const onSubmit: SubmitHandler<BlogForm> = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);

      Array.from(data.blog).forEach((file) => {
        formData.append("blog", file);
      });

      const response = await fetch(`${backendUrl}/blog/create`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("Error", result);
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

      successToast("Blog uploaded successfully!");
      reset();
    } catch (error) {
      console.error(error);
      errorToast("Failed to upload blog. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserBlog = async () => {
    const response = await fetch(
      `${backendUrl}/blog/user/all?limit=5&page=${page}&search=${search}`,
      {
        method: "GET",
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

    setBlogs((prev) => [...prev, ...result.data.blogs]);
  };

  useEffect(() => {
    fetchUserBlog();
  }, [page, search]);

  const onChangeContent = (value: string) => {
    setContent(value);

    setValue("description", content);
  };

  const scrollDivRef = useRef(null);

  const handleScroll = () => {
    const div = scrollDivRef.current;
    if (!div) return;

    const isBottom = div.scrollTop + div.clientHeight >= div.scrollHeight - 10;

    if (isBottom) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    const div = scrollDivRef.current;
    if (!div) return;

    div.addEventListener("scroll", handleScroll);

    return () => {
      div.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />
      <main className="pt-28 px-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Blog</CardTitle>
              <CardDescription>
                Fill in the details below to publish your post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
              >
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter a catchy title"
                    {...register("title", { required: true })}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <RichTextEditor
                    output="html"
                    content={content}
                    hideToolbar={false}
                    onChangeContent={onChangeContent}
                    {...register("description")}
                    extensions={extensions}
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="files">Upload Files</Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    {...register("blog", { required: true })}
                  />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <PulseLoader size={8} /> : "Publish Blog"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div
          ref={scrollDivRef}
          className="col-span-1 bg-white shadow-md rounded-lg p-6 overflow-y-auto"
          style={{ maxHeight: "45%" }}
        >
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Your Blogs</h2>

            <div className="my-3">
              <Label className="my-2">Search</Label>
              <Input
                type="text"
                placeholder="Enter title to search"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {blogs.map((ele, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg shadow-lg mb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src="https://github.com/shadcn.png"
                  alt="Blog Thumbnail"
                  className="w-16 h-16 rounded object-cover"
                />
                <div>
                  <h2 className="font-medium text-lg text-gray-700">
                    {ele.title || "My Blog Title"}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ele.description ||
                      "This is a brief description of the blog post."}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="default">Edit</Button>
                <Button variant="destructive">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default WriteBlog;
