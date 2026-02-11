"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthBrand } from "@/components/layout/auth-brand";
import { registerSchema, type RegisterFormValues } from "@/lib/schemas/auth";
import { useRegister } from "@/services/queries/auth";
import { ROUTES } from "@/config/routes";
import type { AxiosError } from "axios";
import {
  getValidationErrorField,
  getValidationErrorMessage,
  type ApiError,
} from "@/types/api";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  function onSubmit(data: RegisterFormValues) {
    const payload = {
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      phone: data.numberPhone?.trim() ? data.numberPhone : undefined,
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        router.replace(ROUTES.FEED);
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiError>;
        const serverData = axiosError.response?.data;

        if (Array.isArray(serverData?.data)) {
          serverData.data.forEach((validationError) => {
            const field = getValidationErrorField(validationError);
            const message = getValidationErrorMessage(validationError);
            const formField = field === "phone" ? "numberPhone" : field;
            if (formField && message && formField in data) {
              setError(formField as keyof RegisterFormValues, { message });
            }
          });
        }

        const message = serverData?.message || "Registration failed";
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
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="space-y-0.5">
          <label htmlFor="name" className="text-sm font-bold tracking-[-0.28px] text-neutral-25">
            Name
          </label>
          <Input
            id="name"
            placeholder="Enter your name"
            autoComplete="name"
            className={inputClassName}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Username */}
        <div className="space-y-0.5">
          <label htmlFor="username" className="text-sm font-bold tracking-[-0.28px] text-neutral-25">
            Username
          </label>
          <Input
            id="username"
            placeholder="Enter your username"
            autoComplete="username"
            className={inputClassName}
            {...register("username")}
          />
          {errors.username && (
            <p className="text-xs text-destructive">
              {errors.username.message}
            </p>
          )}
        </div>

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
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Number Phone */}
        <div className="space-y-0.5">
          <label htmlFor="numberPhone" className="text-sm font-bold tracking-[-0.28px] text-neutral-25">
            Number Phone
          </label>
          <Input
            id="numberPhone"
            placeholder="Enter your phone number"
            autoComplete="tel"
            className={inputClassName}
            {...register("numberPhone")}
          />
          {errors.numberPhone && (
            <p className="text-xs text-destructive">
              {errors.numberPhone.message}
            </p>
          )}
        </div>

        {/* Password with eye toggle */}
        <div className="space-y-0.5">
          <label htmlFor="password" className="text-sm font-bold tracking-[-0.28px] text-neutral-25">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="new-password"
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

        {/* Confirm Password with eye toggle */}
        <div className="space-y-0.5">
          <label htmlFor="confirmPassword" className="text-sm font-bold tracking-[-0.28px] text-neutral-25">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={`${inputClassName} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
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
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-primary-300 text-base font-bold tracking-[-0.32px] text-neutral-25 hover:bg-primary-300/90"
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Submitting..." : "Submit"}
          </Button>

          <p className="text-center text-base font-semibold tracking-[-0.32px] text-neutral-25">
            Already have an account?{" "}
            <Link href={ROUTES.LOGIN} className="font-bold text-primary-200">
              Log in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
