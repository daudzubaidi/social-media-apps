"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/layout/user-menu";
import { SearchDropdown } from "@/components/layout/search-dropdown";
import { setCreatePostDialogOpen } from "@/features/ui/ui-slice";
import { ROUTES } from "@/config/routes";
import type { UserListItem } from "@/types/user";

interface NavbarProps {
  isAuthenticated: boolean;
  avatarUrl?: string;
  userName?: string;
}

export function Navbar({ isAuthenticated, avatarUrl, userName }: NavbarProps) {
  const dispatch = useDispatch();
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
    <header className="hidden h-20 border-b border-border bg-background md:block">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-6 px-8">
        {/* Logo */}
        <Link
          href={isAuthenticated ? ROUTES.FEED : ROUTES.HOME}
          className="shrink-0 text-xl font-bold text-primary"
        >
          Sociality
        </Link>

        {/* Search bar */}
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => searchQuery && setShowDropdown(true)}
            className="pl-9"
          />
          {showDropdown && (
            <SearchDropdown
              results={searchResults}
              isLoading={isSearching}
              query={searchQuery}
              onClose={handleCloseDropdown}
            />
          )}
        </div>

        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                onClick={() => dispatch(setCreatePostDialogOpen(true))}
                size="sm"
              >
                <Plus className="mr-1 size-4" />
                Create Post
              </Button>
              <UserMenu avatarUrl={avatarUrl} name={userName} />
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href={ROUTES.LOGIN}>Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={ROUTES.REGISTER}>Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
