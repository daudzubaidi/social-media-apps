export interface Profile {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  counts: {
    post: number;
    followers: number;
    following: number;
    likes: number;
  };
  isFollowing: boolean;
  isMe: boolean;
}

export interface UserListItem {
  id: string;
  username: string;
  name: string;
  avatarUrl?: string;
  isFollowedByMe: boolean;
}

export interface UpdateProfileRequest {
  name?: string;
  username?: string;
  email?: string;
  numberPhone?: string;
  bio?: string;
  avatar?: File;
}
