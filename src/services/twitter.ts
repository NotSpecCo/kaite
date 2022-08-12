import KaiOS from 'kaios-lib';
import type { Tweet, User } from '../models';
import { toTweet } from './mapper';

type Config = {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
};

export type Tokens = {
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiresAt: string | null;
};

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

export type TwitterTweet = {
  attachments: {
    media_keys: string[];
  };
  author_id: string;
  created_at: string;
  entities?: {
    hashtags?: {
      end: number;
      start: number;
      tag: string;
    }[];
    urls?: {
      end: number;
      start: number;
      url: string;
      display_url: string;
    }[];
  };
  id: string;
  public_metrics: {
    like_count: number;
    quote_count: number;
    reply_count: number;
    retweet_count: number;
  };
  text: string;
};

type ApiResponse<T> = {
  data: T;
};

export class Twitter {
  private config: Config;

  constructor() {
    this.config = {
      clientId: 'ZGVuQTZibjJIeWJsRGs2RnZkQm86MTpjaQ',
      baseUrl:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8100/https://api.twitter.com'
          : 'https://api.twitter.com',
      redirectUri:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000'
          : 'https://dev.nothing.kaite/oauth',
    };
  }

  async isLoggedIn(): Promise<boolean> {
    const user = await this.getUser();
    return !!user;
  }

  getConfig(): Config {
    return this.config;
  }

