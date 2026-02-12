"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { getAuthSnapshot } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = getAuthSnapshot();
    if (isAuthenticated) {
      router.replace(ROUTES.FEED);
    } else {
      router.replace(ROUTES.LOGIN);
    }
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-display-xs font-bold text-primary">Sociality</h1>
    </main>
  );
}
