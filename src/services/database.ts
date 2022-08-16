import Dexie from 'dexie';
import type { List, Tweet } from '../models';
import { PerfLogger } from './perfLogger';

export class Database extends Dexie {
  tweets: Dexie.Table<Tweet, string>;
  lists: Dexie.Table<List, string>;

  constructor() {
    super('kaite');

    this.version(1).stores({
      tweets: '&id, createdAt',
    });
    this.version(2).stores({
      tweets: '&id, createdAt',
      lists: '&id, createdAt',
    });

    this.tweets = this.table('tweets');
    this.lists = this.table('lists');
  }

  public async clear(): Promise<void> {
    await this.delete();
  }

  // Tweets

  public async addTweet(tweet: Tweet): Promise<void> {
    PerfLogger.start(`database.addTweet ${tweet.id}`);
    await this.tweets.put(tweet);
    PerfLogger.stop(`database.addTweet ${tweet.id}`);
  }

  public async addTweets(tweets: Tweet[]): Promise<void> {
    PerfLogger.start('database.addTweets');
    await this.tweets.bulkPut(tweets);
    PerfLogger.stop('database.addTweets');
  }

  public async getTweetById(id: string): Promise<Tweet | null> {
    PerfLogger.start(`database.getTweetById ${id}`);
    const tweet = await this.tweets.get({ id });
    if (!tweet) return null;

    tweet.nextTweetId = await this.tweets
      .where('createdAt')
      .above(tweet.createdAt)
      .sortBy('createdAt')
      .then((res) => res[0]?.id);

    tweet.prevTweetId = await this.tweets
      .where('createdAt')
      .below(tweet.createdAt)
      .reverse()
      .sortBy('createdAt')
      .then((res) => res[0]?.id);

    PerfLogger.stop(`database.getTweetById ${id}`);
    return tweet;
  }

  public async getLatestTweet(): Promise<Tweet | undefined> {
    PerfLogger.start('database.getLatestTweet');
    const res = await this.tweets.orderBy('createdAt').reverse().limit(1).toArray();
    PerfLogger.stop('database.getLatestTweet');
    return res[0];
  }

  public async getLatestTweets(limit = 10): Promise<Tweet[]> {
    PerfLogger.start('database.getLatestTweets');
    const res = await this.tweets.orderBy('createdAt').reverse().limit(limit).toArray();
    PerfLogger.stop('database.getLatestTweets');
    return res;
  }

  public async getTweetCountSinceId(tweetId: string): Promise<number> {
    PerfLogger.start('database.getTweetCountSinceId');
    const res = await this.tweets.where('id').above(tweetId).count();
    PerfLogger.stop('database.getTweetCountSinceId');
    return res;
  }

  // Lists

  public async addList(list: List): Promise<void> {
    PerfLogger.start(`database.addList ${list.id}`);
    await this.lists.put(list);
    PerfLogger.stop(`database.addList ${list.id}`);
  }

  public async addLists(lists: List[]): Promise<void> {
    PerfLogger.start('database.addLists');
    await this.lists.bulkPut(lists);
    PerfLogger.stop('database.addLists');
  }

  public async getListById(id: string): Promise<List | null> {
    PerfLogger.start(`database.getListById ${id}`);
    const list = await this.lists.get({ id });
    PerfLogger.stop(`database.getListById ${id}`);
    return list;
  }

  public async getAllLists(): Promise<List[]> {
    PerfLogger.start(`database.getAllLists`);
    const lists = await this.lists.toArray();
    PerfLogger.stop(`database.getAllLists`);
    return lists;
  }
}
