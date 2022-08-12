export type Tweet = {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
  text: string;
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
    }[];
  };
  createdAt: string;
  nextTweetId?: string;
  prevTweetId?: string;
};
