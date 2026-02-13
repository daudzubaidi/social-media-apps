"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Grid3x3, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ErrorState } from "@/components/shared/error-state";
import {
  ProfileHeader,
  ProfileHeaderSkeleton,
} from "@/components/user/profile-header";
import { ROUTES } from "@/config/routes";
import { useMe } from "@/services/queries/profile";
import { cn } from "@/lib/utils";

export default function MeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEditPage = pathname.startsWith(ROUTES.ME_EDIT);
  const { data: profile, isPending, isError, error, refetch } = useMe({
    enabled: !isEditPage,
  });

  if (isEditPage) {
    return <>{children}</>;
  }

  if (isPending) {
    return (
      <section className="mx-auto w-full max-w-[361px] pb-6 pt-4 md:max-w-[812px] md:pb-10 md:pt-10">
        <ProfileHeaderSkeleton />
      </section>
    );
  }

  if (isError || !profile) {
    const message =
      error instanceof Error ? error.message : "Failed to load profile";

    return (
      <section className="mx-auto w-full max-w-[361px] pb-6 pt-4 md:max-w-[812px] md:pb-10 md:pt-10">
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

  const tabs = [
    {
      href: ROUTES.ME,
      label: "Gallery",
      active: pathname === ROUTES.ME,
      icon: Grid3x3,
    },
    {
      href: ROUTES.ME_SAVED,
      label: "Saved",
      active: pathname === ROUTES.ME_SAVED,
      icon: Bookmark,
    },
  ];

  return (
    <section>
      <header className="flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4 md:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Link href={ROUTES.FEED} aria-label="Back to feed">
            <ChevronLeft className="size-5 text-foreground" />
          </Link>
          <p className="truncate text-base font-bold tracking-[-0.32px] text-neutral-25">
            {profile.name}
          </p>
        </div>
        <Link href={ROUTES.ME_EDIT} aria-label="Edit profile">
          <Avatar className="size-10">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-neutral-800 text-neutral-25">
              {profile.name?.charAt(0)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </header>

      <div className="mx-auto w-full max-w-[361px] px-4 pb-6 pt-4 md:max-w-[812px] md:pb-10 md:pt-10">
        <ProfileHeader profile={profile} />

        <nav className="mt-4 flex w-full items-center" aria-label="Profile tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex h-12 min-h-px flex-1 items-center justify-center gap-2 border-b px-6 md:gap-3",
                  tab.active
                    ? "border-b-2 border-neutral-25 text-neutral-25"
                    : "border-neutral-900 text-neutral-400",
                )}
              >
                <Icon className="size-[16.667px] md:size-6" />
                <span
                  className={cn(
                    "text-sm leading-[28px] md:text-base md:leading-[30px]",
                    tab.active
                      ? "font-bold tracking-[-0.14px] md:tracking-[-0.32px]"
                      : "font-medium",
                  )}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6">{children}</div>
      </div>
    </section>
  );
}
