"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchDropdown } from "@/components/layout/search-dropdown";
import { ROUTES } from "@/config/routes";
import type { UserListItem } from "@/types/user";

interface NavbarProps {
  isAuthenticated: boolean;
  avatarUrl?: string;
  userName?: string;
}

export function Navbar({ isAuthenticated, avatarUrl, userName }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Search results will be wired in Commit 9 via useSearchUsers
  const searchResults: UserListItem[] = [];
  const isSearching = false;

  const handleCloseDropdown = useCallback(() => {
    setShowDropdown(false);
    setSearchQuery("");
  }, []);

  return (
    <header className="hidden h-20 border-b border-neutral-900 bg-black md:block">
      <div className="mx-auto flex h-full w-[1440px] items-center justify-between px-[120px]">
        {/* Logo + Brand */}
        <Link
          href={isAuthenticated ? ROUTES.FEED : ROUTES.HOME}
          className="flex shrink-0 items-center gap-[11px]"
        >
          <div className="relative size-[30px] overflow-hidden">
            <svg
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-full"
              style={{ display: 'block' }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.0715 0H13.9286V9.48797L10.3743 0.690873L8.38749 1.4936L12.0338 10.5186L5.15102 3.63578L3.63579 5.15102L10.2327 11.7479L1.68362 8.01272L0.825689 9.97634L9.87158 13.9286H0V16.0715H9.87156L0.825692 20.0237L1.68362 21.9873L10.2326 18.2522L3.63579 24.849L5.15102 26.3642L12.0338 19.4814L8.38749 28.5065L10.3743 29.3091L13.9286 20.512V30H16.0715V20.512L19.6257 29.3091L21.6124 28.5065L17.9663 19.4814L24.849 26.3642L26.3642 24.849L19.7673 18.2522L28.3164 21.9873L29.1743 20.0237L20.1285 16.0715H30V13.9286H20.1284L29.1743 9.97634L28.3164 8.01272L19.7673 11.7479L26.3642 5.151L24.849 3.63578L17.9663 10.5186L21.6124 1.4936L19.6257 0.690873L16.0715 9.48797V0Z"
                fill="#FDFDFD"
              />
            </svg>
          </div>
          <p className="shrink-0 text-display-xs font-bold leading-[36px] text-neutral-25">
            Sociality
          </p>
        </Link>

        {/* Search bar */}
        <div className="relative shrink-0">
          <div className="flex h-12 w-[491px] items-center gap-[6px] rounded-full border border-neutral-900 bg-neutral-950 px-4 py-2">
            <div className="relative size-5 shrink-0">
              <svg
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-full"
              >
                <path
                  d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 17.5L13.875 13.875"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => searchQuery && setShowDropdown(true)}
              className="min-w-0 flex-1 bg-transparent text-sm font-normal leading-[28px] tracking-[-0.28px] text-neutral-25 placeholder:text-neutral-600 focus:outline-none"
            />
          </div>
          {showDropdown && (
            <SearchDropdown
              results={searchResults}
              isLoading={isSearching}
              query={searchQuery}
              onClose={handleCloseDropdown}
            />
          )}
        </div>

        {/* User Menu / Auth Buttons */}
        <div className="flex shrink-0 items-center gap-[13px]">
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="flex h-11 w-[130px] items-center justify-center rounded-full border border-neutral-900 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-colors hover:bg-neutral-900"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="flex h-11 w-[130px] items-center justify-center rounded-full bg-primary-300 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-opacity hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
