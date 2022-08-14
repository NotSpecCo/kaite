<script lang="ts">
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
  import { AuthClient } from '../services/authClient';
  import { Storage } from '../services/storage';

  registerView({});

  async function login() {
    const windowRef = window.open(AuthClient.buildLoginUrl());
    const timer = setInterval(() => {
      const user = Storage.getItem('authenticated_user');
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
