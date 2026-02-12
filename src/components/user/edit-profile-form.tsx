"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/lib/schemas/profile";
import { cn } from "@/lib/utils";
import { useUpdateMe } from "@/services/queries/profile";
import {
  getValidationErrorField,
  getValidationErrorMessage,
  type ApiError,
} from "@/types/api";
import type { Profile, UpdateProfileRequest } from "@/types/user";

interface EditProfileFormProps {
  profile: Profile;
  onSuccess?: (profile: Profile) => void;
}

export function EditProfileForm({ profile, onSuccess }: EditProfileFormProps) {
  const updateMe = useUpdateMe();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      email: profile.email ?? "",
      numberPhone: profile.phone ?? "",
      bio: profile.bio ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: profile.name,
      username: profile.username,
      email: profile.email ?? "",
      numberPhone: profile.phone ?? "",
      bio: profile.bio ?? "",
    });
  }, [profile, reset]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const avatarSrc = useMemo(
    () => avatarPreview ?? profile.avatarUrl,
    [avatarPreview, profile.avatarUrl],
  );

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(URL.createObjectURL(file));
  }

  function onSubmit(data: UpdateProfileFormValues) {
    const payload: UpdateProfileRequest = {
      name: data.name.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      numberPhone: data.numberPhone?.trim() || undefined,
      bio: data.bio?.trim() || undefined,
      avatar: avatarFile ?? undefined,
    };

    updateMe.mutate(payload, {
      onSuccess: (updatedProfile) => {
        toast.success("Profile Success Update");
        onSuccess?.(updatedProfile);
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ApiError>;
        const serverData = axiosError.response?.data;

        if (Array.isArray(serverData?.data)) {
          serverData.data.forEach((validationError) => {
            const field = getValidationErrorField(validationError);
            const message = getValidationErrorMessage(validationError);
            const mappedField = field === "phone" ? "numberPhone" : field;

            if (
              mappedField &&
              message &&
              mappedField in (data as Record<string, unknown>)
            ) {
              setError(mappedField as keyof UpdateProfileFormValues, { message });
            }
          });
        }

        toast.error(serverData?.message || "Failed to update profile");
      },
    });
  }

  const inputClassName =
    "h-12 rounded-xl border-neutral-900 bg-neutral-950 px-4 text-base font-semibold tracking-[-0.32px] text-neutral-25 placeholder:text-neutral-600 md:text-base";
  const labelClassName =
    "text-sm font-bold tracking-[-0.28px] text-neutral-25";
  const helperClassName = "text-xs leading-6 text-destructive";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12"
    >
      <div className="flex flex-col items-center gap-4 md:w-40">
        <Avatar className="size-20 md:size-[130px]">
          <AvatarImage src={avatarSrc} alt={profile.name} className="object-cover" />
          <AvatarFallback className="bg-neutral-800 text-xl font-bold text-neutral-25">
            {profile.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <Button
          type="button"
          variant="outline"
          className="h-12 w-[130px] rounded-full border-neutral-900 bg-transparent text-base font-bold tracking-[-0.32px] text-neutral-25 hover:bg-neutral-900 md:w-[160px]"
          onClick={() => fileInputRef.current?.click()}
        >
          Change Photo
        </Button>
      </div>

      <div className="flex w-full flex-col gap-6 md:w-[592px]">
        <div className="space-y-0.5">
          <label htmlFor="name" className={labelClassName}>
            Name
          </label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className={cn(inputClassName, errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name ? (
            <p className={helperClassName}>{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-0.5">
          <label htmlFor="username" className={labelClassName}>
            Username
          </label>
          <Input
            id="username"
            autoComplete="username"
            aria-invalid={!!errors.username}
            className={cn(inputClassName, errors.username && "border-destructive")}
            {...register("username")}
          />
          {errors.username ? (
            <p className={helperClassName}>{errors.username.message}</p>
          ) : null}
        </div>

        <div className="space-y-0.5">
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={cn(inputClassName, errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email ? (
            <p className={helperClassName}>{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-0.5">
          <label htmlFor="numberPhone" className={labelClassName}>
            Number Phone
          </label>
          <Input
            id="numberPhone"
            autoComplete="tel"
            aria-invalid={!!errors.numberPhone}
            className={cn(inputClassName, errors.numberPhone && "border-destructive")}
            {...register("numberPhone")}
          />
          {errors.numberPhone ? (
            <p className={helperClassName}>
              {errors.numberPhone.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-0.5">
          <label htmlFor="bio" className={labelClassName}>
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            aria-invalid={!!errors.bio}
            placeholder="Create your bio"
            className={cn(
              "min-h-[101px] w-full resize-none rounded-xl border border-neutral-900 bg-neutral-950 px-4 py-2 text-base tracking-[-0.32px] text-neutral-25 placeholder:text-neutral-600 outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              errors.bio && "border-destructive",
            )}
            {...register("bio")}
          />
          {errors.bio ? (
            <p className={helperClassName}>{errors.bio.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-full bg-primary-300 text-base font-bold tracking-[-0.32px] text-neutral-25 hover:bg-primary-300/90"
          disabled={updateMe.isPending}
        >
          {updateMe.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
