<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { Onyx } from 'onyx-ui/services';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { push } from 'svelte-spa-router';
  import type { User } from '../models';
  import { DataService } from '../services/data';

  export let params: { listId: string };

  registerView({});

  let users: User[] = null;

  onMount(async () => {
    users = await new DataService().getListMembers(params.listId);
    console.log('users', users);

    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="List Members" />
      <CardContent>
        {#if users === null}
          <Typography align="center">Loading...</Typography>
        {:else}
          {#each users as user, i}
            <ListItem
              imageUrl={user.avatarUrl}
              imageStyle="circle"
              primaryText={user.name}
              secondaryText={`@${user.username}`}
              navi={{
                itemId: `user${i}`,
                onSelect: () => push(`/user/${user.id}`),
              }}
              contextMenu={{
                title: user.name || `@${user.username}`,
                items: [
                  {
                    label: 'View Profile',
                    onSelect: async () => {
                      push(`/user/${user.id}`);
                      Onyx.contextMenu.close();
                    },
                  },
                  {
                    label: 'Follow',
                    onSelect: async () => {
                      await new DataService().followUser(user.id);
                      Onyx.contextMenu.close();
                    },
                  },
                  {
                    label: 'Unfollow',
                    onSelect: async () => {
                      await new DataService().unfollowUser(user.id);
                      Onyx.contextMenu.close();
                    },
                  },
                ],
              }}
            />
          {:else}
            <Typography align="center">No users</Typography>
          {/each}
        {/if}
      </CardContent>
    </Card>
  </ViewContent>
</View>
