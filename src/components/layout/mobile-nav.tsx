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
  const homeActive = pathname === ROUTES.FEED;
  const profileRoute = pathname.startsWith(ROUTES.ME);

  if (pathname.startsWith(ROUTES.ME_EDIT)) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50">
      <div className="mx-auto flex h-16 w-[345px] items-center justify-center gap-[45px] rounded-[1000px] border border-neutral-700 bg-neutral-950 shadow-lg md:h-20 md:w-[360px]">
        <Link
          href={ROUTES.FEED}
          className="flex w-[94px] flex-col items-center justify-center gap-[2px]"
        >
          <Home className="size-5" />
          <span
            className={cn(
              "text-center text-xs",
              profileRoute
                ? "font-bold leading-6 text-neutral-25"
                : homeActive
                ? "font-bold leading-6 text-primary-200"
                : "font-normal leading-4 text-neutral-25",
            )}
          >
            Home
          </span>
        </Link>

        <button
          onClick={() => dispatch(setCreatePostDialogOpen(true))}
          className="flex size-11 items-center justify-center rounded-full bg-primary-300"
          aria-label="Create post"
        >
          <Plus className="size-6 text-white" strokeWidth={3} />
        </button>

        <Link
          href={ROUTES.ME}
          className="flex w-[94px] flex-col items-center justify-center gap-[2px]"
        >
          <User className="size-5" />
          <span
            className={cn(
              "text-center text-xs",
              profileRoute
                ? "font-normal leading-4 text-primary-200"
                : "font-normal leading-4 text-neutral-25",
            )}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
