<script lang="ts">
  import NavItem from 'onyx-ui/components/nav/NavItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import type { ContextMenu, Navigation } from 'onyx-ui/models';
  import type { Poll } from '../models';

  export let poll: Poll;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;

  function getTotalVotes() {
    return poll.options.reduce((acc, val) => {
      acc += val.votes;
      return acc;
    }, 0);
  }

  function getPercentage(votes: number): number {
    const totalVotes = getTotalVotes();
    if (totalVotes === 0) return 0;

    const pct = Math.round((votes / totalVotes) * 100);
    return pct;
  }
</script>

<NavItem {navi} {contextMenu}>
  <div class="root">
    <div class="options">
      {#each poll.options as option}
        <div class="option">
          <div class="bar" style="right: {100 - getPercentage(option.votes)}%" />
          <div class="text">
            <div class="label">{option.label}</div>
            <div class="percent">{`${getPercentage(option.votes)}%`}</div>
          </div>
        </div>
      {/each}
    </div>
    <Typography padding="horizontal">{getTotalVotes()} votes</Typography>
  </div>
</NavItem>

<style>
  .root {
    padding: 10px 5px;
  }
  .option {
    margin-bottom: 7px;

    position: relative;
    height: 30px;
  }

  .option > .bar {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #eaeaea;
    border-radius: 3px;
    border-left: 3px solid #eaeaea;
  }

  .option > .text {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
  }

  .label {
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
    overflow: hidden;
  }
  .percent {
    font-weight: 600;
  }
</style>
