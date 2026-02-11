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
  const { isAuthenticated, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace(
        `${ROUTES.LOGIN}?returnTo=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isHydrated, isAuthenticated, router, pathname]);

  if (!isHydrated || !isAuthenticated) {
    return <LoadingState className="min-h-screen" />;
  }

  return <>{children}</>;
}
