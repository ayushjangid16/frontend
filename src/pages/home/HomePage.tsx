import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BlogCard from "@/components/BlogCard";
import { errorToast } from "@/components/customToast";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { removeUser } from "@/store/slices/userSlice";
import Navbar from "@/components/Navbar";

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

function HomePage() {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // @ts-ignore
  const userData = useSelector((state) => state.userReducer.userData);

  const fetchAllBlogs = async () => {
    setIsLoading(true);
    const response = await fetch(`${backendUrl}/blog/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const result = await response.json();

    setIsLoading(false);
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

    const blogData: Blog[] = result.data.blogs;

    setBlogs(blogData);
  };

  useEffect(() => {
    fetchAllBlogs();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Navbar />

      <main className="pt-28 px-6 pb-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading === false ? (
          blogs.map((ele) => <BlogCard key={ele.id} blog={ele} />)
        ) : (
          <div className="col-span-full flex justify-center items-center h-40">
            <PulseLoader size={8} />
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;
