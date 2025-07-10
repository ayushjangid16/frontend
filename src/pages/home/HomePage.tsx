import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
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
import { IconLogout, IconUser, IconWriting } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BlogCard from "@/components/BlogCard";

interface NavbarLinks {
  url: string;
  label: string;
}

function HomePage() {
  const [navLinks, setNavLinks] = useState<NavbarLinks[] | null>(null);

  // @ts-ignore
  const userData = useSelector((state) => state.userData);

  useEffect(() => {
    if (!userData.isLoggedIn) {
    } else {
      // login
      let arr: NavbarLinks[] = [];
      if (userData.userRole == "user") {
        arr.push({ url: "/home", label: "Home" });
        arr.push({ url: "/about", label: "About Us" });
      } else if (userData.userRole == "writter") {
        arr.push({ url: "/home", label: "Home" });
        arr.push({ url: "/blog", label: "Blogs" });
        arr.push({ url: "/about", label: "About Us" });
      }

      setNavLinks(arr);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="w-full fixed top-0 left-0 z-50 flex justify-center items-center py-4">
        <div className=" bg-white shadow-lg rounded-3xl flex justify-between items-center px-12 py-4">
          {/* Centered Navigation */}
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              {navLinks?.map((ele: NavbarLinks, index: number) => {
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuLink
                      href={ele.url}
                      className="text-gray-800 font-medium transition-colors"
                    >
                      {ele.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
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
              {userData.userRole == "user" ? (
                <DropdownMenuItem>
                  <IconWriting />
                  Be a Writter
                </DropdownMenuItem>
              ) : (
                ""
              )}
              <DropdownMenuItem>
                {" "}
                <IconLogout />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <main className="pt-28 px-6 pb-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((ele) => (
          <BlogCard key={ele} />
        ))}
      </main>
    </div>
  );
}

export default HomePage;
