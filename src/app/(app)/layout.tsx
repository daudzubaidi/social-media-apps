"use client";

import { Navbar } from "@/components/layout/navbar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CreatePostDialog } from "@/components/post/create-post-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useMe } from "@/services/queries/profile";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { data: profile } = useMe({ enabled: isAuthenticated });

  return (
    <>
      <Navbar
        isAuthenticated={isAuthenticated}
        avatarUrl={profile?.avatarUrl}
        userName={profile?.name}
      />
      <MobileHeader
        isAuthenticated={isAuthenticated}
        avatarUrl={profile?.avatarUrl}
      />
      <main className={isAuthenticated ? "pb-24 md:pb-0" : "md:pb-0"}>{children}</main>
      <MobileNav isAuthenticated={isAuthenticated} />
      <CreatePostDialog />
    </>
  );
}
