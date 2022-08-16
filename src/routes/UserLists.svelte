<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus, IconSize } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import FaListUl from 'svelte-icons/fa/FaListUl.svelte';
  import { push } from 'svelte-spa-router';
  import type { List } from '../models';
  import { DataService } from '../services/data';

  export let params: { userId: string };

  registerView({});

  let lists: List[] = null;

  onMount(async () => {
    lists = await new DataService().getUserLists(params.userId);
    console.log('lists', lists);

    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Lists" />
      <CardContent>
        {#if lists === null}
          <Typography align="center">Loading...</Typography>
        {:else}
          {#each lists as list, i}
            <ListItem
              icon={FaListUl}
              imageSize={IconSize.Smallest}
              primaryText={list.name}
              secondaryText={list.description}
              navi={{ itemId: `list${i}`, onSelect: () => push(`/list/${list.id}`) }}
              contextMenu={{
                title: list.name,
                items: [
                  {
                    label: 'View List',
                    onSelect: async () => {
                      push(`/list/${list.id}`);
                      Onyx.contextMenu.close();
                    },
                  },
                  {
                    label: 'View Members',
                    onSelect: async () => {
                      push(`/list/${list.id}/members`);
                      Onyx.contextMenu.close();
                    },
                  },
                  {
                    label: 'View Followers',
                    onSelect: async () => {
                      push(`/list/${list.id}/followers`);
                      Onyx.contextMenu.close();
                    },
                  },
                ],
              }}
            />
          {:else}
            <Typography align="center">No lists</Typography>
          {/each}
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>
