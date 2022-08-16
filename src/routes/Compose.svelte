<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import TextArea from 'onyx-ui/components/form/TextArea.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Color, DataStatus } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { querystring, replace } from 'svelte-spa-router';
  import InlineTweetLoader from '../components/InlineTweetLoader.svelte';
  import { DataService } from '../services/data';
  import { parseQueryString } from '../utils';

  let value: string = '';
  let working = false;

  async function sendTweet() {
    console.log('sendTweet');
    working = true;
    await new DataService()
      .composeTweet({
        text: value,
        replyId: query.replyId,
        quoteId: query.quoteId,
      })
      .then(() => {
        Onyx.toaster.show({
          type: 'success',
          title: 'Tweet sent!',
        });
        replace('/compose');
        value = '';
      })
      .catch(() =>
        Onyx.toaster.show({
          type: 'error',
          title: 'Failed to send!',
        })
      );
    working = false;
  }

  registerView({});

  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
  });

  let query = parseQueryString($querystring);
  $: query = parseQueryString($querystring);
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Compose" />
      <CardContent>
        <TextArea
          placeholder="What's happening?"
          disabled={working}
          {value}
          onChange={(val) => (value = val)}
        />
        {#if query.quoteId}
          <InlineTweetLoader tweetId={query.quoteId} isQuote={true} navi={{ itemId: 'quote' }} />
        {/if}
        <Button
          title="Tweet"
          color={Color.Accent}
          disabled={working || !value}
          navi={{
            itemId: 'submit',
            onSelect: () => sendTweet(),
          }}
        />
        {#if query.replyId}
          <Typography type="titleSmall">Replying to:</Typography>
          <InlineTweetLoader tweetId={query.replyId} navi={{ itemId: 'reply' }} />
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>
