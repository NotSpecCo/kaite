export type NewTweet = {
  text: string;
  replyId?: string;
  quoteId?: string;
  poll?: {
    options: string[];
    duration: number;
  };
};
