import type { Tokens } from '../services/twitter';

export type UserWithTokens = Tokens & {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  description: string;
  location: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  listedCount: number;
  createdAt: string;
};
