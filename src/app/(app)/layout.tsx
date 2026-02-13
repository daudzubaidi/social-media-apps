"use client";

import { Navbar } from "@/components/layout/navbar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CreatePostDialog } from "@/components/post/create-post-dialog";
import { useAuth } from "@/hooks/use-auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <MobileHeader isAuthenticated={isAuthenticated} />
      <main className="pb-20 md:pb-0">{children}</main>
      <MobileNav />
      <CreatePostDialog />
    </>
  );
}
