import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { errorToast, successToast } from "@/components/customToast";
import type { SuccessLogin } from "@/utils/ApiResponse";
import axios from "axios";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

interface FormData {
  email: string;
  password: string;
}

function LoginPage() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();

  const formSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setIsLoading(true);
      const { data }: { data: SuccessLogin } = await axios.post(
        `${backendUrl}/auth/login`,
        formData
      );

      successToast("Logged In Successfully!");

      let token = data.metadata.token;

      localStorage.setItem("token", token);

      setIsLoading(false);
      reset();
      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setIsLoading(false);
      console.error("Registration error:", error);
      if (axios.isAxiosError(error)) {
        const allErrors = error.response?.data?.error?.details;
        if (allErrors) {
          for (let key in allErrors) {
            errorToast(allErrors[key]);
          }
        } else {
          errorToast(error.response?.data?.message || "Something went wrong.");
        }
      } else {
        errorToast("Unexpected error occurred.");
      }
    }
  };
  return (
    <div className="">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6")}>
            <Card>
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(formSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="text"
                        {...register("email")}
                        placeholder="m@example.com"
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input
                        id="password"
                        {...register("password")}
                        type="password"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full">
                        {isLoading == false ? (
                          "Login"
                        ) : (
                          <PulseLoader size={8} />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="underline underline-offset-4">
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
