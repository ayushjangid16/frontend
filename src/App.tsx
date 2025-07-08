import { Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import { useEffect } from "react";
import SignupPage from "./pages/Auth/SignupPage";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/dashboard/page";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      navigate("/admin/dashboard");
    }
  }, []);

  return (
    <div className=" w-full h-full">
      <ToastContainer position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
