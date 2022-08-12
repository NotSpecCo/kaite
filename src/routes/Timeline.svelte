<svelte:options immutable={true} />

<script lang="ts">
  import KaiOS from 'kaios-lib';
  import numeral from 'numeral';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import Icon from 'onyx-ui/components/icon/Icon.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus, IconSize } from 'onyx-ui/enums';
  import { KeyManager } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import FaHashtag from 'svelte-icons/fa/FaHashtag.svelte';
  import FaLink from 'svelte-icons/fa/FaLink.svelte';
  import FaQuoteLeft from 'svelte-icons/fa/FaQuoteLeft.svelte';
  import FaRegHeart from 'svelte-icons/fa/FaRegHeart.svelte';
  import FaReply from 'svelte-icons/fa/FaReply.svelte';
  import FaRetweet from 'svelte-icons/fa/FaRetweet.svelte';
  import { replace } from 'svelte-spa-router';
  import { DataService } from '../services/data';

  export let params: { tweetId?: string };

  let getData;

  registerView({});

  const keyMan = KeyManager.subscribe({
    onArrowLeft: () => {
      getData.then((res) => {
        if (res.prevTweetId) {
          replace(`/timeline/${res.prevTweetId}`);
        }
      });

      return true;
    },
    onArrowRight: () => {
      getData.then((res) => {
        if (res.nextTweetId) {
          replace(`/timeline/${res.nextTweetId}`);
        }
      });
      return true;
    },
  });

  async function getTweet(id: string) {
    const res = await new DataService().getTweet(id);
    if (!res) throw new Error(`No tweet found for id ${id}`);
    return res;
  }

  onMount(async () => {
    const service = new DataService();
    await service.refreshTweets();

    const latestTimelineId = new KaiOS.LocalStorage().getItem<string>('last_read_id');

    if (!params.tweetId && latestTimelineId) {
      replace(`/timeline/${latestTimelineId}`);
    } else if (!params.tweetId) {
      const latestTweet = await service.getLatestTweet();
      replace(`/timeline/${latestTweet.id}`);
    }

    updateView({ dataStatus: DataStatus.Loaded });
  });

  $: if (params.tweetId) {
    getData = getTweet(params.tweetId);
    new KaiOS.LocalStorage().setItem('last_read_id', params.tweetId);
  }
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Timeline" />
      <CardContent>
        {#await getData}
          <Typography>Loading...</Typography>
        {:then tweet}
          {#if tweet}
            <div class="tweet">
              <ListItem
                imageUrl={tweet.author.avatarUrl}
                imageStyle="circle"
                primaryText={tweet.author.name}
                secondaryText={`@${tweet.author.username}`}
                navi={{
                  itemId: 'author',
                }}
              />
              <Typography>{tweet.text}</Typography>
              <Typography color="secondary">{new Date(tweet.createdAt).toLocaleString()}</Typography
              >
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
        {:catch err}
          <Typography align="center">{err.message}</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>

<style>
  .tweet {
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
