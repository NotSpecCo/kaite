<script lang="ts">
  import NavItem from 'onyx-ui/components/nav/NavItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import type { ContextMenu, Navigation } from 'onyx-ui/models';
  import { updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import type { Tweet } from '../models';
  import { DataService } from '../services/data';

  export let tweetId: string;
  export let isQuote = false;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;

  let getData: Promise<Tweet>;

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });

  $: if (tweetId) {
    getData = new DataService().getTweetById(tweetId);
  }
</script>

<NavItem {navi} {contextMenu}>
  {#await getData}
    <Typography>Loading...</Typography>
  {:then tweet}
    {#if tweet}
      <div class="root" class:quote={isQuote}>
        <div class="header">
          <img src={tweet.author.avatarUrl} alt="" class="avatar" />
          <div class="author-name">@{tweet.author.username}</div>
        </div>
        <div class="text">
          {@html tweet.htmlText}
        </div>
      </div>
    {/if}
  {:catch err}
    <Typography align="center">{err.message}</Typography>
  {/await}
</NavItem>

<style>
  .root {
    padding: 5px;
  }
  .root.quote {
    background: rgba(0, 0, 0, 0.05);
    margin: 10px;
    border-radius: 10px;
    border: 1px solid var(--divider-color);
  }

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
  }

  .avatar {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .author-name {
    margin-right: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
