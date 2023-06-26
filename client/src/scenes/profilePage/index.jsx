import { Box, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { fetchUser } from "API";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userFriends = useSelector((state) => state.auth.user.friends);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");
  const isOneself = userId === _id;

  const getUserData = useCallback(async () => {
    const data = await fetchUser(userId, token);
    setUser(data);
  }, [userId, token]);

  useEffect(() => {
    getUserData();
  }, [getUserData, userFriends]);

  if (!user) return null;

  return (
    <Box
      width="100%"
      p="2rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="2rem"
      justifyContent="center"
    >
      <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
        <UserWidget user={user} />
        <Box m="2rem 0" />
        <FriendListWidget userId={userId} />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? "42%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
      >
        {isOneself && <MyPostWidget picturePath={user.picturePath} />}
        <PostsWidget userId={userId} isProfile />
      </Box>
    </Box>
  );
};

export default ProfilePage;
