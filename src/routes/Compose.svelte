<script lang="ts">
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import TextArea from 'onyx-ui/components/form/TextArea.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Color, DataStatus } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { DataService } from '../services/data';

  let value: string = '';
  let working = false;

  async function sendTweet() {
    console.log('sendTweet');
    working = true;
    await new DataService()
      .composeTweet(value)
      .then(() =>
        Onyx.toaster.show({
          type: 'success',
          title: 'Tweet sent!',
        })
      )
      .catch(() =>
        Onyx.toaster.show({
          type: 'error',
          title: 'Failed to send!',
        })
      );
    working = false;
    value = '';
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
          placeholder="What's happening?"
          disabled={working}
          {value}
          onChange={(val) => (value = val)}
        />
        <Button
          title="Tweet"
          color={Color.Accent}
          disabled={working || !value}
          navi={{
            itemId: 'submit',
            onSelect: () => sendTweet(),
          }}
        />
      </CardContent>
    </Card>
  </ViewContent>
</View>
