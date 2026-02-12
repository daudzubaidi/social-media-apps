"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { EditProfileForm } from "@/components/user/edit-profile-form";
import { ROUTES } from "@/config/routes";
import { useMe } from "@/services/queries/profile";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: profile, isPending, isError, error, refetch } = useMe();

  if (isPending) {
    return <LoadingState className="min-h-[60vh]" />;
  }

  if (isError || !profile) {
    const message = error instanceof Error ? error.message : "Failed to load profile";

    return (
      <section className="mx-auto w-full max-w-[361px] pb-6 pt-4 md:max-w-[800px] md:pb-10 md:pt-10">
        <ErrorState
          message={message}
          onRetry={() => {
            void refetch();
          }}
          className="min-h-[60vh]"
        />
      </section>
    );
  }

  return (
    <section>
      <header className="flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4 md:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Link href={ROUTES.ME} aria-label="Back to profile">
            <ChevronLeft className="size-5 text-foreground" />
          </Link>
          <p className="truncate text-base font-bold tracking-[-0.32px] text-neutral-25">
            Edit Profile
          </p>
        </div>

        <Avatar className="size-10">
          <AvatarImage src={profile.avatarUrl} alt={profile.name} />
          <AvatarFallback className="bg-neutral-800 text-neutral-25">
            {profile.name?.charAt(0)?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
      </header>

      <div className="mx-auto w-full max-w-[361px] pb-6 pt-4 md:max-w-[800px] md:pb-10 md:pt-10">
        <Link
          href={ROUTES.ME}
          className="mb-8 hidden items-center gap-3 md:inline-flex"
        >
          <Camera className="size-8 text-neutral-25" />
          <p className="text-display-xs font-bold text-neutral-25">
            Edit Profile
          </p>
        </Link>

        <EditProfileForm
          profile={profile}
          onSuccess={() => {
            router.replace(ROUTES.ME);
          }}
        />
      </div>
    </section>
  );
}
