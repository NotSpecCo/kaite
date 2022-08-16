import type { List, NewTweet, Tweet, User } from '../models';
import { AuthClient } from './authClient';
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
    AuthClient.logout();
    localStorage.clear();
  }

  // Users

  public getCurrentUser(): Promise<User> {
    let result = this.twitter.users.getCurrent();
    return result;
  }

  public async getUserById(id: string): Promise<User> {
    const result = await this.twitter.users.getById(id);
    return result;
  }

  public async getUserTweets(id: string): Promise<Tweet[]> {
    const result = await this.twitter.users.getTweets(id);
    return result;
  }

  public async getUserMentions(id: string): Promise<Tweet[]> {
    const result = await this.twitter.users.getMentions(id);
    return result;
  }

  public async getUserLikes(id: string): Promise<Tweet[]> {
    const result = await this.twitter.users.getLikes(id);
    return result;
  }

  public async getUserBookmarks(id: string): Promise<Tweet[]> {
    const result = await this.twitter.users.getBookmarks(id);
    return result;
  }

  public async getUserLists(id: string): Promise<List[]> {
    let result = await this.database.getAllLists();

    if (result.length === 0) {
      result = await this.twitter.users.getLists(id);
      await this.database.addLists(result);
    }

    return result;
  }

  public async followUser(userId: string): Promise<void> {
    await this.twitter.users.follow(userId);
  }

  public async unfollowUser(userId: string): Promise<void> {
    await this.twitter.users.unfollow(userId);
  }

  // Tweets

  public async fetchNewTimelineTweets(): Promise<Tweet[]> {
    const latestTweet = await this.database.getLatestTweet();
    const tweets = await this.twitter.users.getHomeTimeline(latestTweet?.id);
    await this.database.addTweets(tweets);

    return tweets;
  }

  public async getTweetById(id: string): Promise<Tweet | null> {
    let tweet = await this.database.getTweetById(id);

    if (!tweet) {
      tweet = await this.twitter.tweets.getById(id);
      await this.database.addTweet(tweet);
    }

    return tweet;
  }

  public getTweetCountSinceId(tweetId: string): Promise<number> {
    return this.database.getTweetCountSinceId(tweetId);
  }

  public async getLatestTweet(): Promise<Tweet | null> {
    let tweet = await this.database.getLatestTweet();
    return tweet;
  }

  public async likeTweet(tweetId: string): Promise<void> {
    await this.twitter.tweets.like(tweetId);
  }

  public async unlikeTweet(tweetId: string): Promise<void> {
    await this.twitter.tweets.unlike(tweetId);
  }

  public async retweetTweet(tweetId: string): Promise<void> {
    await this.twitter.tweets.retweet(tweetId);
  }

  public async unretweetTweet(tweetId: string): Promise<void> {
    await this.twitter.tweets.undoRetweet(tweetId);
  }

  public async bookmarkTweet(tweetId: string): Promise<void> {
    await this.twitter.tweets.bookmark(tweetId);
  }

  public async unbookmarkTweet(tweetId: string): Promise<void> {
    await this.twitter.tweets.removeBookmark(tweetId);
  }

  public async composeTweet(tweet: NewTweet): Promise<void> {
    await this.twitter.tweets.compose(tweet);
  }

  // Lists

  async getListById(id: string): Promise<List | null> {
    let result = await this.database.getListById(id);

    if (!result) {
      result = await this.twitter.lists.getById(id);
      await this.database.addList(result);
    }

    return result;
  }

  async getListFollowers(id: string): Promise<User[]> {
    return this.twitter.lists.getFollowers(id);
  }

  async getListMembers(id: string): Promise<User[]> {
    return this.twitter.lists.getMembers(id);
  }
}
