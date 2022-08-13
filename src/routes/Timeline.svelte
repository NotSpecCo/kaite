<script lang="ts">
  import KaiOS from 'kaios-lib';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { KeyManager } from 'onyx-ui/services';
  import { registerView } from 'onyx-ui/stores/view';
  import { onDestroy, onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';
  import TweetLoader from '../components/TweetLoader.svelte';
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
    const res = await new DataService().getTweetById(id);
    if (!res) throw new Error(`No tweet found for id ${id}`);
    return res;
  }

  onMount(async () => {
    const service = new DataService();
    await service.fetchNewTimelineTweets();

    const latestTimelineId = new KaiOS.LocalStorage().getItem<string>('last_read_id');

    if (!params.tweetId && latestTimelineId) {
      replace(`/timeline/${latestTimelineId}`);
    } else if (!params.tweetId) {
      const latestTweet = await service.getLatestTweet();
      replace(`/timeline/${latestTweet.id}`);
    }
  });

  onDestroy(() => keyMan.unsubscribe());

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
        <TweetLoader tweetId={params.tweetId} />
      </CardContent>
    </Card>
  </ViewContent>
</View>
