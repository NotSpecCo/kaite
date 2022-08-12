<script lang="ts">
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import NavGroup from 'onyx-ui/components/nav/NavGroup.svelte';
  import { IconSize, ViewState } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import { onMount } from 'svelte';
  import FaListUl from 'svelte-icons/fa/FaListUl.svelte';
  import { location, push } from 'svelte-spa-router';
  import type { User } from '../models';
  import { Twitter } from '../services/twitter';

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const menuItems: MenuItem[] = [
    { id: 'timeline', text: 'Timeline', route: '/timeline', icon: FaListUl },
  ];

  let user: User;
  onMount(() => new Twitter().getUser().then((res) => (user = res)));
</script>

<NavGroup groupId="app-menu">
  <div class="header">
    <img class="logo" src="/images/icon_112.png" alt="" />
    <div class="app-name">Kaite</div>
  </div>
  <div class="scroller" data-nav-scroller>
    <ListItem
      imageUrl={user?.avatarUrl}
      imageStyle="circle"
      imageSize={IconSize.Small}
      primaryText="My Profile"
      navi={{
        itemId: 'profile',
        shortcutKey: getShortcutFromIndex(0),
        onSelect: () => {
          Onyx.appMenu.close();
          if ($location === '/profile') {
            updateView({ viewing: ViewState.Card });
            return;
          }
          push('/profile');
        },
      }}
    />
    {#each menuItems as item, i}
      <ListItem
        icon={item.icon}
        imageSize={IconSize.Small}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i + 1),
          onSelect: () => {
            Onyx.appMenu.close();
            if (window.location.hash.startsWith(`#${item.route}`)) {
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
