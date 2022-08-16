<script lang="ts">
  import NavItem from 'onyx-ui/components/nav/NavItem.svelte';
  import type { ContextMenu, Navigation } from 'onyx-ui/models';
  import { settings } from '../stores/settings';

  export let imageUrl: string;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;
</script>

<NavItem {navi} {contextMenu}>
  <div class="root">
    <img
      class="image"
      class:small={$settings.mediaSize === 'small'}
      class:medium={$settings.mediaSize === 'medium'}
      class:large={$settings.mediaSize === 'large'}
      src={imageUrl}
      alt=""
    />
  </div>
</NavItem>

<style>
  .root {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }
  .image {
    width: 75%;
    padding: 5px;
    border-radius: 12px;
  }
  .image.small {
    width: 50%;
  }
  .image.medium {
    width: 75%;
  }
  .image.large {
    width: 100%;
  }
</style>
