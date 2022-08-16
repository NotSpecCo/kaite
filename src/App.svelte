<script lang="ts">
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager, Onyx } from 'onyx-ui/services';
  import { onMount } from 'svelte';
  import Router, { location, pop, replace } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import AppSettings from './routes/AppSettings.svelte';
  import Compose from './routes/Compose.svelte';
  import Home from './routes/Home.svelte';
  import ListFollowers from './routes/ListFollowers.svelte';
  import ListMembers from './routes/ListMembers.svelte';
  import LogIn from './routes/LogIn.svelte';
  import LogOut from './routes/LogOut.svelte';
  import Oauth from './routes/Oauth.svelte';
  import Redirect from './routes/Redirect.svelte';
  import Timeline from './routes/Timeline.svelte';
  import UserBookmarks from './routes/UserBookmarks.svelte';
  import UserLikes from './routes/UserLikes.svelte';
  import UserLists from './routes/UserLists.svelte';
  import UserMentions from './routes/UserMentions.svelte';
  import UserProfile from './routes/UserProfile.svelte';
  import UserTweets from './routes/UserTweets.svelte';
  import ViewList from './routes/ViewList.svelte';
  import ViewTweet from './routes/ViewTweet.svelte';
  import { AuthClient } from './services/authClient';
  import { KaiAds } from './services/kaiAds';
  import { settings } from './stores/settings';

  console.log(`Env: ${process.env.NODE_ENV}`);

  const routes = {
    '/': Home,
    '/login': LogIn,
    '/logout': LogOut,
    '/oauth': Oauth,
    '/compose': Compose,
    '/timeline/:tweetId?': Timeline,
    '/tweet/:tweetId': ViewTweet,
    '/user/:userId': UserProfile,
    '/user/:userId/tweets/:tweetId?': UserTweets,
    '/user/:userId/mentions/:tweetId?': UserMentions,
    '/user/:userId/likes/:tweetId?': UserLikes,
    '/user/:userId/bookmarks/:tweetId?': UserBookmarks,
    '/user/:userId/lists': UserLists,
    '/list/:listId': ViewList,
    '/list/:listId/members': ListMembers,
    '/list/:listId/followers': ListFollowers,
    '/settings/:cardId?': AppSettings,
    '*': Redirect,
  };

  // TODO: Fix this in a better way
  document.addEventListener('keydown', (ev) => {
    if (
      ev.key === 'Backspace' &&
      $location !== '/' &&
      (ev.target as any).contentEditable !== 'true'
    ) {
      ev.preventDefault();
    }
  });
  const keyMan = KeyManager.subscribe(
    {
      onBackspace: () => {
        // If on the main screen, let KaiOS minimize the app
        if ($location === '/') {
          console.log('exit app');
          return false;
        }

        pop();
        return true;
      },
    },
    Priority.Low
  );

  onMount(async () => {
    KaiAds.startListening();

    const code = window.location.search.split('code=')[1];
    if (code) {
      console.log('is oauth flow');
      replace(`/oauth?code=${code}`);
      return;
    }

    if (!AuthClient.user) {
      console.log('is not logged in');
      replace(`/login`);
      return;
    }

    console.log('is logged in');
    if ($location === '/') replace(`/timeline`);
  });

  $: Onyx.settings.update($settings);
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <Router {routes} />
</OnyxApp>
