"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Plus, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCreatePostDialogOpen } from "@/features/ui/ui-slice";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background md:hidden">
      <div className="mx-auto flex h-16 max-w-[345px] items-center justify-around">
        <Link
          href={ROUTES.FEED}
          className={cn(
            "flex flex-col items-center gap-1",
            pathname === ROUTES.FEED
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          <Home className="size-5" />
          <span className="text-xs">Home</span>
        </Link>

        <button
          onClick={() => dispatch(setCreatePostDialogOpen(true))}
          className="flex items-center justify-center rounded-full bg-primary p-3"
          aria-label="Create post"
        >
          <Plus className="size-5 text-primary-foreground" />
        </button>

        <Link
          href={ROUTES.ME}
          className={cn(
            "flex flex-col items-center gap-1",
            pathname.startsWith(ROUTES.ME)
              ? "text-primary"
              : "text-muted-foreground",
          )}
        >
          <User className="size-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
