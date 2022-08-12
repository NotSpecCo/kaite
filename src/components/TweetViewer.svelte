<script lang="ts">
  import numeral from 'numeral';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import Icon from 'onyx-ui/components/icon/Icon.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import { IconSize } from 'onyx-ui/enums';
  import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
  import FaLink from 'svelte-icons/fa/FaLink.svelte';
  import FaQuoteLeft from 'svelte-icons/fa/FaQuoteLeft.svelte';
  import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';
  import FaReply from 'svelte-icons/fa/FaReply.svelte';
  import FaRetweet from 'svelte-icons/fa/FaRetweet.svelte';
  import { push } from 'svelte-spa-router';
  import type { Tweet } from '../models';

  export let tweet: Tweet;
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
    />
    <Typography>{tweet.text}</Typography>
    <Typography color="secondary">{new Date(tweet.createdAt).toLocaleString()}</Typography>
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
    {#if tweet.entities?.urls?.length > 0}
      <Divider title="Links" />
      {#each tweet.entities.urls as link, i}
        <ListItem
          icon={FaLink}
          imageSize={IconSize.Small}
          primaryText={link.url}
          secondaryText={link.display_url}
          navi={{
            itemId: `link${i}`,
          }}
        />
      {/each}
    {/if}
    {#if tweet.entities?.hashtags?.length > 0}
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
  .root {
  }

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
</style>
