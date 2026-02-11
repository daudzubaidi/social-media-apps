"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!getToken());
  }, []);

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <MobileHeader isAuthenticated={isAuthenticated} />
      <main className="pb-20 md:pb-0">{children}</main>
      {isAuthenticated && <MobileNav />}
    </>
  );
}
