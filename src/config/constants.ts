export const PAGINATION_LIMIT = 20;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  ME: {
    PROFILE: "/api/me",
    POSTS: "/api/me/posts",
    LIKES: "/api/me/likes",
    SAVED: "/api/me/saved",
    FOLLOWERS: "/api/me/followers",
    FOLLOWING: "/api/me/following",
  },
  USERS: {
    SEARCH: "/api/users/search",
    PROFILE: (username: string) => `/api/users/${username}`,
    POSTS: (username: string) => `/api/users/${username}/posts`,
    LIKES: (username: string) => `/api/users/${username}/likes`,
    FOLLOWERS: (username: string) => `/api/users/${username}/followers`,
    FOLLOWING: (username: string) => `/api/users/${username}/following`,
  },
  FEED: "/api/feed",
  POSTS: {
    LIST: "/api/posts",
    CREATE: "/api/posts",
    DETAIL: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    LIKE: (id: string) => `/api/posts/${id}/like`,
    LIKES: (id: string) => `/api/posts/${id}/likes`,
    COMMENTS: (id: string) => `/api/posts/${id}/comments`,
    SAVE: (id: string) => `/api/posts/${id}/save`,
  },
  COMMENTS: {
    DELETE: (id: string) => `/api/comments/${id}`,
  },
  FOLLOW: {
    TOGGLE: (username: string) => `/api/follow/${username}`,
  },
} as const;
