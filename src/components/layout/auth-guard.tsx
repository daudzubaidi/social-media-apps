"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken } from "@/lib/auth";
import { ROUTES } from "@/config/routes";
import { LoadingState } from "@/components/shared/loading-state";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace(
        `${ROUTES.LOGIN}?returnTo=${encodeURIComponent(pathname)}`,
      );
    } else {
      setIsChecked(true);
    }
  }, [router, pathname]);

  if (!isChecked) {
    return <LoadingState className="min-h-screen" />;
  }

  return <>{children}</>;
}
