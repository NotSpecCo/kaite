<script lang="ts">
  import { formatDistanceToNowStrict } from 'date-fns';
  import numeral from 'numeral';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import Icon from 'onyx-ui/components/icon/Icon.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import { IconSize } from 'onyx-ui/enums';
  import { KeyManager, Onyx } from 'onyx-ui/services';
  import { onDestroy, onMount } from 'svelte';
  import FaAt from 'svelte-icons/fa/FaAt.svelte';
  import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
  import FaLink from 'svelte-icons/fa/FaLink.svelte';
  import FaQuoteLeft from 'svelte-icons/fa/FaQuoteLeft.svelte';
  import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';
  import FaReply from 'svelte-icons/fa/FaReply.svelte';
  import FaRetweet from 'svelte-icons/fa/FaRetweet.svelte';
  import { push } from 'svelte-spa-router';
  import type { Tweet } from '../models';
  import { DataService } from '../services/data';
  import { settings } from '../stores/settings';
  import { DynamicImage } from '../utils';
  import ImageRow from './ImageRow.svelte';

  export let tweet: Tweet;

  const keyMan = KeyManager.subscribe({
    onSoftRightLong: () => {
      Onyx.contextMenu.open({
        title: 'Tweet',
        items: [
          {
            label: 'Like',
            onSelect: async () => {
              await new DataService().likeTweet(tweet.id);
              Onyx.contextMenu.close();
            },
          },
          {
            label: 'Unlike',
            onSelect: async () => {
              await new DataService().unlikeTweet(tweet.id);
              Onyx.contextMenu.close();
            },
          },
          {
            label: 'Retweet',
            onSelect: async () => {
              await new DataService().retweetTweet(tweet.id);
              Onyx.contextMenu.close();
            },
          },
          {
            label: 'Undo Retweet',
            onSelect: async () => {
              await new DataService().unretweetTweet(tweet.id);
              Onyx.contextMenu.close();
            },
          },
          {
            label: 'Bookmark',
            onSelect: async () => {
              await new DataService().bookmarkTweet(tweet.id);
              Onyx.contextMenu.close();
            },
          },
          {
            label: 'Remove Bookmark',
            onSelect: async () => {
              await new DataService().unbookmarkTweet(tweet.id);
              Onyx.contextMenu.close();
            },
          },
        ],
      });

      return true;
    },
  });

  onMount(() => {});
  onDestroy(() => keyMan.unsubscribe());
</script>

{#if tweet}
  <div class="root">
    <ListItem
      imageUrl={tweet.author.avatarUrl}
      imageStyle="circle"
      primaryText={tweet.author.name}
      secondaryText={`@${tweet.author.username}`}
      navi={{
        itemId: 'author',
        onSelect: () => push(`/user/${tweet.author.id}`),
      }}
      contextMenu={{
        title: tweet.author.name || `@${tweet.author.username}`,
        items: [
          {
            label: 'View Profile',
            onSelect: async () => {
              push(`/user/${tweet.author.id}`);
              Onyx.contextMenu.close();
            },
          },
          {
            label: 'Follow',
            onSelect: async () => {
              await new DataService().followUser(tweet.author.id);
              Onyx.contextMenu.close();
            },
          },
          {
            label: 'Unfollow',
            onSelect: async () => {
              await new DataService().unfollowUser(tweet.author.id);
              Onyx.contextMenu.close();
            },
          },
        ],
      }}
    />
    <div class="text-container">
      {@html tweet.htmlText}
    </div>
    {#if $settings.displayMedia && tweet.attachments?.media?.length > 0}
      {#each tweet.attachments.media as media, i}
        <ImageRow
          imageUrl={new DynamicImage(media.url).toQuality($settings.mediaQuality)}
          navi={{
            itemId: `image${i}`,
          }}
        />
      {/each}
    {/if}
    {#if $settings.timestamps === 'relative'}
      <Typography color="secondary"
        >{formatDistanceToNowStrict(new Date(tweet.createdAt), { addSuffix: true })}</Typography
      >
    {:else}
      <Typography color="secondary">{new Date(tweet.createdAt).toLocaleString()}</Typography>
    {/if}
    <div class="counts">
      <div>
        <Icon size={IconSize.Smallest}><FaReply /></Icon>
        <div class="number">{numeral(tweet.replyCount).format('0a')}</div>
      </div>
      <div>
        <Icon size={IconSize.Smallest}><FaRetweet /></Icon>
        <div class="number">{numeral(tweet.retweetCount).format('0a')}</div>
      </div>
      <div>
        <Icon size={IconSize.Smallest}><FaQuoteLeft /></Icon>
        <div class="number">{numeral(tweet.quoteCount).format('0a')}</div>
      </div>
      <div>
        <Icon size={IconSize.Smallest}><FaRegHeart /></Icon>
        <div class="number">{numeral(tweet.likeCount).format('0a')}</div>
      </div>
    </div>

    {#if $settings.displayMentions && tweet.entities?.mentions?.length > 0}
      <Divider title="Mentions" />
      {#each tweet.entities.mentions as user, i}
        <ListItem
          icon={FaAt}
          imageSize={IconSize.Small}
          primaryText={user.username}
          navi={{
            itemId: `mention${i}`,
          }}
          contextMenu={{
            title: `@${user.username}`,
            items: [
              {
                label: 'View Profile',
                onSelect: async () => {
                  push(`/user/${user.id}`);
                  Onyx.contextMenu.close();
                },
              },
              {
                label: 'Follow',
                onSelect: async () => {
                  await new DataService().followUser(user.id);
                  Onyx.contextMenu.close();
                },
              },
              {
                label: 'Unfollow',
                onSelect: async () => {
                  await new DataService().unfollowUser(user.id);
                  Onyx.contextMenu.close();
                },
              },
            ],
          }}
        />
      {/each}
    {/if}
    {#if $settings.displayLinks && tweet.entities?.urls?.length > 0}
      <Divider title="Links" />
      {#each tweet.entities.urls as link, i}
        <ListItem
          icon={FaLink}
          imageSize={IconSize.Small}
          primaryText={link.display_url}
          secondaryText={link.title}
          navi={{
            itemId: `link${i}`,
          }}
        />
      {/each}
    {/if}
    {#if $settings.displayHashtags && tweet.entities?.hashtags?.length > 0}
      <Divider title="Hashtags" />
      {#each tweet.entities.hashtags as hashtag, i}
        <ListItem
          icon={FaHashtag}
          imageSize={IconSize.Small}
          primaryText={`${hashtag.tag}`}
          navi={{
            itemId: `hashtag${i}`,
          }}
        />
      {/each}
    {/if}
  </div>
{/if}

<style>
  .counts {
    display: flex;
    justify-content: space-between;
    padding: 5px 7px;
  }
  .counts > div {
    display: flex;
    align-items: center;
  }

  .counts .number {
    margin-left: 5px;
  }

  .text-container {
    padding: 5px;
    white-space: pre-line;
  }
  :global(.tweet-entity-hashtag) {
    color: var(--accent-color);
  }
  :global(.tweet-entity-url) {
    display: inline;
    white-space: normal;
    word-break: break-all;
    color: var(--accent-color);
  }
  :global(.tweet-entity-mention) {
    color: var(--accent-color);
  }
</style>
