<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import InputRow from 'onyx-ui/components/form/InputRow.svelte';
  import TextArea from 'onyx-ui/components/form/TextArea.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Color, DataStatus } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { querystring, replace } from 'svelte-spa-router';
  import InlineTweetLoader from '../components/InlineTweetLoader.svelte';
  import type { NewTweet } from '../models';
  import { DataService } from '../services/data';
  import { parseQueryString } from '../utils';

  let query = parseQueryString($querystring);
  let tweet: NewTweet = { text: '', replyId: query.replyId, quoteId: query.quoteId };
  let sending = false;

  async function sendTweet() {
    sending = true;
    await new DataService()
      .composeTweet(tweet)
      .then(() => {
        Onyx.toaster.show({
          type: 'success',
          title: 'Tweet sent!',
        });
        reset();
      })
      .catch(() =>
        Onyx.toaster.show({
          type: 'error',
          title: 'Failed to send!',
        })
      );
    sending = false;
  }

  function reset() {
    replace('/compose');
    tweet = { text: '' };
  }

  function addPoll() {
    tweet.poll = {
      options: ['', ''],
      duration: 1440,
    };
  }

  function removePoll() {
    tweet.poll = null;
  }

  function updatePollOption(index: number, text: string) {
    tweet.poll.options[index] = text;
  }

  function updatePollDuration(hours: number) {
    const newTweet = { ...tweet };
    newTweet.poll.duration = hours * 60;

    tweet = newTweet;
  }

  function addOption() {
    if (tweet.poll.options.length >= 4) {
      return;
    }

    const newTweet = { ...tweet };
    newTweet.poll.options.push('');

    tweet = newTweet;
  }

  function removeOption() {
    if (tweet.poll.options.length === 2) {
      return;
    }

    const newTweet = { ...tweet };
    newTweet.poll.options.pop();

    tweet = newTweet;
  }

  function validatePoll(): boolean {
    if (!tweet.poll) return true;

    if (tweet.poll.options.length < 2) return false;
    if (tweet.poll.options.some((a) => !a)) return false;

    return true;
  }

  registerView({});

  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Compose" />
      <CardContent>
        <TextArea
          placeholder={tweet.poll ? 'Ask a question...' : "What's happening?"}
          disabled={sending}
          value={tweet.text}
          onChange={(val) => (tweet.text = val)}
        />
        {#if tweet.quoteId}
          <InlineTweetLoader tweetId={tweet.quoteId} isQuote={true} navi={{ itemId: 'quote' }} />
        {/if}

        {#if tweet.poll}
          <Divider title="Poll" />
          <div class="poll">
            {#each tweet.poll.options as option, i}
              <InputRow
                label={`#${i + 1}`}
                value={option}
                onChange={(val) => updatePollOption(i, val)}
                placeholder={`Choice ${i + 1}`}
              />
            {/each}
            <InputRow
              label="Duration (hours)"
              value={(tweet.poll.duration / 60).toString()}
              onChange={(val) => updatePollDuration(Number(val))}
            />
          </div>
          <Button
            title="Remove Option"
            color={Color.Secondary}
            disabled={tweet.poll.options.length <= 2}
            navi={{
              itemId: 'removeOption',
              onSelect: () => removeOption(),
            }}
          />
          <Button
            title="Add Option"
            color={Color.Secondary}
            disabled={tweet.poll.options.length >= 4}
            navi={{
              itemId: 'addOption',
              onSelect: () => addOption(),
            }}
          />
          <Button
            title="Remove Poll"
            color={Color.Primary}
            navi={{
              itemId: 'removePoll',
              onSelect: () => removePoll(),
            }}
          />
        {/if}
        {#if tweet.replyId}
          <Divider title="Replying To" />
          <InlineTweetLoader tweetId={tweet.replyId} navi={{ itemId: 'reply' }} />
        {/if}
        <Divider title="Actions" />
        {#if !tweet.poll}
          <Button
            title="Add Poll"
            color={Color.Primary}
            disabled={!!tweet.quoteId}
            navi={{
              itemId: 'addPoll',
              onSelect: () => addPoll(),
            }}
          />
        {/if}
        <Button
          title="Discard Tweet"
          color={Color.Primary}
          navi={{
            itemId: 'discard',
            onSelect: () => reset(),
          }}
        />
        <Button
          title="Send Tweet"
          color={Color.Accent}
          disabled={sending || !tweet.text || !validatePoll()}
          navi={{
            itemId: 'submit',
            onSelect: () => sendTweet(),
          }}
        />
      </CardContent>
    </Card>
  </ViewContent>
</View>
