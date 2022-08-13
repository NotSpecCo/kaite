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
  import { Twitter } from '../services/twitter';

  registerView({});

  onMount(async () => {
    const code = window.location.search.split('code=')[1];
    if (!code) return;

    const twitter = new Twitter();
    await twitter
      .fetchTokensFromCode(code)
      .then((result) => twitter.setUser(result))
      .catch((err) => console.log('fetchTokensFromCode err', err));
    window.close();
  });

  onMount(async () => {
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Kaite" />
      <CardContent>
        <Typography>Logging in...</Typography>
      </CardContent>
    </Card>
  </ViewContent>
</View>
