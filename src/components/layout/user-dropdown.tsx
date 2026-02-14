"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth";
import { ROUTES } from "@/config/routes";

interface UserDropdownProps {
  avatarUrl?: string;
  userName?: string;
}

export function UserDropdown({ avatarUrl, userName }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleLogout() {
    clearToken();
    setIsOpen(false);
    router.push(ROUTES.LOGIN);
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex shrink-0 items-center gap-[13px] rounded-lg transition-colors hover:bg-neutral-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative size-[48px] shrink-0">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={userName || "User"}
              fill
              sizes="48px"
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center rounded-full bg-neutral-800 text-base font-bold text-neutral-25">
              {userName?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
        </div>
        <p className="shrink-0 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25">
          {userName || "User"}
        </p>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[200px] overflow-hidden rounded-lg border border-neutral-900 bg-neutral-950 shadow-lg">
          <Link
            href={ROUTES.ME}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold leading-7 tracking-[-0.14px] text-neutral-25 transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <User className="size-5" />
            My Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold leading-7 tracking-[-0.14px] text-destructive transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="size-5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
