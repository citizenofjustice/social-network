import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
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

  const { palette } = useTheme();
  const background = palette.background.default;

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
      alignItems="flex-start"
    >
      <Box
        sx={{
          position: "sticky",
          top: "0",
          zIndex: "10",
          padding: "2rem 0 0",
          backgroundColor: background,
        }}
      >
        <MyPostWidget
          picturePath={user.picturePath}
          isNonMobileScreens={isNonMobileScreens}
        />
        <Divider sx={{ margin: "1rem 0" }} />
      </Box>
      <Box>
        <PostsWidget userId={_id} isProfile />
      </Box>
    </Box>
  );
};

export default MyPostPage;
