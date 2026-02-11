"use client";

import { useSyncExternalStore } from "react";
import { getAuthSnapshot, subscribeToAuthChanges } from "@/lib/auth";

export function useAuth() {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    () => false,
  );

  return { isAuthenticated };
}
