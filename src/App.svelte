<script lang="ts">
  import Dashboard from 'onyx-ui/components/app/Dashboard.svelte';
  import OnyxApp from 'onyx-ui/components/app/OnyxApp.svelte';
  import { Priority } from 'onyx-ui/enums';
  import { KeyManager, Onyx } from 'onyx-ui/services';
  import { onMount } from 'svelte';
  import Router, { location, pop, replace } from 'svelte-spa-router';
  import AppMenu from './components/AppMenu.svelte';
  import Home from './routes/Home.svelte';
  import LogIn from './routes/LogIn.svelte';
  import Oauth from './routes/Oauth.svelte';
  import Redirect from './routes/Redirect.svelte';
  import Timeline from './routes/Timeline.svelte';
  import { Twitter } from './services/twitter';
  import { settings } from './stores/settings';

  console.log(`Env: ${process.env.NODE_ENV}`);

  const routes = {
    '/': Home,
    '/login': LogIn,
    '/oauth': Oauth,
    '/timeline': Timeline,
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
    const code = window.location.search.split('code=')[1];
    if (code) {
      console.log('is oauth flow');
      replace(`/oauth?code=${code}`);
      return;
    }

    const loggedIn = await new Twitter().isLoggedIn();
    if (!loggedIn) {
      console.log('is not logged in');
      replace(`/login`);
      return;
    }

    console.log('is logged in');

    replace('/');
  });

  $: Onyx.settings.update($settings);
</script>

<OnyxApp>
  <AppMenu slot="app-menu" />
  <Router {routes} />
  {#if false}
    <Dashboard slot="dashboard">Hello</Dashboard>
  {/if}
</OnyxApp>
