<script lang="ts">
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import FormRow from 'onyx-ui/components/form/FormRow.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { DataStatus } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import { Twitter } from '../services/twitter';

  registerView({});

  const getData = new Twitter().getUser();

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });
</script>

<View>
  <ViewContent>
    <Card>
      <CardHeader title="Profile" />
      <CardContent>
        {#await getData}
          <Typography>Loading...</Typography>
        {:then user}
          <div class="avatar-container">
            <img src={user.avatarUrl} alt="" class="avatar" />
          </div>
          <Typography type="title" align="center" padding="horizontal">{user.name}</Typography>
          <Typography type="bodyLarge" align="center" padding="horizontal"
            >@{user.username}</Typography
          >
          <Typography type="caption" align="center">{user.location}</Typography>
          <Divider title="Bio" />
          <Typography type="body">{user.description}</Typography>
          <Divider title="Stats" />
          <FormRow
            label="Tweets"
            navi={{
              itemId: 'tweets',
              // onSelect: () => push(`/user/${user.id}/tweets`),
            }}>{user.tweetCount}</FormRow
          >
          <FormRow
            label="Followers"
            navi={{
              itemId: 'followers',
              // onSelect: () => push(`/user/${user.id}/followers`),
            }}>{user.followersCount}</FormRow
          >
          <FormRow
            label="Following"
            navi={{
              itemId: 'following',
              // onSelect: () => push(`/user/${user.id}/following`),
            }}>{user.followingCount}</FormRow
          >
        {:catch}
          <Typography align="center">Failed to load user data</Typography>
        {/await}
      </CardContent>
    </Card>
  </ViewContent>
</View>

<style>
  .avatar-container {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
  .avatar {
    border-radius: 50%;
    height: 72px;
    width: 72px;
  }
</style>
