"use client";

import { useSyncExternalStore } from "react";
import { getAuthSnapshot, subscribeToAuthChanges } from "@/lib/auth";

const subscribeHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydratedSnapshot = () => false;

export function useAuth() {
  const isAuthenticated = useSyncExternalStore(
    subscribeToAuthChanges,
    getAuthSnapshot,
    () => false,
  );
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getHydratedSnapshot,
    getServerHydratedSnapshot,
  );

  return { isAuthenticated, isHydrated };
}
