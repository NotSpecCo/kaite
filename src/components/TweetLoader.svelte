<script lang="ts">
  import Typography from 'onyx-ui/components/Typography.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { DataService } from '../services/data';
  import TweetViewer from './TweetViewer.svelte';

  export let tweetId: string;

  let getData;

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });

  $: if (tweetId) {
    getData = new DataService().getTweetById(tweetId);
  }
</script>

{#await getData}
  <Typography>Loading...</Typography>
{:then tweet}
  {#if tweet}
    <TweetViewer {tweet} />
  {/if}
{:catch err}
  <Typography align="center">{err.message}</Typography>
{/await}
