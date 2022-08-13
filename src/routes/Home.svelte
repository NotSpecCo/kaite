<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import ViewFooter from 'onyx-ui/components/view/ViewFooter.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import type { User } from '../models';
  import { DataService } from '../services/data';

  registerView({});

  let user: User;

  onMount(async () => {
    user = await new DataService().getCurrentUser();
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Welcome" />
      <CardContent>
        <Typography>Hello, {user?.name}</Typography>
        <Typography
          >Welcome to Kaite, an open source Twitter client for KaiOS! There are a couple things I
          wanted to go over before you start exploring the app.</Typography
        >
        <Typography
          >First of all, the controls. The left soft key opens and closes the app menu. This will be
          your main way of navigating the app. The right soft key gets a little more complicated, as
          it has multiple functions. This is the context menu key. When you have an item selected,
          try pressing this key to see if there are any available actions you can perform. In some
          places, like the main timeline, you can long-press the right soft key to access a
          different menu. In the case of the timeline, long-pressing will bring up the current
          tweet's context menu.</Typography
        >
        <Typography>Actually, that's pretty much it. Feel free to start exploring!</Typography>
      </CardContent>
    </Card>
  </ViewContent>
  <ViewFooter>
    <div class="container">
      <div class="label">App Menu</div>
      <div class="label">Context Menu</div>
    </div>
  </ViewFooter>
</View>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    font-weight: 600;
  }
</style>
