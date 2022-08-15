<script lang="ts">
  import Icon from 'onyx-ui/components/icon/Icon.svelte';

  import Typography from 'onyx-ui/components/Typography.svelte';
  import { DataStatus, IconSize } from 'onyx-ui/enums';
  import { updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import FaRetweet from 'svelte-icons/fa/FaRetweet.svelte';
  import type { Tweet } from '../models';
  import { DataService } from '../services/data';
  import TweetViewer from './TweetViewer.svelte';

  export let tweetId: string;

  let getData;

  async function getTweet() {
    const result: {
      tweet?: Tweet;
      retweetedTweet?: Tweet;
    } = {};

    result.tweet = await new DataService().getTweetById(tweetId);

    if (result.tweet.retweetedTweetId) {
      result.retweetedTweet = await new DataService().getTweetById(result.tweet.retweetedTweetId);
    }

    return result;
  }

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });

  $: if (tweetId) {
    getData = getTweet();
  }
</script>

{#await getData}
  <Typography>Loading...</Typography>
{:then data}
  {#if data?.retweetedTweet}
    <div class="retweeted-by">
      <Icon size={IconSize.Small}><FaRetweet /></Icon>
      <img src={data.tweet.author.avatarUrl} alt="" class="avatar" />
      <div class="author-name">{data.tweet.author.name}</div>
    </div>
    <TweetViewer tweet={data.retweetedTweet} />
  {:else if data?.tweet}
    <TweetViewer tweet={data.tweet} />
  {/if}
{:catch err}
  <Typography align="center">{err.message}</Typography>
{/await}

<style>
  .retweeted-by {
    display: flex;
    align-items: center;
    padding: 5px;
  }
  .avatar {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    margin: 0 5px;
  }
  .author-name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
