"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { LoadingState } from "@/components/shared/loading-state";
import { useAuth } from "@/hooks/use-auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(
        `${ROUTES.LOGIN}?returnTo=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) {
    return <LoadingState className="min-h-screen" />;
  }

  return <>{children}</>;
}
