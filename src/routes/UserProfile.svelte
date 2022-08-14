<script lang="ts">
  import numeral from 'numeral';
  import Button from 'onyx-ui/components/buttons/Button.svelte';
  import Card from 'onyx-ui/components/card/Card.svelte';
  import CardContent from 'onyx-ui/components/card/CardContent.svelte';
  import CardHeader from 'onyx-ui/components/card/CardHeader.svelte';
  import Divider from 'onyx-ui/components/divider/Divider.svelte';
  import ListItem from 'onyx-ui/components/list/ListItem.svelte';
  import Typography from 'onyx-ui/components/Typography.svelte';
  import View from 'onyx-ui/components/view/View.svelte';
  import ViewContent from 'onyx-ui/components/view/ViewContent.svelte';
  import { Color, DataStatus, IconSize } from 'onyx-ui/enums';
  import { registerView, updateView } from 'onyx-ui/stores/view';
  import { onMount } from 'svelte';
  import FaAt from 'svelte-icons/fa/FaAt.svelte';
  import FaBookmark from 'svelte-icons/fa/FaBookmark.svelte';
  import FaHeart from 'svelte-icons/fa/FaHeart.svelte';
  import FaRegComment from 'svelte-icons/fa/FaRegComment.svelte';
  import FaUserAlt from 'svelte-icons/fa/FaUserAlt.svelte';
  import FaUserFriends from 'svelte-icons/fa/FaUserFriends.svelte';
  import { push } from 'svelte-spa-router';
  import { AuthClient } from '../services/authClient';
  import { DataService } from '../services/data';

  export let params: { userId: string };

  const isMe = params.userId === AuthClient.user?.id;

  function logout() {
    push('/logout');
  }

  registerView({});

  let getData = new DataService().getUserById(params.userId);

  onMount(async () => {
    await getData;
    updateView({ dataStatus: DataStatus.Loaded });
  });

  $: {
    getData = new DataService().getUserById(params.userId);
  }
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
          {#if user.location}
            <Typography type="caption" align="center">{user.location}</Typography>
          {/if}
          <Divider title="Bio" />
          <Typography type="body">{user.description}</Typography>
          <Divider title="Content" />
          <ListItem
            icon={FaRegComment}
            imageSize={IconSize.Smallest}
            primaryText={`Tweets`}
            navi={{
              itemId: 'tweets',
              onSelect: () => push(`/user/${params.userId}/tweets`),
            }}
          />
          <ListItem
            icon={FaAt}
            imageSize={IconSize.Smallest}
            primaryText={`Mentions`}
            navi={{
              itemId: 'mentions',
              onSelect: () => push(`/user/${params.userId}/mentions`),
            }}
          />
          <ListItem
            icon={FaHeart}
            imageSize={IconSize.Smallest}
            primaryText={`Likes`}
            navi={{
              itemId: 'likes',
              onSelect: () => push(`/user/${params.userId}/likes`),
            }}
          />
          {#if isMe}
            <ListItem
              icon={FaBookmark}
              imageSize={IconSize.Smallest}
              primaryText={`Bookmarks`}
              navi={{
                itemId: 'bookmarks',
                onSelect: () => push(`/user/${params.userId}/bookmarks`),
              }}
            />
          {/if}
          <Divider title="Stats" />
          <ListItem
            icon={FaUserFriends}
            imageSize={IconSize.Smallest}
            primaryText={`${numeral(user.followersCount).format('0.[00]a')} followers`}
            navi={{
              itemId: 'followers',
              // onSelect: () => push(`/user/${params.userId}/tweets`),
            }}
          />
          <ListItem
            icon={FaUserAlt}
            imageSize={IconSize.Smallest}
            primaryText={`${numeral(user.followingCount).format('0.[00]a')} following`}
            navi={{
              itemId: 'following',
              // onSelect: () => push(`/user/${params.userId}/tweets`),
            }}
          />
          {#if user.id === AuthClient.user?.id}
            <Button
              title="Log out"
              navi={{ itemId: 'logout', onSelect: logout }}
              color={Color.Accent}
            />
          {/if}
        {:catch}
          <Typography align="center">Failed to load user data</Typography>
          <Button
            title="Log out"
            navi={{ itemId: 'logout', onSelect: logout }}
            color={Color.Accent}
          />
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
