import type { Tweet, User } from '../models';
import { Database } from './database';
import { Twitter } from './twitter';

export class DataService {
  twitter: Twitter;
  database: Database;

  constructor() {
    this.twitter = new Twitter();
    this.database = new Database();
  }

  // Users

  public async getUserById(id: string): Promise<User> {
    const result = await this.twitter.getUserById(id);
    return result;
  }

  public async getUserTweets(id: string): Promise<Tweet[]> {
    const result = await this.twitter.getUserTweets(id);
    return result;
  }

  public async getUserMentions(id: string): Promise<Tweet[]> {
    const result = await this.twitter.getUserMentions(id);
    return result;
  }

  public async getUserLikes(id: string): Promise<Tweet[]> {
    const result = await this.twitter.getUserLikes(id);
    return result;
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
