"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthBrand } from "@/components/layout/auth-brand";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";
import { useLogin } from "@/services/queries/auth";
import { ROUTES } from "@/config/routes";
import type { AxiosError } from "axios";
import {
  getValidationErrorField,
  getValidationErrorMessage,
  type ApiError,
} from "@/types/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawReturnTo = searchParams.get("returnTo");
  const returnTo =
    rawReturnTo &&
    rawReturnTo.startsWith("/") &&
    !rawReturnTo.startsWith("//")
      ? rawReturnTo
      : ROUTES.FEED;
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormValues) {
    login.mutate(data, {
      onSuccess: () => {
        router.replace(returnTo);
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiError>;
        const serverData = axiosError.response?.data;

        if (Array.isArray(serverData?.data)) {
          serverData.data.forEach((validationError) => {
            const field = getValidationErrorField(validationError);
            const message = getValidationErrorMessage(validationError);
            if (field && message && field in data) {
              setError(field as keyof LoginFormValues, { message });
            }
          });
        }

        const message = serverData?.message || "Login failed";
        toast.error(message);
      },
    });
  }

  const inputClassName =
    "h-12 rounded-xl border-neutral-900 bg-neutral-950 px-4 text-base tracking-[-0.32px] placeholder:text-neutral-600 md:text-base dark:border-neutral-900 dark:bg-neutral-950";

  return (
    <div className="space-y-6">
      <AuthBrand />

      <h2 className="text-center text-display-xs font-bold text-neutral-25">
        Welcome Back!
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-0.5">
          <label htmlFor="email" className="text-sm font-bold tracking-[-0.28px] text-neutral-25">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            className={inputClassName}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password field with eye toggle */}
        <div className="space-y-0.5">
          <label htmlFor="password" className="text-sm font-bold tracking-[-0.28px] text-neutral-25">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              className={`${inputClassName} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-5" />
              ) : (
                <Image
                  src="/assets/auth/eye.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="size-5"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary-300 text-base font-bold tracking-[-0.32px] text-neutral-25 hover:bg-primary-300/90"
            disabled={login.isPending}
          >
            {login.isPending ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-base font-semibold tracking-[-0.32px] text-neutral-25">
            Don&apos;t have an account?{" "}
            <Link href={ROUTES.REGISTER} className="font-bold text-primary-200">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
