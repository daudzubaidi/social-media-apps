export interface Comment {
  id: string;
  text: string;
  author: {
    id: string;
    username: string;
    name: string;
    avatarUrl?: string | null;
  };
  createdAt: string;
  isMine?: boolean;
}

export interface CreateCommentRequest {
  text: string;
}
