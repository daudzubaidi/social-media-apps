"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/user/follow-button";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/user";

interface ProfileHeaderProps {
  profile: Profile;
  className?: string;
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function getFollowersHref(profile: Profile): string {
  return profile.isMe
    ? ROUTES.ME_FOLLOWERS
    : ROUTES.PROFILE_FOLLOWERS(profile.username);
}

function getFollowingHref(profile: Profile): string {
  return profile.isMe
    ? ROUTES.ME_FOLLOWING
    : ROUTES.PROFILE_FOLLOWING(profile.username);
}

export function ProfileHeader({ profile, className }: ProfileHeaderProps) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3 md:gap-5">
          <Avatar className="size-16">
            <AvatarImage src={profile.avatarUrl} alt={profile.name} />
            <AvatarFallback className="bg-neutral-800 text-base font-bold text-neutral-25">
              {profile.name?.charAt(0)?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <p className="text-sm font-bold tracking-[-0.14px] text-neutral-25 md:text-base md:leading-[30px] md:tracking-[-0.32px]">
              {profile.name}
            </p>
            <p className="text-sm font-normal tracking-[-0.28px] text-neutral-25 md:text-base md:leading-[30px] md:tracking-[-0.32px]">
              {profile.username}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          {profile.isMe ? (
            <Link
              href={ROUTES.ME_EDIT}
              className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-900 px-4 text-sm font-bold leading-[28px] tracking-[-0.14px] text-neutral-25 md:h-12 md:w-[130px] md:flex-none md:text-base md:leading-[30px] md:tracking-[-0.32px]"
            >
              Edit Profile
            </Link>
          ) : (
            <FollowButton
              username={profile.username}
              isFollowing={profile.isFollowing}
              className="flex-1 md:flex-none"
            />
          )}

          <button
            type="button"
            aria-label="Share profile"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-neutral-900 text-neutral-25 md:size-12"
          >
            <Share2 className="size-5 md:size-6" />
          </button>
        </div>
      </div>

      {profile.bio ? (
        <p className="text-sm font-normal tracking-[-0.28px] text-neutral-25 md:text-base md:leading-[30px] md:tracking-[-0.32px]">
          {profile.bio}
        </p>
      ) : null}

      <div className="flex items-center gap-6">
        <ProfileStat label="Post" value={profile.counts.post} />
        <div className="h-[50px] w-px bg-neutral-900 md:h-[66px]" />
        <ProfileStat
          label="Followers"
          value={profile.counts.followers}
          href={getFollowersHref(profile)}
        />
        <div className="h-[50px] w-px bg-neutral-900 md:h-[66px]" />
        <ProfileStat
          label="Following"
          value={profile.counts.following}
          href={getFollowingHref(profile)}
        />
        <div className="h-[50px] w-px bg-neutral-900 md:h-[66px]" />
        <ProfileStat label="Likes" value={profile.counts.likes} />
      </div>
    </section>
  );
}

function ProfileStat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const content = (
    <>
      <p className="text-lg font-bold leading-[32px] tracking-[-0.54px] text-neutral-25 md:text-xl md:leading-[34px] md:tracking-[-0.4px]">
        {formatCount(value)}
      </p>
      <p className="text-xs font-normal leading-4 text-neutral-400 md:text-base md:leading-[30px] md:tracking-[-0.32px]">
        {label}
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="min-w-0 flex-1 text-center hover:opacity-80">
        {content}
      </Link>
    );
  }

  return <div className="min-w-0 flex-1 text-center">{content}</div>;
}

export function ProfileHeaderSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex items-center gap-3 md:gap-5">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 md:h-5 md:w-40" />
            <Skeleton className="h-4 w-24 md:h-5 md:w-36" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-full md:h-12 md:w-[130px] md:flex-none" />
          <Skeleton className="size-10 rounded-full md:size-12" />
        </div>
      </div>

      <Skeleton className="h-4 w-full md:h-5" />
      <div className="grid grid-cols-4 gap-3">
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
        <Skeleton className="h-14 rounded-xl" />
      </div>
    </section>
  );
}
