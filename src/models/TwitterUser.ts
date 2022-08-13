export type TwitterUser = {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  description: string;
  location: string;
  created_at: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
};
