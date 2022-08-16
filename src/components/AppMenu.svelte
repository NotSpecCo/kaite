<script lang="ts">
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import NavGroup from 'onyx-ui/components/nav/NavGroup.svelte';
  import { IconSize, ViewState } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { updateView } from 'onyx-ui/stores/view';
  import { getShortcutFromIndex } from 'onyx-ui/utils/getShortcutFromIndex';
  import FaAt from 'svelte-icons/fa/FaAt.svelte';
  import FaBookmark from 'svelte-icons/fa/FaBookmark.svelte';
  import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
  import FaListUl from 'svelte-icons/fa/FaListUl.svelte';
  import FaPenFancy from 'svelte-icons/fa/FaPenFancy.svelte';
  import FaRegComment from 'svelte-icons/fa/FaRegComment.svelte';
  import FaSignInAlt from 'svelte-icons/fa/FaSignInAlt.svelte';
  import FaUser from 'svelte-icons/fa/FaUser.svelte';
  import IoIosSettings from 'svelte-icons/io/IoIosSettings.svelte';
  import { push } from 'svelte-spa-router';
  import { AuthClient } from '../services/authClient';

  let user = AuthClient.user;

  type MenuItem = {
    id: string;
    text: string;
    route: string;
    icon: any | null;
  };
  const items: MenuItem[] = user
    ? [
        { id: 'compose', text: 'Compose', route: '/compose', icon: FaPenFancy },
        { id: 'timeline', text: 'Timeline', route: '/timeline', icon: FaListUl },
        { id: 'profile', text: 'Profile', route: `/user/${user.id}`, icon: FaUser },
        { id: 'tweets', text: 'Tweets', route: `/user/${user.id}/tweets`, icon: FaRegComment },
        { id: 'mentions', text: 'Mentions', route: `/user/${user.id}/mentions`, icon: FaAt },
        { id: 'likes', text: 'Likes', route: `/user/${user.id}/likes`, icon: FaHeart },
        {
          id: 'bookmarks',
          text: 'Bookmarks',
          route: `/user/${user.id}/bookmarks`,
          icon: FaBookmark,
        },
        {
          id: 'lists',
          text: 'Lists',
          route: `/user/${user.id}/lists`,
          icon: FaListUl,
        },
        { id: 'settings', text: 'Settings', route: `/settings/display`, icon: IoIosSettings },
      ]
    : [{ id: 'login', text: 'Log In', route: '/login', icon: FaSignInAlt }];
</script>

<NavGroup groupId="app-menu">
  <div class="header">
    <img class="logo" src="/images/icon_112.png" alt="" />
    <div class="app-name">Kaite</div>
    {#if user}
      <img class="avatar" src={user.avatarUrl} alt="" />
    {/if}
  </div>
  <div class="scroller" data-nav-scroller>
    {#each items.slice(0, 2) as item, i}
      <ListItem
        icon={items[i].icon}
        imageSize={IconSize.Smallest}
        primaryText={items[i].text}
        navi={{
          itemId: items[i].id,
          shortcutKey: getShortcutFromIndex(i),
          onSelect: () => {
            Onyx.appMenu.close();
            if (window.location.hash.startsWith(`#${items[i].route}`)) {
              updateView({ viewing: ViewState.Card });
              return;
            }
            push(items[i].route);
          },
        }}
      />
    {/each}
    <Divider title="My Stuff" />
    {#each items.slice(2, 8) as item, i}
      <ListItem
        icon={item.icon}
        imageSize={IconSize.Smallest}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i + 2),
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
    {#each items.slice(8) as item, i}
      <ListItem
        icon={item.icon}
        imageSize={IconSize.Smallest}
        primaryText={item.text}
        navi={{
          itemId: item.id,
          shortcutKey: getShortcutFromIndex(i + 8),
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
    flex: 1;
  }
  .avatar {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
  .scroller {
    overflow-y: auto;
    flex: 1;
  }
  .logo {
    height: 28px;
    width: 28px;
  }
</style>
