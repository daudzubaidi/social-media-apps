"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCreatePostDialogOpen } from "@/features/ui/ui-slice";
import { ROUTES } from "@/config/routes";

interface MobileNavProps {
  isAuthenticated: boolean;
}

export function MobileNav({ isAuthenticated }: MobileNavProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const profileRoute = pathname.startsWith(ROUTES.ME);
  const homeActive = !profileRoute;
  const isPostDetailRoute = pathname.startsWith("/posts/");

  // Only show mobile nav for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  if (pathname.startsWith(ROUTES.ME_EDIT)) {
    return null;
  }

  if (pathname === ROUTES.SEARCH_USERS) {
    return null;
  }

  if (isPostDetailRoute) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40">
      <div
        className="mx-auto flex h-16 w-[345px] items-center justify-center gap-[45px] rounded-[1000px] border border-neutral-900 bg-neutral-950/95 shadow-2xl backdrop-blur-[50px] md:h-20 md:w-[360px]"
        style={{ boxShadow: "0 10px 40px rgba(0, 0, 0, 0.8)" }}
      >
        <Link
          href={ROUTES.HOME}
          className="flex w-[94px] flex-col items-center justify-center gap-[2px]"
        >
          <img
            src={
              homeActive
                ? "/assets/figma-profile/from-mcp/nav/home-active.svg"
                : "/assets/figma-profile/from-mcp/nav/home-inactive.svg"
            }
            alt=""
            aria-hidden="true"
            className="size-5"
          />
          <span
            className={
              homeActive
                ? "text-center text-xs font-bold leading-6 text-primary-200"
                : "text-center text-xs font-bold leading-6 text-neutral-25"
            }
          >
            Home
          </span>
        </Link>

        <button
          onClick={() => dispatch(setCreatePostDialogOpen(true))}
          className="flex size-11 items-center justify-center rounded-full bg-primary-300 p-[7.333px]"
          aria-label="Create post"
        >
          <img
            src="/assets/figma-profile/from-mcp/nav/plus.svg"
            alt=""
            aria-hidden="true"
            className="size-[14.667px]"
          />
        </button>

        <Link
          href={ROUTES.ME}
          className="flex w-[94px] flex-col items-center justify-center gap-[2px]"
        >
          <img
            src={
              profileRoute
                ? "/assets/figma-profile/from-mcp/nav/profile-active.svg"
                : "/assets/figma-profile/from-mcp/nav/profile-inactive.svg"
            }
            alt=""
            aria-hidden="true"
            className="size-5"
          />
          <span
            className={
              profileRoute
                ? "text-center text-xs font-normal leading-4 text-primary-200"
                : "text-center text-xs font-normal leading-4 text-neutral-25"
            }
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
