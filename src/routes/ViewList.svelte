<script lang="ts">
  import numeral from 'numeral';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import type { List } from '../models';
  import { DataService } from '../services/data';

  export let params: { listId: string };

  let getData: Promise<List>;

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });

  $: if (params.listId) {
    getData = new DataService().getListById(params.listId);
  }
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="View List" />
      <CardContent>
        {#await getData}
          <Typography>Loading...</Typography>
        {:then list}
          <Typography type="title" align="center">{list.name}</Typography>
          {#if list.description}
            <Typography>{list.description}</Typography>
          {/if}
          <Divider />
          <ListItem
            primaryText={`${numeral(list.followerCount).format('0.[00]a')} followers`}
            navi={{
              itemId: 'followers',
              onSelect: () => push(`/list/${params.listId}/followers`),
            }}
          />
          <ListItem
            primaryText={`${numeral(list.memberCount).format('0.[00]a')} members`}
            navi={{
              itemId: 'members',
              onSelect: () => push(`/list/${params.listId}/members`),
            }}
          />
        {:catch err}
          <Typography>{err.message}</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>
