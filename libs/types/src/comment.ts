export interface IComment {
  id: number;
  postId: string;
  userId: string;
  user_name: string;

  content: string;
  createdAt: string;
  updatedAt: string;
}
