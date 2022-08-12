import KaiOS from 'kaios-lib';
import type { Tweet, User, UserWithTokens } from '../models';
import { Database } from './database';
import { Twitter } from './twitter';

export class DataService {
  twitter: Twitter;
  database: Database;

  constructor() {
    this.twitter = new Twitter();
    this.database = new Database();
  }

  public async logout(): Promise<void> {
    await this.database.clear();
    localStorage.clear();
  }

  // Users

  public getStoredUser(): User {
    let result = new KaiOS.LocalStorage().getItem<UserWithTokens>('twitter_user');
    return result;
  }

  public getCurrentUser(): Promise<User> {
    let result = this.twitter.getCurrentUser();
    return result;
  }

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

  public async fetchNewTimelineTweets(): Promise<Tweet[]> {
    const latestTweet = await this.database.getLatestTweet();
    const tweets = await this.twitter.getFeed(latestTweet?.id);
    await this.database.addTweets(tweets);

    return tweets;
  }

  public async getTweetById(id: string): Promise<Tweet | null> {
    let tweet = await this.database.getTweetById(id);

    if (!tweet) {
      tweet = await this.twitter.getTweetById(id);
    }

    return tweet;
  }

  public async getLatestTweet(): Promise<Tweet | null> {
    let tweet = await this.database.getLatestTweet();
    return tweet;
  }
}
