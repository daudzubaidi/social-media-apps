"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { getAuthSnapshot } from "@/lib/auth";
import { usePublicPosts } from "@/services/queries/public-posts";
import { useSearchUsers } from "@/services/queries/users";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchDropdown } from "@/components/layout/search-dropdown";
import { PostCard } from "@/components/post/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";

function PublicHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data, isLoading } = useSearchUsers(debouncedQuery);
  const searchResults = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);
  const isSearching = isLoading;

  const handleCloseDropdown = useCallback(() => {
    setShowDropdown(false);
    setSearchQuery("");
  }, []);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 hidden h-20 border-b border-neutral-900 bg-black md:block">
        <div className="mx-auto flex h-full w-full max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-[120px]">
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-[11px]">
            <div className="relative size-[30px] overflow-hidden">
              <svg
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="size-full"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.0715 0H13.9286V9.48797L10.3743 0.690873L8.38749 1.4936L12.0338 10.5186L5.15102 3.63578L3.63579 5.15102L10.2327 11.7479L1.68362 8.01272L0.825689 9.97634L9.87158 13.9286H0V16.0715H9.87156L0.825692 20.0237L1.68362 21.9873L10.2326 18.2522L3.63579 24.849L5.15102 26.3642L12.0338 19.4814L8.38749 28.5065L10.3743 29.3091L13.9286 20.512V30H16.0715V20.512L19.6257 29.3091L21.6124 28.5065L17.9663 19.4814L24.849 26.3642L26.3642 24.849L19.7673 18.2522L28.3164 21.9873L29.1743 20.0237L20.1285 16.0715H30V13.9286H20.1284L29.1743 9.97634L28.3164 8.01272L19.7673 11.7479L26.3642 5.151L24.849 3.63578L17.9663 10.5186L21.6124 1.4936L19.6257 0.690873L16.0715 9.48797V0Z"
                  fill="#FDFDFD"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold leading-9 text-neutral-25">
              Sociality
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="relative min-w-0 flex-1 max-w-[491px]">
            <div className="flex h-12 w-full items-center gap-[6px] rounded-full border border-neutral-900 bg-neutral-950 px-4 py-2">
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

          {/* Auth Buttons */}
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="flex h-11 w-[130px] items-center justify-center rounded-full border border-neutral-900 bg-transparent px-2 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Login
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="flex h-11 w-[130px] items-center justify-center rounded-full bg-primary-300 px-2 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-neutral-900 bg-black px-4 md:hidden">
        <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-[11px]">
          <div className="relative size-[30px] overflow-hidden">
            <svg
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-full"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.0715 0H13.9286V9.48797L10.3743 0.690873L8.38749 1.4936L12.0338 10.5186L5.15102 3.63578L3.63579 5.15102L10.2327 11.7479L1.68362 8.01272L0.825689 9.97634L9.87158 13.9286H0V16.0715H9.87156L0.825692 20.0237L1.68362 21.9873L10.2326 18.2522L3.63579 24.849L5.15102 26.3642L12.0338 19.4814L8.38749 28.5065L10.3743 29.3091L13.9286 20.512V30H16.0715V20.512L19.6257 29.3091L21.6124 28.5065L17.9663 19.4814L24.849 26.3642L26.3642 24.849L19.7673 18.2522L28.3164 21.9873L29.1743 20.0237L20.1285 16.0715H30V13.9286H20.1284L29.1743 9.97634L28.3164 8.01272L19.7673 11.7479L26.3642 5.151L24.849 3.63578L17.9663 10.5186L21.6124 1.4936L19.6257 0.690873L16.0715 9.48797V0Z"
                fill="#FDFDFD"
              />
            </svg>
          </div>
          <h1 className="text-display-xs font-bold leading-[36px] text-neutral-25">
            Sociality
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link href={ROUTES.SEARCH_USERS} aria-label="Search users">
            <Search className="size-5 text-neutral-25" strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex items-center justify-center text-neutral-25"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" strokeWidth={2} />
            ) : (
              <Menu className="size-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed left-0 right-0 top-16 z-50 border-b border-neutral-900 bg-black px-4 pb-4 md:hidden">
          <div className="flex items-center justify-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-12 flex-1 items-center justify-center rounded-full border border-neutral-900 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-colors active:bg-neutral-900"
            >
              Login
            </Link>
            <Link
              href={ROUTES.REGISTER}
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-12 flex-1 items-center justify-center rounded-full bg-primary-300 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-opacity active:opacity-80"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function PublicFeedSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 px-4 pb-[120px] pt-[80px] md:pt-[120px]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { data, isPending, isError, error, refetch } = usePublicPosts();

  useEffect(() => {
    const isAuthenticated = getAuthSnapshot();
    if (isAuthenticated) {
      router.replace(ROUTES.FEED);
    }
  }, [router]);

  if (isPending) {
    return (
      <>
        <PublicHeader />
        <PublicFeedSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <PublicHeader />
        <div className="flex min-h-screen items-center justify-center pt-[80px] md:pt-[120px]">
          <ErrorState
            message={error instanceof Error ? error.message : "Failed to load posts"}
            onRetry={() => void refetch()}
          />
        </div>
      </>
    );
  }

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <PublicHeader />
      <main className="mx-auto w-full max-w-[600px] px-4 pb-[120px] pt-[80px] md:pt-[120px]">
        <div className="flex flex-col gap-6">
          {posts.map((post, index) => (
            <div key={post.id}>
              <PostCard post={post} />
              {index < posts.length - 1 && (
                <div className="my-6 h-px w-full bg-neutral-900" />
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
