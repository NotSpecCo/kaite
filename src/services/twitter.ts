import KaiOS from 'kaios-lib';
import type { User } from '../models';

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
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.setRequestHeader('Content-Type', `application/x-www-form-urlencoded`);
      xhr.send(body);
    });
  }

  private httpGet<T>(
    path: string,
    responseType: 'json' | 'text' | 'blob' = 'json'
  ): Promise<ApiResponse<T>> {
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
            message: `Failed to GET ${path}`,
          });
        }

        if (responseType === 'json') {
          resolve(JSON.parse(xhr.response));
        } else {
          resolve(xhr.response);
        }
      });
      xhr.addEventListener('error', () => reject({ message: `Failed to GET ${path}` }));
      xhr.open('GET', `${this.config.baseUrl}${path}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.send();
    });
  }

  private httpPost<T>(path: string, body: any): Promise<ApiResponse<T>> {
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
            message: `Failed to POST ${path}`,
          });
        }

        resolve(JSON.parse(xhr.response));
      });
      xhr.addEventListener('error', () => reject({ message: `Failed to POST ${path}` }));
      xhr.open('POST', `${this.config.baseUrl}${path}`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.send(body);
    });
  }

  async getCurrentUser(): Promise<TwitterUser> {
    const res = await this.httpGet<TwitterUser>(
      '/2/users/me?user.fields=profile_image_url,description,location,public_metrics'
    );
    return res.data;
  }
}
