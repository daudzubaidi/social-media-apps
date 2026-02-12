"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCreatePostDialogOpen } from "@/features/ui/ui-slice";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const isHome = pathname === ROUTES.FEED || pathname === ROUTES.HOME;
  const isProfile = pathname.startsWith(ROUTES.ME);

  return (
    <nav className="fixed bottom-8 left-1/2 z-40 hidden -translate-x-1/2 md:block">
      <div className="flex h-20 w-[360px] items-center justify-center gap-[45px] rounded-full border border-neutral-900 bg-neutral-950">
        {/* Home */}
        <Link
          href={ROUTES.FEED}
          className="flex w-[94px] shrink-0 flex-col items-center justify-center gap-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "size-6 shrink-0",
              isHome ? "text-primary-200" : "text-neutral-25"
            )}
          >
            <path
              d="M20.04 6.82L14.28 2.79C12.71 1.69 10.3 1.75 8.79 2.92L3.78 6.83C2.78 7.61 1.99 9.21 1.99 10.47V17.37C1.99 19.92 4.06 22 6.61 22H17.39C19.94 22 22.01 19.93 22.01 17.38V10.6C22.01 9.25 21.14 7.59 20.04 6.82ZM12.75 18C12.75 18.41 12.41 18.75 12 18.75C11.59 18.75 11.25 18.41 11.25 18V15C11.25 14.59 11.59 14.25 12 14.25C12.41 14.25 12.75 14.59 12.75 15V18Z"
              fill="currentColor"
            />
          </svg>
          <span
            className={cn(
              "w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-base leading-[30px] tracking-[-0.32px]",
              isHome ? "font-bold text-primary-200" : "font-normal text-neutral-25"
            )}
          >
            Home
          </span>
        </Link>

        {/* Add Button */}
        <button
          onClick={() => dispatch(setCreatePostDialogOpen(true))}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary-300 p-2"
          aria-label="Create post"
        >
          <Plus className="size-6 text-neutral-25" strokeWidth={2.5} />
        </button>

        {/* Profile */}
        <Link
          href={ROUTES.ME}
          className="flex w-[94px] shrink-0 flex-col items-center justify-center gap-1"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "size-6 shrink-0",
              isProfile ? "text-primary-200" : "text-neutral-25"
            )}
          >
            <path
              d="M16.82 2H7.18C5.05 2 3.32 3.74 3.32 5.86V19.95C3.32 21.75 4.61 22.51 6.19 21.64L11.07 18.93C11.59 18.64 12.43 18.64 12.94 18.93L17.82 21.64C19.4 22.52 20.69 21.76 20.69 19.95V5.86C20.68 3.74 18.95 2 16.82 2Z"
              fill="currentColor"
            />
          </svg>
          <span
            className={cn(
              "w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-base leading-[30px] tracking-[-0.32px]",
              isProfile ? "font-bold text-primary-200" : "font-normal text-neutral-25"
            )}
          >
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
}
