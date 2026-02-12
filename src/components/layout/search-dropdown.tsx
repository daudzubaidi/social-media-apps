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
      className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-neutral-700 bg-neutral-900 shadow-lg"
    >
      <div className="max-h-[384px] overflow-y-auto p-5">
        {isLoading && (
          <p className="px-3 py-4 text-center text-sm text-muted-foreground">
            Searching...
          </p>
        )}

        {!isLoading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-base font-bold leading-[30px] tracking-[-0.32px] text-foreground">
              No results found
            </p>
            <p className="mt-1 text-sm leading-7 tracking-[-0.28px] text-muted-foreground">
              Change your keyword
            </p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((user) => (
              <Link
                key={user.id}
                href={ROUTES.PROFILE(user.username)}
                onClick={onClose}
                className="flex h-14 items-center gap-3 transition-opacity hover:opacity-80"
              >
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold leading-7 tracking-[-0.14px] text-foreground">
                    {user.name}
                  </p>
                  <p className="truncate text-sm leading-7 tracking-[-0.14px] text-muted-foreground">
                    {user.username}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
