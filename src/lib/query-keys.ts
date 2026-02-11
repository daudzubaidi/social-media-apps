export const queryKeys = {
  me: {
    all: ["me"] as const,
    profile: () => [...queryKeys.me.all, "profile"] as const,
    likes: () => [...queryKeys.me.all, "likes"] as const,
    saved: () => [...queryKeys.me.all, "saved"] as const,
    followers: () => [...queryKeys.me.all, "followers"] as const,
    following: () => [...queryKeys.me.all, "following"] as const,
  },
  users: {
    all: ["users"] as const,
    search: (q: string) => [...queryKeys.users.all, "search", q] as const,
    profile: (username: string) =>
      [...queryKeys.users.all, username] as const,
    posts: (username: string) =>
      [...queryKeys.users.all, username, "posts"] as const,
    likes: (username: string) =>
      [...queryKeys.users.all, username, "likes"] as const,
    followers: (username: string) =>
      [...queryKeys.users.all, username, "followers"] as const,
    following: (username: string) =>
      [...queryKeys.users.all, username, "following"] as const,
  },
  feed: {
    all: ["feed"] as const,
  },
  posts: {
    all: ["posts"] as const,
    detail: (id: string) => [...queryKeys.posts.all, id] as const,
    likes: (id: string) => [...queryKeys.posts.all, id, "likes"] as const,
    comments: (id: string) =>
      [...queryKeys.posts.all, id, "comments"] as const,
  },
} as const;
