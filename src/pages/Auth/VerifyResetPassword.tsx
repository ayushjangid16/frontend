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
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { errorToast, successToast } from "@/components/customToast";
import { useState } from "react";
import { PulseLoader } from "react-spinners";

interface FormData {
  password: string;
  confirmPassword: string;
}

function VerifyResetPassword() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();

  const formSubmit: SubmitHandler<FormData> = async (formData, e) => {
    e?.preventDefault();
    const { search } = window.location;

    setIsLoading(true);
    let token = new URLSearchParams(search).get("token");

    const response = await fetch(
      `${backendUrl}/auth/verify-reset-password?token=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    let result = await response.json();
    setIsLoading(false);
    if (!response.ok) {
      // some error occured
      console.log(result);

      if (result.error.message == "Invalid or expired token.") {
        navigate("/login", { replace: true });
        return;
      } else {
        errorToast(result.error.message);
        return;
      }
    }

    reset();
    successToast(result.message);

    navigate("/login", { replace: true });
  };
  return (
    <div className="">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6")}>
            <Card>
              <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>
                  Enter password and Confirm password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(formSubmit)}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        placeholder="...."
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="...."
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full">
                        {isLoading == false ? (
                          "Reset"
                        ) : (
                          <PulseLoader size={8} />
                        )}
                      </Button>
                    </div>
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

export default VerifyResetPassword;
