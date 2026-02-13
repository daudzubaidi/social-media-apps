"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X as XIcon, XCircle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchUsers } from "@/services/queries/users";
import { ROUTES } from "@/config/routes";

export default function UserSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useSearchUsers(debouncedQuery);

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const showResults = Boolean(debouncedQuery.trim());
  const showEmpty = showResults && !isLoading && users.length === 0;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center gap-3 border-b border-neutral-900 bg-background px-4">
        <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border border-neutral-900 bg-neutral-950 px-4">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            autoFocus
            className="min-w-0 flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-foreground placeholder:text-neutral-600 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <XCircle className="size-5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="shrink-0 text-foreground"
          aria-label="Close search"
        >
          <XIcon className="size-6" />
        </button>
      </header>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 pt-4">
        {!showResults ? null : isLoading && users.length === 0 ? (
          <LoadingState className="min-h-[40vh]" />
        ) : isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : "Failed to search users"}
            onRetry={() => {
              void refetch();
            }}
            className="min-h-[40vh]"
          />
        ) : showEmpty ? (
          <EmptyState
            title="No results found"
            description="Change your keyword"
            className="min-h-[40vh]"
          />
        ) : (
          <>
            <div className="space-y-4">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={ROUTES.PROFILE(user.username)}
                  className="flex h-14 items-center gap-3 transition-opacity hover:opacity-80"
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold leading-7 tracking-[-0.14px] text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-sm leading-7 tracking-[-0.14px] text-muted-foreground">
                      {user.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <InfiniteScroll
              hasMore={Boolean(hasNextPage)}
              isLoading={isFetchingNextPage}
              onLoadMore={() => {
                void fetchNextPage();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
