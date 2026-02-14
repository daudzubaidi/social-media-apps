"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Search, Menu, X, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setMobileMenuOpen } from "@/features/ui/ui-slice";
import { clearToken } from "@/lib/auth";
import { ROUTES } from "@/config/routes";
import type { RootState } from "@/store";

interface MobileHeaderProps {
  isAuthenticated: boolean;
  avatarUrl?: string;
}

export function MobileHeader({ isAuthenticated, avatarUrl }: MobileHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const mobileMenuOpen = useSelector((state: RootState) => state.ui.mobileMenuOpen);
  const isPostDetailRoute = pathname.startsWith("/posts/");

  if (
    pathname.startsWith(ROUTES.ME) ||
    pathname === ROUTES.SEARCH_USERS ||
    isPostDetailRoute
  ) {
    return null;
  }

  const toggleMenu = () => {
    dispatch(setMobileMenuOpen(!mobileMenuOpen));
  };

  const handleLogout = () => {
    clearToken();
    dispatch(setMobileMenuOpen(false));
    router.push(ROUTES.LOGIN);
  };

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4 md:hidden">
        <Link
          href={ROUTES.HOME}
          className="flex shrink-0 items-center gap-[11px]"
        >
          <img
            src="/assets/auth/logo-icon.svg"
            alt=""
            aria-hidden="true"
            className="size-[30px]"
          />
          <p className="shrink-0 text-display-xs font-bold leading-[36px] text-neutral-25">
            Sociality
          </p>
        </Link>

        <div className="flex items-center gap-4">
          <Link href={ROUTES.SEARCH_USERS} aria-label="Search users">
            <Search className="size-5 text-neutral-25" strokeWidth={2} />
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={toggleMenu}
              className="flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close account menu" : "Open account menu"}
            >
              <Avatar className="size-10">
                <AvatarImage src={avatarUrl} alt="Profile" />
                <AvatarFallback className="bg-neutral-800 text-sm font-semibold text-neutral-25">
                  U
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleMenu}
              className="flex items-center justify-center text-neutral-25"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="size-5" strokeWidth={2} />
              ) : (
                <Menu className="size-5" strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-900 bg-black md:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col">
              <Link
                href={ROUTES.ME}
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold leading-7 tracking-[-0.14px] text-neutral-25 transition-colors hover:bg-neutral-900 active:bg-neutral-900"
              >
                <User className="size-5" />
                My Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold leading-7 tracking-[-0.14px] text-destructive transition-colors hover:bg-neutral-900 active:bg-neutral-900"
              >
                <LogOut className="size-5" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3 px-4 pb-4">
              <Link
                href={ROUTES.LOGIN}
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="flex h-12 flex-1 items-center justify-center rounded-full border border-neutral-900 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-colors active:bg-neutral-900"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="flex h-12 flex-1 items-center justify-center rounded-full bg-primary-300 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-opacity active:opacity-80"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
}
