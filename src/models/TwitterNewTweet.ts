export type TwitterNewTweet = {
  text: string;
  quote_tweet_id?: string;
  reply?: {
    in_reply_to_tweet_id: string;
  };
  poll?: {
    options: string[];
    duration_minutes: number;
  };
};
