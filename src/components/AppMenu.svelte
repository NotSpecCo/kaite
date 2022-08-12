<script lang="ts">
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import NavGroup from 'onyx-ui/components/nav/NavGroup.svelte';
  import { IconSize, ViewState } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import FaListUl from 'svelte-icons/fa/FaListUl.svelte';
  import { push } from 'svelte-spa-router';

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const menuItems: MenuItem[] = [
    { id: 'timeline', text: 'Timeline', route: '/timeline', icon: FaListUl },
  ];
</script>

<NavGroup groupId="app-menu">
  <div class="header">
    <img class="logo" src="/images/icon_112.png" alt="" />
    <div class="app-name">Kaite</div>
  </div>
  <div class="scroller" data-nav-scroller>
    {#each menuItems as item, i}
      <ListItem
        icon={item.icon}
        imageSize={IconSize.Small}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i),
          onSelect: () => {
            Onyx.appMenu.close();
            if (location.hash.startsWith(`#${item.route}`)) {
              updateView({ viewing: ViewState.Card });
              return;
            }
            push(item.route);
          },
        }}
      />
    {/each}
  </div>
</NavGroup>

<style>
  :global([data-nav-group-id='app-menu']) {
    border-radius: 0 var(--radius) var(--radius) 0;
    background-color: var(--card-color);
    color: var(--text-color);
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .header {
    padding: 10px;
    font-weight: var(--bold-font-weight);
    color: var(--accent-color);
    display: flex;
    align-items: center;
    font-size: 1.75rem;
  }
  .header > .app-name {
    margin-left: 5px;
  }
  .scroller {
    overflow-y: auto;
    flex: 1;
  }
  .logo {
    height: 32px;
    width: 32px;
  }
</style>
