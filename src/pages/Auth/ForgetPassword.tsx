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
  email: string;
}

function ForgetPassword() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  const navigate = useNavigate();

  const formSubmit: SubmitHandler<FormData> = async (formData, e) => {
    e?.preventDefault();

    setIsLoading(true);
    const response = await fetch(`${backendUrl}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

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
  };
  return (
    <div className="">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={cn("flex flex-col gap-6")}>
            <Card>
              <CardHeader>
                <CardTitle>Forget Password?</CardTitle>
                <CardDescription>
                  Enter your email below to get a reset link.
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
                    <div className="flex flex-col gap-3">
                      <Button type="submit" className="w-full">
                        {isLoading == false ? (
                          "Confirm"
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

export default ForgetPassword;
