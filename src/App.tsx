import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import { useEffect } from "react";
import SignupPage from "./pages/Auth/SignupPage";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/admin/Dashboard";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import VerifyResetPassword from "./pages/Auth/VerifyResetPassword";
import { useSelector } from "react-redux";
import HomePage from "./pages/home/HomePage";
import AllRequests from "./pages/admin/AllRequests";
import Admin from "./pages/admin/Admin";
import WriteBlog from "./pages/write-blog/WriteBlog";

const allPaths = ["/login", "/verify-reset-password", "/forget-password"];

function App() {
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.userReducer.userData);
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const fullPath = `${pathname}${search}${hash}`;

    if (!userData.isLoggedIn) {
      const shouldStayOnCurrentPath = allPaths.some((path) =>
        fullPath.includes(path)
      );

      if (shouldStayOnCurrentPath) {
        navigate(fullPath, { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } else {
      if (userData.userRole === "admin") {
        if (pathname === "/admin") {
          navigate("/admin/dashboard", { replace: true });
        }
      } else {
        if (pathname === "/") {
          navigate("/home", { replace: true });
        }
      }
    }
  }, []);

  return (
    <div className=" w-full h-full">
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route
          path="/verify-reset-password/*"
          element={<VerifyResetPassword />}
        />
        <Route path="/signup" element={<SignupPage />} />

        {/* group all admin routes */}
        <Route>
          <Route path="/admin" element={<Admin />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="requests" element={<AllRequests />} />
          </Route>
        </Route>

        <Route path="/home" element={<HomePage />} />
        <Route path="/post" element={<WriteBlog />} />
      </Routes>
    </div>
  );
}

export default App;
