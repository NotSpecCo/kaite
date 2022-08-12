<script lang="ts">
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
  import { DataService } from '../services/data';

  registerView({});

  onMount(async () => {
    await new DataService().logout();
    replace('/login');
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
        <Typography align="center" padding="both">Logging out...</Typography>
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
