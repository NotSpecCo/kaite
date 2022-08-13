import type { Poll } from './Poll';

export type Tweet = {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
  text: string;
  htmlText: string;
  likeCount: number;
  quoteCount: number;
  replyCount: number;
  retweetCount: number;
  entities?: {
    hashtags?: {
      tag: string;
    }[];
    urls?: {
      url: string;
      display_url: string;
      title: string;
      description: string;
    }[];
    mentions?: {
      id: string;
      username: string;
    }[];
  };
  attachments: {
    media?: {
      id: string;
      type: string;
      url: string;
    }[];
    poll?: Poll;
  };
  createdAt: string;
  nextTweetId?: string;
  prevTweetId?: string;
};
