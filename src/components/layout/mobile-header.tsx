"use client";

import Link from "next/link";
import { Search, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";

interface MobileHeaderProps {
  isAuthenticated: boolean;
  avatarUrl?: string;
}

export function MobileHeader({ isAuthenticated, avatarUrl }: MobileHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
      <Link href={isAuthenticated ? ROUTES.FEED : ROUTES.HOME} className="text-xl font-bold text-primary">
        Sociality
      </Link>
      <div className="flex items-center gap-3">
        <Link href={ROUTES.SEARCH_USERS} aria-label="Search users">
          <Search className="size-5 text-foreground" />
        </Link>
        {isAuthenticated ? (
          <Link href={ROUTES.ME}>
            <Avatar className="size-8">
              <AvatarImage src={avatarUrl} alt="Profile" />
              <AvatarFallback>
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Button size="sm" asChild>
            <Link href={ROUTES.LOGIN}>Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
