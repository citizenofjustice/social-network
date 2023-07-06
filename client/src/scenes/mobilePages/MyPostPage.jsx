import { Box, useMediaQuery } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PostsWidget from "scenes/widgets/PostsWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import { fetchUser } from "API";

const MyPostPage = () => {
  const [user, setUser] = useState(null);
  const { _id } = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const userFriends = useSelector((state) => state.auth.user.friends);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px");

  const getUserData = useCallback(async () => {
    const data = await fetchUser(_id, token);
    setUser(data);
  }, [_id, token]);

  useEffect(() => {
    getUserData();
  }, [getUserData, userFriends]);

  if (!user) return null;

  return (
    <Box
      width="100%"
      p="0rem 6%"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="2rem"
      justifyContent="center"
    >
      <Box
        flexBasis={isNonMobileScreens ? "42%" : undefined}
        mt={isNonMobileScreens ? undefined : "2rem"}
      >
        <MyPostWidget
          picturePath={user.picturePath}
          isNonMobileScreens={isNonMobileScreens}
        />
        <PostsWidget userId={_id} isProfile />
      </Box>
    </Box>
  );
};

export default MyPostPage;
