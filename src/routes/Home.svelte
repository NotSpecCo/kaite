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
  import type { User } from '../models';
  import { Twitter } from '../services/twitter';

  registerView({});

  let user: User;

  onMount(async () => {
    user = await new Twitter().getUser();
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Welcome" />
      <CardContent>
        <Typography>Hello, {user?.name}</Typography>
      </CardContent>
    </Card>
  </ViewContent>
</View>
