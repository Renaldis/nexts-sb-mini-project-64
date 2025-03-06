export type User = {
  id: number;
  name: string;
  email: string;
  birth_date: Date;
  phone: string;
  hobby: string;
  password: string;
};

export type Post = {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  updated_at: string;
  id_likes_post_id: number;
};

export type Replies = {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: string;
};
export type Likes = {
  id: number;
  user_id: number;
  post_id: number;
};

export type Notification = {
  id: number;
  user_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender_id: string;
  sender_name: string;
  post_id: number;
  reply_id: number;
  like_id: number;
  type: string;
};
