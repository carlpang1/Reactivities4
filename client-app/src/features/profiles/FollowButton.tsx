import { observer } from "mobx-react-lite";
import React, { SyntheticEvent } from "react";
import { Button, Reveal } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import UserStore from "../../app/stores/userStore";

interface Props {
  profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
  const {
    userStore,
    profileStore: { updateFollowing, loading },
  } = useStore();
  if (userStore.user?.username == profile.username) return null;

  console.log(profile);

  function handleFollow(e: SyntheticEvent, username: string) {
    e.preventDefault();
    profile.following
      ? updateFollowing(username, false)
      : updateFollowing(username, true);
  }
  return (
    <>
      <Reveal animated="move">
        <Reveal.Content visible style={{ width: "100%" }}>
          <Button
            fluid
            color="teal"
            content={profile.following ? "Following" : "Not following"}
          />
        </Reveal.Content>
        <Reveal.Content hidden style={{ width: "100%" }}>
          <Button
            basic
            fluid
            loading={loading}
            color={profile.following ? "red" : "green"}
            content={profile.following ? "Unfollow" : "Follow"}
            onClick={(e) => handleFollow(e, profile.username)}
          />
        </Reveal.Content>
      </Reveal>
    </>
  );
});
