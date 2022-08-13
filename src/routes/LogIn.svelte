<script lang="ts">
  import KaiOS from 'kaios-lib';
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { replace } from 'svelte-spa-router';
  import { Twitter } from '../services/twitter';

  const localStorage = new KaiOS.LocalStorage();

  registerView({});

  async function login() {
    const config = new Twitter().getConfig();

    const url = new URL('https://twitter.com/i/oauth2/authorize');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', config.clientId);
    url.searchParams.append('redirect_uri', config.redirectUri);
    url.searchParams.append(
      'scope',
      'tweet.read tweet.write offline.access users.read follows.read follows.write like.read like.write list.read bookmark.read bookmark.write'
    );
    url.searchParams.append('state', 'state');
    url.searchParams.append('code_challenge', 'challenge');
    url.searchParams.append('code_challenge_method', 'plain');

    const windowRef = window.open(url.toString());
    const timer = setInterval(() => {
      const user = localStorage.getItem('twitter_user');
      if (user) {
        clearInterval(timer);
        replace('/');
      }
    }, 500);
  }

  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Kaite" />
      <CardContent>
        <div class="logo">
          <img src="/images/icon_112.png" alt="" />
        </div>
        <Typography align="center" padding="both">
          Hello! Welcome to Kaite, a Twitter app for KaiOS. Log in below to get started.
        </Typography>
        <Button
          title="Log In"
          navi={{
            itemId: `login`,
            onSelect: async () => login(),
          }}
        />
      </CardContent>
    </Card>
  </ViewContent>
</View>

<style>
  .logo {
    text-align: center;
    margin: 15px 0;
  }
  .logo > img {
    height: 72px;
    width: 72px;
  }
</style>
