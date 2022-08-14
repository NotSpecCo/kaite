<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { KeyManager } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onDestroy, onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';
  import TweetViewer from '../components/TweetViewer.svelte';
  import type { Tweet } from '../models';
  import { DataService } from '../services/data';

  export let params: { userId: string; tweetId?: string };

  registerView({});

  const keyMan = KeyManager.subscribe({
    onArrowLeft: () => {
      const index = tweets.findIndex((a) => a.id === params.tweetId);
      const prevTweet = tweets[index + 1];
      if (prevTweet) replace(`/user/${params.userId}/bookmarks/${prevTweet.id}`);

      return true;
    },
    onArrowRight: () => {
      const index = tweets.findIndex((a) => a.id === params.tweetId);
      const nextTweet = tweets[index - 1];
      if (nextTweet) replace(`/user/${params.userId}/bookmarks/${nextTweet.id}`);

      return true;
    },
  });

  let tweets: Tweet[];

  onMount(async () => {
    tweets = await new DataService().getUserBookmarks(params.userId);
    if (tweets.length === 0) return;

    if (!params.tweetId) {
      replace(`/user/${params.userId}/bookmarks/${tweets[0].id}`);
    }

    updateView({ dataStatus: DataStatus.Loaded });
  });

  onDestroy(() => keyMan.unsubscribe());
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Bookmarks" />
      <CardContent>
        {#if tweets?.length === 0}
          <Typography align="center">No tweets</Typography>
        {:else if tweets?.length > 0}
          <TweetViewer tweet={tweets.find((a) => a.id === params.tweetId)} />
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>
