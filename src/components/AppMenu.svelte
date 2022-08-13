<script lang="ts">
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import NavGroup from 'onyx-ui/components/nav/NavGroup.svelte';
  import { IconSize, ViewState } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import FaAt from 'svelte-icons/fa/FaAt.svelte';
  import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
  import FaListUl from 'svelte-icons/fa/FaListUl.svelte';
  import FaRegComment from 'svelte-icons/fa/FaRegComment.svelte';
  import FaSignInAlt from 'svelte-icons/fa/FaSignInAlt.svelte';
  import FaSignOutAlt from 'svelte-icons/fa/FaSignOutAlt.svelte';
  import FaUser from 'svelte-icons/fa/FaUser.svelte';
  import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
  import { push } from 'svelte-spa-router';
  import type { User } from '../models';
  import { DataService } from '../services/data';

  let user: User = new DataService().getStoredUser();

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const items: MenuItem[] = user
    ? [
        { id: 'timeline', text: 'Timeline', route: '/timeline', icon: FaListUl },
        { id: 'profile', text: 'Profile', route: `/user/${user.id}`, icon: FaUser },
        { id: 'tweets', text: 'Tweets', route: `/user/${user.id}/tweets`, icon: FaRegComment },
        { id: 'mentions', text: 'Mentions', route: `/user/${user.id}/mentions`, icon: FaAt },
        { id: 'likes', text: 'Likes', route: `/user/${user.id}/likes`, icon: FaHeart },
        { id: 'settings', text: 'Settings', route: `/settings/display`, icon: IoIosSettings },
        { id: 'logout', text: 'Log Out', route: `/logout`, icon: FaSignOutAlt },
      ]
    : [{ id: 'login', text: 'Log In', route: '/login', icon: FaSignInAlt }];
</script>

<NavGroup groupId="app-menu">
  <div class="header">
    <img class="logo" src="/images/icon_112.png" alt="" />
    <div class="app-name">Kaite</div>
  </div>
  <div class="scroller" data-nav-scroller>
    <ListItem
      icon={items[0].icon}
      imageSize={IconSize.Small}
      primaryText={items[0].text}
      navi={{
        itemId: items[0].id,
        shortcutKey: getShortcutFromIndex(0),
        onSelect: () => {
          Onyx.appMenu.close();
          if (window.location.hash.startsWith(`#${items[0].route}`)) {
            updateView({ viewing: ViewState.Card });
            return;
          }
          push(items[0].route);
        },
      }}
    />
    <Divider title="My Stuff" />
    {#each items.slice(1, 5) as item, i}
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
    <Divider title="System" />
    {#each items.slice(5) as item, i}
      <ListItem
        icon={item.icon}
        imageSize={IconSize.Small}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i + 5),
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