  setConfig(config: Partial<Config>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  async setUser(tokens: Tokens): Promise<User> {
    new KaiOS.LocalStorage().setItem('twitter_user', { ...tokens, id: 0, name: '', username: '' });

    const user = await this.getCurrentUser();
    const result: User = {
      ...tokens,
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.profile_image_url?.replace('_normal.jpg', '_200x200.jpg'),
      description: user.description,
      location: user.location,
      createdAt: user.created_at,
      followersCount: user.public_metrics.followers_count,
      followingCount: user.public_metrics.following_count,
      tweetCount: user.public_metrics.tweet_count,
      listedCount: user.public_metrics.listed_count,
    };

    new KaiOS.LocalStorage().setItem('twitter_user', result);

    return result;
  }

  async getUser(): Promise<User | null> {
    let user = new KaiOS.LocalStorage().getItem<User>('twitter_user');
    if (!user) return null;

    const now = new Date().toISOString();
    if (now >= user.tokenExpiresAt) {
      const tokens = await this.refreshTokens(user);
      user = await this.setUser(tokens);
    }

    return user;
  }

  async fetchTokensFromCode(code: string): Promise<Tokens> {
    var body = new URLSearchParams();
    body.append('code', code);
    body.append('grant_type', 'authorization_code');
    body.append('client_id', this.config.clientId);
    body.append('redirect_uri', this.config.redirectUri);
    body.append('code_verifier', 'challenge');

    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xhr: XMLHttpRequest = new (XMLHttpRequest as any)({
        mozSystem: true,
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject({
            statusCode: xhr.status,
            message: `Failed to fetch tokens from code`,
          });
        }

        const response = JSON.parse(xhr.response);
        const result: Tokens = {
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          tokenExpiresAt: new Date(new Date().valueOf() + response.expires_in * 1000).toISOString(),
        };
        resolve(result);
      });
      xhr.addEventListener('error', (err) =>
        reject({ message: `Failed to fetch tokens from code` })
      );
      xhr.open('POST', `${this.config.baseUrl}/2/oauth2/token`, true);
      xhr.setRequestHeader('Content-Type', `application/x-www-form-urlencoded`);
      xhr.send(body);
    });
  }

  private async refreshTokens(tokens: Tokens): Promise<Tokens> {
    var body = new URLSearchParams();
    body.append('refresh_token', tokens.refreshToken);
    body.append('grant_type', 'refresh_token');
    body.append('client_id', this.config.clientId);

    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xhr: XMLHttpRequest = new (XMLHttpRequest as any)({
        mozSystem: true,
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject({
            statusCode: xhr.status,
            message: `Failed to refresh tokens`,
          });
        }

        const response = JSON.parse(xhr.response);
        const result: Tokens = {
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          tokenExpiresAt: new Date(new Date().valueOf() + response.expires_in * 1000).toISOString(),
        };
        resolve(result);
      });
      xhr.addEventListener('error', () => reject({ message: `Failed to refresh tokens` }));
      xhr.open('POST', `${this.config.baseUrl}/2/oauth2/token`, true);
      xhr.setRequestHeader('Content-Type', `application/x-www-form-urlencoded`);
      xhr.send(body);
    });
  }

  private httpGet<T>(url: string, responseType: 'json' | 'text' | 'blob' = 'json'): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const tokens = await this.getUser();
      if (!tokens) {
        console.error('Not logged in!');
        return reject('Not logged in!');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xhr: XMLHttpRequest = new (XMLHttpRequest as any)({
        mozSystem: true,
      });
      if (responseType === 'blob') {
        xhr.responseType = 'blob';
      }
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject({
            statusCode: xhr.status,
            message: `Failed to GET ${url}`,
          });
        }

        if (responseType === 'json') {
          resolve(JSON.parse(xhr.response));
        } else {
          resolve(xhr.response);
        }
      });
      xhr.addEventListener('error', () => reject({ message: `Failed to GET ${url}` }));
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.send();
    });
  }

  private httpPost<T>(url: string, body: any): Promise<ApiResponse<T>> {
    return new Promise(async (resolve, reject) => {
      const tokens = await this.getUser();
      if (!tokens) {
        console.error('Not logged in!');
        return reject('Not logged in!');
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xhr: XMLHttpRequest = new (XMLHttpRequest as any)({
        mozSystem: true,
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject({
            statusCode: xhr.status,
            message: `Failed to POST ${url}`,
          });
        }

        resolve(JSON.parse(xhr.response));
      });
      xhr.addEventListener('error', () => reject({ message: `Failed to POST ${url}` }));
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.send(body);
    });
  }

  async getCurrentUser(): Promise<TwitterUser> {
    const url = new URL(`${this.config.baseUrl}/2/users/me`);
    url.searchParams.append('user.fields', 'profile_image_url,description,location,public_metrics');

    const res = await this.httpGet<ApiResponse<TwitterUser>>(url.toString());
    return res.data;
  }

  async getTimeline(sinceId?: string): Promise<Tweet[]> {
    const url = new URL(`${this.config.baseUrl}/2/users/219060435/timelines/reverse_chronological`);
    url.searchParams.append('tweet.fields', 'attachments,created_at,entities,public_metrics');
    url.searchParams.append('user.fields', 'id,profile_image_url,name,username');
    url.searchParams.append(
      'poll.fields',
      'duration_minutes,end_datetime,id,options,voting_status'
    );
    url.searchParams.append('media.fields', 'url,preview_image_url,media_key');
    url.searchParams.append('expansions', 'author_id,attachments.media_keys');

    if (sinceId) {
      url.searchParams.append('since_id', sinceId);
    }

    type Response = {
      data?: TwitterTweet[];
      includes: {
        users: TwitterUser[];
      };
    };
    const res = await this.httpGet<Response>(url.toString());

    return res.data ? res.data.map((a) => toTweet(a, res.includes.users)) : [];
  }

  async getTweet(id: string): Promise<Tweet | null> {
    const url = new URL(`${this.config.baseUrl}/2/tweets/${id}`);
    url.searchParams.append('tweet.fields', 'attachments,created_at,entities,public_metrics');
    url.searchParams.append('user.fields', 'id,profile_image_url,name,username');
    url.searchParams.append(
      'poll.fields',
      'duration_minutes,end_datetime,id,options,voting_status'
    );
    url.searchParams.append('media.fields', 'url,preview_image_url,media_key');
    url.searchParams.append('expansions', 'author_id,attachments.media_keys');

    type Response = {
      data: TwitterTweet;
      includes: {
        users: TwitterUser[];
      };
      errors?: {
        title: string;
        detail: string;
      }[];
    };
    const res = await this.httpGet<Response>(url.toString());

    if (res.errors?.length > 0) return null;

    return toTweet(res.data, res.includes.users);
  }
}
