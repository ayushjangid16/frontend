import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import { useEffect } from "react";
import SignupPage from "./pages/Auth/SignupPage";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/dashboard/page";
import ForgetPassword from "./pages/Auth/ForgetPassword";
import VerifyResetPassword from "./pages/Auth/VerifyResetPassword";
import { useSelector } from "react-redux";

const allPaths = ["/login", "/verify-reset-password", "/forget-password"];

function App() {
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state.userData);
  useEffect(() => {
    if (!userData.isLoggedIn) {
      const { pathname, search, hash } = window.location;

      let url = window.location.href;

      let flag = false;
      for (let i = 0; i < allPaths.length; i++) {
        let str = allPaths[i];

        if (url.includes(str)) {
          flag = true;
          break;
        }
      }

      if (flag) {
        navigate(`${pathname}${search}${hash}`, { replace: true });
      } else {
        navigate("/login");
      }
    } else {
      if (userData.userRole == "admin") {
        navigate("/admin/dashboard");
      } else {
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
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
