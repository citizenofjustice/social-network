import { useCallback, useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import UserWidget from "scenes/widgets/UserWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { fetchUser } from "API";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const userId = useSelector((state) => state.auth.user._id);
  const userFriends = useSelector((state) => state.auth.user.friends);
  const token = useSelector((state) => state.auth.token);
  const [user, setUser] = useState(null);

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
      gap="0.5rem"
      justifyContent="space-between"
    >
      <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
        <UserWidget user={user} />
      </Box>
      <Box
        flexBasis={isNonMobileScreens ? "42%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
      >
        <PostsWidget userId={user._id} />
      </Box>
      {isNonMobileScreens && (
        <Box flexBasis="26%">
          <AdvertWidget />
          <Box m="2rem 0" />
          <FriendListWidget userId={user._id} />
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
