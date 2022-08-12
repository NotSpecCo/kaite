import type { Tweet } from '../models';
import { Database } from './database';
import { Twitter } from './twitter';

export class DataService {
  twitter: Twitter;
  database: Database;

  constructor() {
    this.twitter = new Twitter();
    this.database = new Database();
  }

  // Tweets
  public async refreshTweets(): Promise<Tweet[]> {
    const latestTweet = await this.database.getLatestTweet();
    const tweets = await this.twitter.getFeed(latestTweet?.id);
    await this.database.addTweets(tweets);

    return tweets;
  }

  public async getTweet(id: string): Promise<Tweet | null> {
    let tweet = await this.database.getTweet(id);

    return tweet;
  }

  public async getLatestTweet(): Promise<Tweet | null> {
    let tweet = await this.database.getLatestTweet();
    return tweet;
  }
}
