import type { NewTweet, Tweet, TwitterPoll, TwitterTweet, TwitterUser, User } from '../models';
import { AuthClient } from './authClient';
import { toTweet, toUser } from './mapper';

type ApiResponse<T> = {
  data: T;
  errors?: any[];
  includes?: {
    users?: TwitterUser[];
    polls?: TwitterPoll[];
    media?: {
      media_key: string;
      type: string;
      url: string;
      preview_image_url?: string;
    }[];
  };
};

const tweetFields = 'attachments,created_at,entities,public_metrics';
const userFields = 'profile_image_url,description,location,public_metrics';
const pollFields = 'duration_minutes,end_datetime,id,options,voting_status';
const mediaFields = 'url,preview_image_url,media_key';
const expansions =
  'author_id,attachments.media_keys,attachments.poll_ids,entities.mentions.username,referenced_tweets.id,referenced_tweets.id.author_id';

export class Twitter {
  users = {
    getCurrent(): Promise<User> {
      const url = AuthClient.buildApiUrl('/2/users/me');
      url.searchParams.append('user.fields', userFields);

      return AuthClient.httpGet<ApiResponse<TwitterUser>>(url.toString()).then((res) =>
        toUser(res.data)
      );
    },
    getById(id: string): Promise<User> {
      const url = AuthClient.buildApiUrl(`/2/users/${id}`);
      url.searchParams.append('user.fields', userFields);

      return AuthClient.httpGet<ApiResponse<TwitterUser>>(url.toString()).then((res) =>
        toUser(res.data)
      );
    },
    async getHomeTimeline(sinceId?: string): Promise<Tweet[]> {
      const url = AuthClient.buildApiUrl(
        `/2/users/${AuthClient.user.id}/timelines/reverse_chronological`
      );
      url.searchParams.append('tweet.fields', tweetFields);
      url.searchParams.append('user.fields', userFields);
      url.searchParams.append('poll.fields', pollFields);
      url.searchParams.append('media.fields', mediaFields);
      url.searchParams.append('expansions', expansions);

      if (sinceId) {
        url.searchParams.append('since_id', sinceId);
      }

      const res = await AuthClient.httpGet<ApiResponse<TwitterTweet[]>>(url.toString());
      return (
        res.data?.map((a) =>
          toTweet(a, {
            hashtags: a.entities?.hashtags ?? [],
            urls: a.entities?.urls ?? [],
            mentions: a.entities?.mentions ?? [],
            users: res.includes.users ?? [],
            media: res.includes.media ?? [],
            polls: res.includes.polls ?? [],
          })
        ) ?? []
      );
    },
    async getTweets(userId: string, sinceId?: string): Promise<Tweet[]> {
      const url = AuthClient.buildApiUrl(`/2/users/${userId}/tweets`);
      url.searchParams.append('tweet.fields', tweetFields);
      url.searchParams.append('user.fields', userFields);
      url.searchParams.append('poll.fields', pollFields);
      url.searchParams.append('media.fields', mediaFields);
      url.searchParams.append('expansions', expansions);
      url.searchParams.append('max_results', '100');

      if (sinceId) {
        url.searchParams.append('since_id', sinceId);
      }

      const res = await AuthClient.httpGet<ApiResponse<TwitterTweet[]>>(url.toString());

      return res.data
        ? res.data.map((a) =>
            toTweet(a, {
              hashtags: a.entities?.hashtags ?? [],
              urls: a.entities?.urls ?? [],
              mentions: a.entities?.mentions ?? [],
              users: res.includes.users ?? [],
              media: res.includes.media ?? [],
              polls: res.includes.polls ?? [],
            })
          )
        : [];
    },
    async getMentions(userId: string, sinceId?: string): Promise<Tweet[]> {
      const url = AuthClient.buildApiUrl(`/2/users/${userId}/mentions`);
      url.searchParams.append('tweet.fields', tweetFields);
      url.searchParams.append('user.fields', userFields);
      url.searchParams.append('poll.fields', pollFields);
      url.searchParams.append('media.fields', mediaFields);
      url.searchParams.append('expansions', expansions);
      url.searchParams.append('max_results', '100');

      if (sinceId) {
        url.searchParams.append('since_id', sinceId);
      }

      const res = await AuthClient.httpGet<ApiResponse<TwitterTweet[]>>(url.toString());

      return res.data
        ? res.data.map((a) =>
            toTweet(a, {
              hashtags: a.entities?.hashtags ?? [],
              urls: a.entities?.urls ?? [],
              mentions: a.entities?.mentions ?? [],
              users: res.includes.users ?? [],
              media: res.includes.media ?? [],
              polls: res.includes.polls ?? [],
            })
          )
        : [];
    },
    async getLikes(userId: string, sinceId?: string): Promise<Tweet[]> {
      const url = AuthClient.buildApiUrl(`/2/users/${userId}/liked_tweets`);
      url.searchParams.append('tweet.fields', tweetFields);
      url.searchParams.append('user.fields', userFields);
      url.searchParams.append('poll.fields', pollFields);
      url.searchParams.append('media.fields', mediaFields);
      url.searchParams.append('expansions', expansions);
      url.searchParams.append('max_results', '100');

      if (sinceId) {
        url.searchParams.append('since_id', sinceId);
      }

      const res = await AuthClient.httpGet<ApiResponse<TwitterTweet[]>>(url.toString());

      return res.data
        ? res.data.map((a) =>
            toTweet(a, {
              hashtags: a.entities?.hashtags ?? [],
              urls: a.entities?.urls ?? [],
              mentions: a.entities?.mentions ?? [],
              users: res.includes.users ?? [],
              media: res.includes.media ?? [],
              polls: res.includes.polls ?? [],
            })
          )
        : [];
    },
    async getBookmarks(userId: string, sinceId?: string): Promise<Tweet[]> {
      const url = AuthClient.buildApiUrl(`/2/users/${userId}/bookmarks`);
      url.searchParams.append('tweet.fields', tweetFields);
      url.searchParams.append('user.fields', userFields);
      url.searchParams.append('poll.fields', pollFields);
      url.searchParams.append('media.fields', mediaFields);
      url.searchParams.append('expansions', expansions);
      url.searchParams.append('max_results', '100');

      if (sinceId) {
        url.searchParams.append('since_id', sinceId);
      }

      const res = await AuthClient.httpGet<ApiResponse<TwitterTweet[]>>(url.toString());

      return res.data
        ? res.data.map((a) =>
            toTweet(a, {
              hashtags: a.entities?.hashtags ?? [],
              urls: a.entities?.urls ?? [],
              mentions: a.entities?.mentions ?? [],
              users: res.includes.users ?? [],
              media: res.includes.media ?? [],
              polls: res.includes.polls ?? [],
            })
          )
        : [];
    },
    async follow(userId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/following`);
      await AuthClient.httpPost(url.toString(), { target_user_id: userId });
    },
    async unfollow(userId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/following/${userId}`);
      await AuthClient.httpDelete(url.toString());
    },
  };

  tweets = {
    async getById(id: string): Promise<Tweet | null> {
      const url = AuthClient.buildApiUrl(`/2/tweets/${id}`);
      url.searchParams.append('tweet.fields', tweetFields);
      url.searchParams.append('user.fields', userFields);
      url.searchParams.append('poll.fields', pollFields);
      url.searchParams.append('media.fields', mediaFields);
      url.searchParams.append('expansions', expansions);

      const res = await AuthClient.httpGet<ApiResponse<TwitterTweet>>(url.toString());

      if (res.errors?.length > 0) return null;

      return toTweet(res.data, {
        hashtags: res.data.entities?.hashtags ?? [],
        urls: res.data.entities?.urls ?? [],
        mentions: res.data.entities?.mentions ?? [],
        users: res.includes.users ?? [],
        media: res.includes.media ?? [],
        polls: res.includes.polls ?? [],
      });
    },
    async like(tweetId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/likes`);
      await AuthClient.httpPost(url.toString(), { tweet_id: tweetId });
    },

    async unlike(tweetId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/likes/${tweetId}`);
      await AuthClient.httpDelete(url.toString());
    },

    async retweet(tweetId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/retweets`);
      await AuthClient.httpPost(url.toString(), { tweet_id: tweetId });
    },

    async undoRetweet(tweetId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/retweets/${tweetId}`);
      await AuthClient.httpDelete(url.toString());
    },

    async bookmark(tweetId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/bookmarks`);
      await AuthClient.httpPost(url.toString(), { tweet_id: tweetId });
    },

    async removeBookmark(tweetId: string): Promise<void> {
      const url = AuthClient.buildApiUrl(`/2/users/${AuthClient.user.id}/bookmarks/${tweetId}`);
      await AuthClient.httpDelete(url.toString());
    },

    async compose(tweet: NewTweet): Promise<void> {
      const body: any = {
        text: tweet.text,
        quote_tweet_id: tweet.quoteId,
      };

      if (tweet.replyId) {
        body.reply = {
          in_reply_to_tweet_id: tweet.replyId,
        };
      }

      const url = AuthClient.buildApiUrl(`/2/tweets`);
      await AuthClient.httpPost(url.toString(), body);
    },
  };
}
