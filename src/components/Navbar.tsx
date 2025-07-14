import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconDashboard,
  IconLogout,
  IconUser,
  IconWriting,
} from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { errorToast, successToast } from "@/components/customToast";
import { removeUser } from "@/store/slices/userSlice";
import { useEffect, useState } from "react";
import { hasPermission } from "@/utils/permissions";

interface NavbarLinks {
  url: string;
  label: string;
}

const getNavLinks = (userRole: string): NavbarLinks[] => {
  switch (userRole) {
    case "user":
      return [
        { url: "/home", label: "Home" },
        { url: "/about", label: "About Us" },
      ];
    case "writter":
    case "admin":
      return [
        { url: "/home", label: "Home" },
        { url: "/write", label: "Write" },
        { url: "/about", label: "About Us" },
      ];
    default:
      return [];
  }
};

const Navbar = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  // @ts-ignore
  const userData = useSelector((state) => state.userReducer.userData);
  const [navLinks, setNavLinks] = useState<NavbarLinks[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData.isLoggedIn) {
      navigate("/login", { replace: true });
      return;
    }

    const links: NavbarLinks[] = getNavLinks(userData.userRole);
    setNavLinks(links);
  }, []);

  const handleRequest = async () => {
    setIsLoading(true);
    const response = await fetch(`${backendUrl}/request/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ userId: userData.userInfo.userInfo._id }),
    });

    const result = await response.json();
    setIsLoading(false);

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

    successToast("Request is Sent");
  };

  const handleLogout = async () => {
    setIsLoading(true);
    const response = await fetch(`${backendUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const result = await response.json();
    setIsLoading(false);

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

    successToast("Logout Successfully");
    dispatch(removeUser());
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 flex justify-center items-center py-4">
      <div className="bg-white shadow-lg rounded-3xl flex justify-between items-center px-12 py-4">
        <NavigationMenu>
          <NavigationMenuList className="gap-6">
            {navLinks?.map((ele, index) => (
              <Link
                to={ele.url}
                key={index}
                className="text-gray-800 font-medium transition-colors"
              >
                {ele.label}
              </Link>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="absolute right-0 mr-4 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://github.com/shadcn.png" sizes="20" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconUser />
              Profile
            </DropdownMenuItem>
            {hasPermission(
              "request_writer_role",
              userData?.userInfo?.permissions
            ) && (
              <DropdownMenuItem onClick={handleRequest}>
                <IconWriting />
                {isLoading ? <PulseLoader size={8} /> : "Be a Writter"}
              </DropdownMenuItem>
            )}
            {hasPermission(
              "access_dashboard",
              userData?.userInfo?.permissions
            ) && (
              <DropdownMenuItem>
                <IconDashboard />
                <Link to="/admin/dashboard">Dashboard</Link>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
