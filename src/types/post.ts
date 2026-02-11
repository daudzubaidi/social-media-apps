export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string;
  };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
  createdAt: string;
}

export interface CreatePostRequest {
  image: File;
  caption: string;
}
