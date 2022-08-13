import type {
  Tokens,
  Tweet,
  TwitterPoll,
  TwitterTokens,
  TwitterTweet,
  TwitterUser,
  User,
} from '../models';

type TwitterEntities = {
  hashtags: {
    tag: string;
  }[];
  urls: {
    url: string;
    display_url: string;
  }[];
  mentions: {
    id: string;
    username: string;
  }[];
  media: {
    media_key: string;
    type: string;
    url: string;
    preview_image_url?: string;
  }[];
  users: TwitterUser[];
  polls: TwitterPoll[];
};

function formatEntities(text: string, entities: TwitterEntities): string {
  let result = text;

  entities.hashtags.map((a) => {
    result = result.replace(`#${a.tag}`, `<span class='tweet-entity-hashtag'>#${a.tag}</span>`);
  });

  entities.urls.map((a) => {
    result = result.replace(a.url, `<span class='tweet-entity-url'>${a.display_url}</span>`);
  });

  entities.mentions.map((a) => {
    result = result.replace(
      `@${a.username}`,
      `<span class='tweet-entity-mention'>@${a.username}</span>`
    );
  });

  return `<div class='tweet-text'>${result}</div>`;
}

export function toTweet(source: TwitterTweet, entities: TwitterEntities): Tweet {
  const user = entities.users.find((a) => a.id === source.author_id);

  const result: Tweet = {
    id: source.id,
    author: {
      id: user.id,
      name: user.name,
      username: user.username,
      avatarUrl: user.profile_image_url,
    },
    text: source.text,
    htmlText: formatEntities(source.text, entities),
    likeCount: source.public_metrics.like_count,
    quoteCount: source.public_metrics.quote_count,
    replyCount: source.public_metrics.reply_count,
    retweetCount: source.public_metrics.retweet_count,
    createdAt: source.created_at,
    entities: {},
    attachments: {
      media: [],
    },
  };

  if (source.entities?.mentions) {
    result.entities.mentions = source.entities.mentions.map((a) => ({
      id: a.id,
      username: a.username,
    }));
  }

  if (source.entities?.hashtags) {
    result.entities.hashtags = source.entities.hashtags.map((a) => ({ tag: a.tag }));
  }

  if (source.entities?.urls) {
    result.entities.urls = source.entities.urls.map((a) => ({
      url: a.url,
      display_url: a.display_url,
      title: a.title,
      description: a.description,
    }));
  }

  if (source.attachments?.media_keys?.length > 0) {
    result.attachments.media = source.attachments.media_keys.map((key) => {
      const entity = entities.media.find((a) => a.media_key === key);
      return {
        id: entity.media_key,
        type: entity.type,
        url: entity.url || entity.preview_image_url,
      };
    });
  }

  if (source.attachments?.poll_ids?.[0]) {
    const poll = entities.polls.find((a) => a.id === source.attachments?.poll_ids?.[0]);
    result.attachments.poll = {
      id: poll.id,
      duration: poll.duration_minutes * 60,
      endsAt: poll.end_datetime,
      status: poll.voting_status,
      options: poll.options,
    };
  }

  return result;
}

export function toUser(source: TwitterUser): User {
  return {
    id: source.id,
    name: source.name,
    username: source.username,
    avatarUrl: source.profile_image_url.replace('_normal.jpg', '_200x200.jpg'),
    description: source.description,
    location: source.location,
    followersCount: source.public_metrics.followers_count,
    followingCount: source.public_metrics.following_count,
    tweetCount: source.public_metrics.tweet_count,
    listedCount: source.public_metrics.listed_count,
    createdAt: source.created_at,
  };
}

export function toTokens(source: TwitterTokens): Tokens {
  return {
    accessToken: source.access_token,
    refreshToken: source.refresh_token,
    tokenExpiresAt: new Date(new Date().valueOf() + source.expires_in * 1000).toISOString(),
  };
}
