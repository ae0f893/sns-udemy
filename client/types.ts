export interface Profile {
  id: number;
  bio: string;
  profileImageUrl: string;
  userId: string;
  user: UserType;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  password: string;
  posts: PostType[];
  profile: Profile;
}

export interface PostType {
  id: number;
  content: string;
  createdAt: string;
  authorId: number;
  author: UserType;
}
