import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { PulseLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm, type SubmitHandler } from "react-hook-form";
import axios from "axios";
import { errorToast, infoToast } from "@/components/customToast";

import type { SuccessRegister } from "@/utils/ApiResponse";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

function SignupPage() {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setIsLoading(true);
      const { data }: { data: SuccessRegister } = await axios.post(
        `${backendUrl}/auth/register`,
        formData
      );

      infoToast("Please Verify Yourself. Mail is Sent to you!");

      let token = data.metadata.token;

      localStorage.setItem("token", token);

      setIsLoading(false);
      navigate("/login", { replace: true });
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
    <div>
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6")}>
            <Card>
              <CardHeader>
                <CardTitle>Register Yourself</CardTitle>
                <CardDescription>
                  Enter your details below to register.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(formSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        type="text"
                        {...register("first_name")}
                        placeholder="John"
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        type="text"
                        {...register("last_name")}
                        placeholder="Doe"
                        autoComplete="family-name"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="text"
                        {...register("email")}
                        placeholder="m@example.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading == false ? (
                        "Register"
                      ) : (
                        <PulseLoader size={8} />
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    <p>&copy; 2025</p>
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

export default SignupPage;
