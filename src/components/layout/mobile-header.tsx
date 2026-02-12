"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setMobileMenuOpen } from "@/features/ui/ui-slice";
import { ROUTES } from "@/config/routes";
import type { RootState } from "@/store";

interface MobileHeaderProps {
  isAuthenticated: boolean;
  avatarUrl?: string;
}

export function MobileHeader({ isAuthenticated, avatarUrl }: MobileHeaderProps) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const mobileMenuOpen = useSelector((state: RootState) => state.ui.mobileMenuOpen);

  if (pathname.startsWith(ROUTES.ME)) {
    return null;
  }

  const toggleMenu = () => {
    dispatch(setMobileMenuOpen(!mobileMenuOpen));
  };

  return (
    <>
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 md:hidden">
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
          <button
            type="button"
            onClick={toggleMenu}
            className="flex items-center justify-center text-foreground"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        )}
      </div>
    </header>

    {/* Mobile Auth Menu - Only visible when not authenticated and menu is open */}
    {!isAuthenticated && mobileMenuOpen && (
      <div className="flex items-center justify-center gap-3 border-b border-border bg-background px-4 py-3 md:hidden">
        <Link
          href={ROUTES.LOGIN}
          onClick={() => dispatch(setMobileMenuOpen(false))}
          className="flex h-11 flex-1 items-center justify-center rounded-full border border-neutral-900 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-colors hover:bg-neutral-900"
        >
          Login
        </Link>
        <Link
          href={ROUTES.REGISTER}
          onClick={() => dispatch(setMobileMenuOpen(false))}
          className="flex h-11 flex-1 items-center justify-center rounded-full bg-primary-300 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-opacity hover:opacity-90"
        >
          Register
        </Link>
      </div>
    )}
    </>
  );
}
