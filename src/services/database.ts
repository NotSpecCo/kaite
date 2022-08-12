import Dexie from 'dexie';
import type { Tweet } from '../models';

export class Database extends Dexie {
  tweets: Dexie.Table<Tweet, string>;

  constructor() {
    super('kaite');

    this.version(1).stores({
      tweets: '&id, createdAt',
    });

    this.tweets = this.table('tweets');
  }

  // Tweets

  public async addTweet(tweet: Tweet): Promise<void> {
    const existing = await this.getTweet(tweet.id);
    if (existing) return;

    await this.tweets.add(tweet);
  }

  public async addTweets(tweets: Tweet[]): Promise<void> {
    const latestTweet = await this.getLatestTweet();

    const newTweets = latestTweet
      ? tweets.filter((a) => a.createdAt > latestTweet.createdAt)
      : tweets;
    // console.log(`${newTweets.length} new tweets out of ${tweets.length}`);

    for (const tweet of newTweets) {
      await this.addTweet(tweet);
    }
  }

  public async getTweet(id: string): Promise<Tweet | null> {
    const tweet = await this.tweets.get({ id });
    if (!tweet) return null;

    const tweets = await this.tweets.orderBy('createdAt').reverse().toArray();
    const index = tweets.findIndex((a) => a.id === tweet.id);

    tweet.nextTweetId = tweets[index - 1]?.id;
    tweet.prevTweetId = tweets[index + 1]?.id;

    return tweet;
  }

  public async getLatestTweet(): Promise<Tweet | undefined> {
    const res = await this.tweets.orderBy('createdAt').reverse().limit(1).toArray();
    return res[0];
  }

  public async getLatestTweets(limit = 10): Promise<Tweet[]> {
    const res = await this.tweets.orderBy('createdAt').reverse().limit(limit).toArray();
    return res;
  }
}
