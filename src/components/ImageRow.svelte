<script lang="ts">
  import NavItem from 'onyx-ui/components/nav/NavItem.svelte';
  import type { ContextMenu, Navigation } from 'onyx-ui/models';

  export let imageUrl: string;
  export let navi: Navigation;
  export let contextMenu: ContextMenu = null;
</script>

<NavItem {navi} {contextMenu}>
  <div class="root">
    <img class="image" src={imageUrl} alt="" />
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
  }
</style>
