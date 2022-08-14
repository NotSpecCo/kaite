<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import TweetLoader from '../components/TweetLoader.svelte';

  export let params: { tweetId: string };
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="View Tweet" />
      <CardContent>
        <TweetLoader tweetId={params.tweetId} />
      </CardContent>
    </Card>
  </ViewContent>
</View>
