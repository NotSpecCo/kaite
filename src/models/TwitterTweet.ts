export type TwitterTweet = {
  attachments?: {
    media_keys?: string[];
    poll_ids?: string[];
  };
  author_id: string;
  created_at: string;
  entities?: {
    hashtags?: {
      end: number;
      start: number;
      tag: string;
    }[];
    urls?: {
      end: number;
      start: number;
      url: string;
      display_url: string;
      title: string;
      description: string;
    }[];
    mentions?: {
      end: number;
      start: number;
      id: string;
      username: string;
    }[];
  };
  id: string;
  public_metrics: {
    like_count: number;
    quote_count: number;
    reply_count: number;
    retweet_count: number;
  };
  text: string;
  referenced_tweets?: {
    id: string;
    type: 'quoted' | 'replied_to' | 'retweeted';
  }[];
};
