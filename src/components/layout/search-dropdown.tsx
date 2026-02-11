"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { ROUTES } from "@/config/routes";
import type { UserListItem } from "@/types/user";

interface SearchDropdownProps {
  results: UserListItem[];
  isLoading: boolean;
  query: string;
  onClose: () => void;
}

export function SearchDropdown({
  results,
  isLoading,
  query,
  onClose,
}: SearchDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!query) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-lg"
    >
      <div className="max-h-80 overflow-y-auto p-2">
        {isLoading && (
          <p className="px-3 py-4 text-center text-sm text-muted-foreground">
            Searching...
          </p>
        )}

        {!isLoading && results.length === 0 && (
          <p className="px-3 py-4 text-center text-sm text-muted-foreground">
            User not found
          </p>
        )}

        {!isLoading &&
          results.map((user) => (
            <Link
              key={user.id}
              href={ROUTES.PROFILE(user.username)}
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent"
            >
              <Avatar className="size-10">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  <User className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
