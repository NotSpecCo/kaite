import KaiOS from 'kaios-lib';
import type { TwitterTokens, TwitterUser } from '../models';

type AuthenticatedUser = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  description: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
};

type AuthConfig = {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
};

type HttpOptions = {
  useAuth?: boolean;
  contentType?: string;
  responseType?: 'json' | 'text' | 'blob';
};

type ApiResponse<T> = {
  data: T;
  errors: any[];
};

export class AuthClient {
  private static config: AuthConfig = {
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

  // Helpers

  public static buildApiUrl(path: string): URL {
    return new URL(`${this.config.baseUrl}${path}`);
  }

  // User

  private static _user: AuthenticatedUser | null = null;
  public static get user() {
    return this._user || new KaiOS.LocalStorage().getItem('authenticated_user') || null;
  }
  private static set user(val: AuthenticatedUser | null) {
    this._user = val;
    new KaiOS.LocalStorage().setItem('authenticated_user', val);
  }

  public static async login(tokens: TwitterTokens): Promise<void> {
    const formattedTokens = {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(new Date().valueOf() + tokens.expires_in * 1000).toISOString(),
    };

    // Temporarily set user tokens so GET succeeds
    this.user = { ...formattedTokens } as AuthenticatedUser;

    const url = new URL(`${this.config.baseUrl}/2/users/me`);
    url.searchParams.append('user.fields', 'profile_image_url,description,location,public_metrics');
    const user = await this.httpGet<ApiResponse<TwitterUser>>(url.toString()).catch(
      () => (this.user = null)
    );

    this.user = {
      id: user.data.id,
      username: user.data.username,
      name: user.data.name,
      avatarUrl: user.data.profile_image_url,
      description: user.data.description,
      ...formattedTokens,
    };
  }

  public static async logout(): Promise<void> {
    console.log('logout');
    this.user = null;
  }

  public static async getUser(): Promise<AuthenticatedUser> {
    if (!this.user) {
      throw new Error('User is not defined');
    }

    if (this.user.expiresAt <= new Date().toISOString()) {
      console.log('Refreshing tokens');
      await this.refreshTokens();
    }

    return this.user;
  }

  // Authentication

  public static buildLoginUrl(): string {
    const url = new URL('https://twitter.com/i/oauth2/authorize');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', this.config.clientId);
    url.searchParams.append('redirect_uri', this.config.redirectUri);
    url.searchParams.append(
      'scope',
      'tweet.read tweet.write offline.access users.read follows.read follows.write like.read like.write list.read bookmark.read bookmark.write'
    );
    url.searchParams.append('state', 'state');
    url.searchParams.append('code_challenge', 'challenge');
    url.searchParams.append('code_challenge_method', 'plain');

    return url.toString();
  }

  static async getTokensFromCode(code: string): Promise<void> {
    var body = new URLSearchParams();
    body.append('code', code);
    body.append('grant_type', 'authorization_code');
    body.append('client_id', this.config.clientId);
    body.append('redirect_uri', this.config.redirectUri);
    body.append('code_verifier', 'challenge');

    console.log('body', body);

    const tokens = await this.httpPost<TwitterTokens>(
      `${this.config.baseUrl}/2/oauth2/token`,
      body,
      {
        useAuth: false,
        contentType: 'application/x-www-form-urlencoded',
      }
    );

    await this.login(tokens);
  }

  private static async refreshTokens(): Promise<void> {
    if (!this.user) throw new Error('User is not defined');

    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('refresh_token', this.user.refreshToken);
    body.append('client_id', this.config.clientId);

    const tokens = await this.httpPost<TwitterTokens>(
      `${this.config.baseUrl}/2/oauth2/token`,
      body,
      {
        useAuth: false,
        contentType: 'application/x-www-form-urlencoded',
      }
    );

    this.login(tokens);
  }

  // HTTP Methods

  static httpGet<T>(url: string, options?: HttpOptions): Promise<T> {
    const opts: HttpOptions = {
      useAuth: options?.useAuth ?? true,
      contentType: options?.contentType ?? 'application/json',
      responseType: options?.responseType ?? 'json',
    };

    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xhr: XMLHttpRequest = new (XMLHttpRequest as any)({
        mozSystem: true,
      });
      if (options?.responseType === 'blob') {
        xhr.responseType = 'blob';
      }
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject({
            statusCode: xhr.status,
            message: `Failed to GET ${url}`,
          });
        }

        if (opts?.responseType === 'text') {
          resolve(xhr.response);
        } else {
          resolve(JSON.parse(xhr.response));
        }
      });
      xhr.addEventListener('error', () => reject({ message: `Failed to GET ${url}` }));
      xhr.open('GET', url, true);
      if (opts?.useAuth) {
        const user = await this.getUser();
        xhr.setRequestHeader('Authorization', `Bearer ${user.accessToken}`);
      }
      if (opts?.contentType) {
        xhr.setRequestHeader('Content-Type', opts.contentType);
      }
      xhr.send();
    });
  }

  static httpPost<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
    const opts: HttpOptions = {
      useAuth: options?.useAuth ?? true,
      contentType: options?.contentType ?? 'application/json',
      responseType: options?.responseType ?? 'json',
    };

    return new Promise(async (resolve, reject) => {
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
      if (opts?.useAuth) {
        const user = await this.getUser();
        xhr.setRequestHeader('Authorization', `Bearer ${user.accessToken}`);
      }
      if (opts?.contentType) {
        xhr.setRequestHeader('Content-Type', opts.contentType);
      }
      xhr.send(opts.contentType === 'application/json' ? JSON.stringify(body) : body);
    });
  }

  static httpDelete<T>(url: string, options?: HttpOptions): Promise<T> {
    const opts: HttpOptions = {
      useAuth: options?.useAuth ?? true,
      contentType: options?.contentType ?? 'application/json',
      responseType: options?.responseType ?? 'json',
    };

    return new Promise(async (resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xhr: XMLHttpRequest = new (XMLHttpRequest as any)({
        mozSystem: true,
      });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject({
            statusCode: xhr.status,
            message: `Failed to DELETE ${url}`,
          });
        }

        resolve(JSON.parse(xhr.response));
      });
      xhr.addEventListener('error', () => reject({ message: `Failed to DELETE ${url}` }));
      xhr.open('DELETE', url, true);
      if (opts?.useAuth) {
        const user = await this.getUser();
        xhr.setRequestHeader('Authorization', `Bearer ${user.accessToken}`);
      }
      if (opts?.contentType) {
        xhr.setRequestHeader('Content-Type', opts.contentType);
      }
      xhr.send();
    });
  }
}
